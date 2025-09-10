// Save this file as Map.jsx
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import * as Location from "expo-location";
import * as SecureStore from "expo-secure-store";
import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, {
  Heatmap,
  Marker,
  PROVIDER_GOOGLE,
  Polyline,
} from "react-native-maps";

const API_BASE = "https://krish09bha-dhruvai2.hf.space";

export default function Map() {
  const [region, setRegion] = useState({
    latitude: 23.1793,
    longitude: 75.7849,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });
  const [markers, setMarkers] = useState([]);
  const [selectedPin, setSelectedPin] = useState(null);
  const [distanceTime, setDistanceTime] = useState(null);
  const [routeCoords, setRouteCoords] = useState([]);
  const [heatmapPoints, setHeatmapPoints] = useState([]);
  const [heatmapVisible, setHeatmapVisible] = useState(false);
  const [userHistory, setUserHistory] = useState([]);

  const mapRef = useRef(null);
  const heatmapIntervalRef = useRef(null);

  // --- Persist unique user id ---
  async function getUserId() {
    let uid = await SecureStore.getItemAsync("user_id");
    if (!uid) {
      uid = "user_" + Math.random().toString(36).substring(2, 10);
      await SecureStore.setItemAsync("user_id", uid);
    }
    return uid;
  }

  // --- Initial location ---
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Denied", "Enable Location in settings.");
        return;
      }
      let loc = await Location.getCurrentPositionAsync({});
      setRegion((r) => ({
        ...r,
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      }));
      console.log("📍 Initial Region set:", loc.coords);
    })();
  }, []);

  // --- Fetch facilities ---
  useEffect(() => {
    const fetchMarkers = async () => {
      try {
        let res = await fetch(`${API_BASE}/api/user-map-data`);
        let data = await res.json();
        setMarkers(data.markers || []);
        console.log("✅ Facilities Loaded:", data.total_markers);
      } catch (err) {
        console.error("❌ Error fetching facilities:", err);
      }
    };
    fetchMarkers();
  }, []);

  // --- Location update every 30 sec ---
  useEffect(() => {
    const sendLocationUpdate = async () => {
      try {
        let loc = await Location.getCurrentPositionAsync({});
        const user_id = await getUserId();
        await fetch(`${API_BASE}/api/location-update`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id,
            lat: loc.coords.latitude,
            lng: loc.coords.longitude,
            timestamp: new Date().toISOString(),
            device_info: "Expo RN App",
          }),
        });
        console.log("📡 Location update sent:", loc.coords);
      } catch (err) {
        console.error("❌ Location update failed", err);
      }
    };
    sendLocationUpdate();
    const intervalId = setInterval(sendLocationUpdate, 30000);
    return () => clearInterval(intervalId);
  }, []);

  // --- Heatmap fetch ---
  const fetchHeatmap = async () => {
    try {
      let res = await fetch(`${API_BASE}/api/heatmap-data?hours=24`);
      let data = await res.json();
      let pts = data.heatmap_points.map((p) => ({
        latitude: p.lat,
        longitude: p.lng,
        weight: p.intensity,
      }));
      setHeatmapPoints(pts);
      console.log(`🔥 Heatmap loaded with ${data.total_points} points`);
    } catch (err) {
      console.error("❌ Heatmap fetch error:", err);
    }
  };

  // Auto-refresh every 5 min
  useEffect(() => {
    if (heatmapVisible) {
      fetchHeatmap();
      heatmapIntervalRef.current = setInterval(fetchHeatmap, 5 * 60 * 1000);
    } else if (heatmapIntervalRef.current) {
      clearInterval(heatmapIntervalRef.current);
    }
    return () => {
      if (heatmapIntervalRef.current) clearInterval(heatmapIntervalRef.current);
    };
  }, [heatmapVisible]);

  // --- Fetch history ---
  const fetchLocationHistory = async (hours = 6) => {
    try {
      const user_id = await getUserId();
      const res = await fetch(
        `${API_BASE}/api/user-location-history/${user_id}?hours=${hours}`
      );
      const data = await res.json();
      if (data?.locations) {
        setUserHistory(
          data.locations.map((p) => ({
            latitude: p.lat,
            longitude: p.lng,
          }))
        );
      }
      console.log(`📜 User History Loaded: ${data.total_points} points`);
    } catch (err) {
      console.error("❌ Error fetching history:", err);
    }
  };

  // --- Fetch route (OSRM) ---
  const fetchRoute = async (start, end) => {
    try {
      const url = `https://router.project-osrm.org/route/v1/driving/${start.longitude},${start.latitude};${end.longitude},${end.latitude}?overview=full&geometries=geojson`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.routes && data.routes.length) {
        const route = data.routes[0];
        const coords = route.geometry.coordinates.map((c) => ({
          latitude: c[1],
          longitude: c[0],
        }));
        setRouteCoords(coords);
        setDistanceTime({
          dist: `${(route.distance / 1000).toFixed(1)} km`,
          time: `${Math.round(route.duration / 60)} min`,
        });
        mapRef.current.fitToCoordinates(coords, {
          edgePadding: { top: 50, right: 50, bottom: 150, left: 50 },
          animated: true,
        });
      }
    } catch (err) {
      console.error("❌ Routing error:", err);
    }
  };

  // --- Handlers ---
  const handleMarkerPress = (m) => {
    const dest = { latitude: m.lat, longitude: m.lng, name: m.name };
    setSelectedPin(dest);
    fetchRoute(region, dest);
  };
  const handleMapPress = (event) => {
    const dest = {
      latitude: event.nativeEvent.coordinate.latitude,
      longitude: event.nativeEvent.coordinate.longitude,
      name: "Custom Point",
    };
    setSelectedPin(dest);
    fetchRoute(region, dest);
  };

  return (
    <View style={styles.container}>
      {/* Map */}
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={region}
        showsUserLocation
        ref={mapRef}
        onPress={handleMapPress}
      >
        {markers.map((m) => (
          <Marker
            key={m.id}
            coordinate={{ latitude: m.lat, longitude: m.lng }}
            title={m.name}
            description={m.description}
            onPress={() => handleMarkerPress(m)}
          >
            <Ionicons
              name={
                m.type === "toilets"
                  ? "water"
                  : m.type === "food_distribution"
                  ? "fast-food"
                  : "medkit"
              }
              size={28}
              color={
                m.type === "toilets"
                  ? "#3498db"
                  : m.type === "food_distribution"
                  ? "#2ecc71"
                  : "#e74c3c"
              }
            />
          </Marker>
        ))}

        {selectedPin && (
          <Marker coordinate={selectedPin} title={selectedPin.name} />
        )}

        {routeCoords.length > 0 && (
          <Polyline coordinates={routeCoords} strokeColor="blue" strokeWidth={5} />
        )}

        {userHistory.length > 1 && (
          <Polyline coordinates={userHistory} strokeColor="orange" strokeWidth={3} />
        )}

        {heatmapVisible && heatmapPoints.length > 0 && (
          <Heatmap
            points={heatmapPoints}
            opacity={0.7}
            radius={40}
            gradient={{
              colors: ["blue", "cyan", "lime", "yellow", "red"],
              startPoints: [0.01, 0.25, 0.5, 0.75, 1],
              colorMapSize: 256,
            }}
          />
        )}
      </MapView>

      {/* Directions Card */}
      {distanceTime && (
        <View style={styles.directionsCard}>
          <View style={styles.headerRow}>
            <Text style={styles.cardTitle}>Drive</Text>
            <View style={styles.headerActions}>
              <TouchableOpacity style={styles.headerIcon}>
                <Ionicons name="options-outline" size={20} color="#2c3e50" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.headerIcon}
                onPress={() => {
                  setSelectedPin(null);
                  setRouteCoords([]);
                  setDistanceTime(null);
                }}
              >
                <Ionicons name="close" size={22} color="#2c3e50" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.modeRow}>
            <TouchableOpacity style={styles.modeBtn}>
              <Ionicons name="car-outline" size={18} color="#2c3e50" />
              <Text style={styles.modeText}>{distanceTime.time}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modeBtn}>
              <Ionicons name="bicycle-outline" size={18} color="#2c3e50" />
              <Text style={styles.modeText}>4 min</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modeBtn}>
              <Ionicons name="bus-outline" size={18} color="#2c3e50" />
              <Text style={styles.modeText}>19 min</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modeBtn}>
              <Ionicons name="walk-outline" size={18} color="#2c3e50" />
              <Text style={styles.modeText}>19 min</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.timeBig}>
            {distanceTime.time} ({distanceTime.dist})
          </Text>
          <Text style={styles.subInfo}>Fastest route • Saves 6% petrol</Text>

          <View style={styles.actionsRow}>
            <TouchableOpacity style={styles.startBtn}>
              <Ionicons
                name="play-outline"
                size={18}
                color="#fff"
                style={{ marginRight: 6 }}
              />
              <Text style={styles.startText}>Start</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.secondaryBtn}
              onPress={() => fetchLocationHistory()}
            >
              <Ionicons name="add-circle-outline" size={18} color="#fff" />
              <Text style={styles.secondaryText}>Add stops</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryBtn}>
              <Ionicons name="share-social-outline" size={18} color="#fff" />
              <Text style={styles.secondaryText}>Share</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Heatmap Button */}
      <View style={styles.heatmapBtnContainer}>
        <BlurView intensity={80} tint="light" style={styles.circleBtn}>
          <TouchableOpacity
            onPress={() => {
              if (!heatmapVisible) fetchHeatmap();
              setHeatmapVisible((h) => !h);
            }}
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
          >
            <Ionicons
              name="bonfire-outline"
              size={22}
              color={heatmapVisible ? "#e74c3c" : "#2c3e50"}
            />
          </TouchableOpacity>
        </BlurView>
      </View>
    </View>
  );
}

