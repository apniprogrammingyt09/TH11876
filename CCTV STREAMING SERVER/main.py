from fastapi import FastAPI, WebSocket, HTTPException
from fastapi.responses import StreamingResponse
from motor.motor_asyncio import AsyncIOMotorClient
import cv2
import asyncio
import json
from typing import List, Dict
import io
import threading
from concurrent.futures import ThreadPoolExecutor
import queue
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="CCTV Streaming Server")

# MongoDB connection
MONGO_URI = os.getenv("MONGO_URI")
client = AsyncIOMotorClient(MONGO_URI)
db = client.cctv_management

# Thread pool for video processing
executor = ThreadPoolExecutor(max_workers=10)

@app.on_event("startup")
async def startup_event():
    print("CCTV Streaming Server started")

@app.get("/")
async def root():
    return {"message": "CCTV Streaming Server"}

@app.get("/streams")
async def get_streams():
    try:
        streams = await db.cctvs.find({"status": "active"}).to_list(None)
        for stream in streams:
            stream["_id"] = str(stream["_id"])
        return streams
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/stream/{stream_id}")
async def get_stream(stream_id: str):
    try:
        stream = await db.cctvs.find_one({"_id": stream_id})
        if not stream:
            raise HTTPException(status_code=404, detail="Stream not found")
        stream["_id"] = str(stream["_id"])
        return stream
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

class VideoStreamer:
    def __init__(self, rtsp_url: str):
        self.rtsp_url = rtsp_url
        self.frame_queue = queue.Queue(maxsize=10)
        self.running = False
        
    def capture_frames(self):
        cap = cv2.VideoCapture(self.rtsp_url)
        cap.set(cv2.CAP_PROP_BUFFERSIZE, 1)
        
        while self.running:
            success, frame = cap.read()
            if not success:
                continue
                
            if not self.frame_queue.full():
                ret, buffer = cv2.imencode('.jpg', frame, [cv2.IMWRITE_JPEG_QUALITY, 80])
                if ret:
                    try:
                        self.frame_queue.put_nowait(buffer.tobytes())
                    except queue.Full:
                        pass
        cap.release()
        
    def start(self):
        self.running = True
        threading.Thread(target=self.capture_frames, daemon=True).start()
        
    def stop(self):
        self.running = False
        
    def get_frame(self):
        try:
            return self.frame_queue.get_nowait()
        except queue.Empty:
            return None

async def generate_frames(rtsp_url: str):
    streamer = VideoStreamer(rtsp_url)
    streamer.start()
    
    try:
        while True:
            frame_bytes = await asyncio.get_event_loop().run_in_executor(
                executor, streamer.get_frame
            )
            
            if frame_bytes:
                yield (b'--frame\r\n'
                       b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')
            
            await asyncio.sleep(0.033)  # ~30 FPS
    finally:
        streamer.stop()

@app.get("/video/{stream_id}")
async def video_feed(stream_id: str):
    try:
        stream = await db.cctvs.find_one({"_id": stream_id})
        if not stream:
            raise HTTPException(status_code=404, detail="Stream not found")
        
        rtsp_url = stream.get("video_source")
        if not rtsp_url:
            raise HTTPException(status_code=400, detail="No video source found")
        
        return StreamingResponse(
            generate_frames(rtsp_url),
            media_type="multipart/x-mixed-replace; boundary=frame"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.websocket("/ws/{stream_id}")
async def websocket_endpoint(websocket: WebSocket, stream_id: str):
    await websocket.accept()
    streamer = None
    
    try:
        stream = await db.cctvs.find_one({"_id": stream_id})
        if not stream:
            await websocket.send_text(json.dumps({"error": "Stream not found"}))
            return
        
        rtsp_url = stream.get("video_source")
        if not rtsp_url:
            await websocket.send_text(json.dumps({"error": "No video source"}))
            return
        
        streamer = VideoStreamer(rtsp_url)
        streamer.start()
        
        while True:
            frame_bytes = await asyncio.get_event_loop().run_in_executor(
                executor, streamer.get_frame
            )
            
            if frame_bytes:
                await websocket.send_bytes(frame_bytes)
            
            await asyncio.sleep(0.033)  # ~30 FPS
            
    except Exception as e:
        await websocket.send_text(json.dumps({"error": str(e)}))
    finally:
        if streamer:
            streamer.stop()

@app.on_event("shutdown")
async def shutdown_event():
    executor.shutdown(wait=True)
    client.close()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, workers=1)