// --- Styles ---
const styles = StyleSheet.create({
  container: { flex: 1 },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  directionsCard: {
    position: "absolute",
    bottom: 80,
    left: 0,
    right: 0,
    backgroundColor: "rgba(255, 255, 255, 0.97)",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    elevation: 12,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: -3 },
    shadowRadius: 6,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  headerActions: { flexDirection: "row" },
  headerIcon: { marginLeft: 12 },
  cardTitle: { fontSize: 18, fontWeight: "600", color: "#2c3e50" },
  modeRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 10,
  },
  modeBtn: { alignItems: "center" },
  modeText: { fontSize: 13, marginTop: 2, color: "#2c3e50" },
  timeBig: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 4,
  },
  subInfo: { fontSize: 14, color: "green", marginBottom: 14 },
  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  startBtn: {
    flexDirection: "row",
    backgroundColor: "#2ecc71",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    alignItems: "center",
  },
  startText: { color: "#fff", fontWeight: "600" },
  secondaryBtn: {
    flexDirection: "row",
    backgroundColor: "#3498db",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 25,
    alignItems: "center",
  },
  secondaryText: { color: "#fff", marginLeft: 6 },
  heatmapBtnContainer: { position: "absolute", top: 10, left: 20 },
  circleBtn: {
    width: 50,
    height: 50,
    borderRadius: 25,
    overflow: "hidden",
  },
});