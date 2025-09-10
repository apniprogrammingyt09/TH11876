import React, { useRef, useState } from 'react';
import { Camera, Loader2, MapPin, AlertCircle } from 'lucide-react';
import { createLostReport } from '../../../../Services/api';
import { useUser } from '@clerk/clerk-react';
import { useToast } from '../../../General/Toast.jsx';

/** @typedef {{ id:string; type:'person'|'item'; description:string; photoUrls:string[]; location:string; status:'open'|'matched'|'resolved'|'missing'|'cancelled'; createdAt:string; reporterId:string; matchedWith?:string; resolvedAt?:string }} LostCase */

// Updated Lost Report form aligned to backend required fields (upload_lost)
// Required (per API): name, gender, age, where_lost, your_name, relation_with_lost, user_id, mobile_no, email_id, file
// We keep optional description for local UI only (sent as extra field if provided)
const LostReport = ({ volunteerId: volunteerIdProp, onCreated }) => {
  const { user } = useUser();
  const authId = user?.id;
  const volunteerId = volunteerIdProp || authId || 'anonymous';
  const { push } = useToast();
  const [photos, setPhotos] = useState([]); // File[] (only first used for API currently)
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [whereLost, setWhereLost] = useState('');
  const [reporterName, setReporterName] = useState('');
  const [relation, setRelation] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const inputRef = useRef(null);

  const addPhotos = (files) => {
    const list = Array.from(files||[]).slice(0,1); // backend accepts single file; limit to 1
    if(!list.length) return;
    setPhotos(list); // replace
  };

  const handlePhotoInput = e => addPhotos(e.target.files);

  const detectLocation = () => {
    if(!navigator.geolocation){ return; }
    navigator.geolocation.getCurrentPosition(pos => {
      const { latitude, longitude } = pos.coords;
      setWhereLost(`Lat ${latitude.toFixed(4)}, Lng ${longitude.toFixed(4)}`);
    }, ()=>{}, { maximumAge:60000, timeout:5000 });
  };

  const canSubmit = photos.length>0 && name.trim() && relation.trim() && reporterName.trim() && gender && age && whereLost.trim() && mobile.trim() && email.trim();

  const [touched, setTouched] = useState({});
  const markTouched = (k) => setTouched(t => ({ ...t, [k]: true }));

  const fieldError = (k) => {
    const v = {
      name, gender, age, whereLost, reporterName, relation, mobile, email
    }[k];
    if(!touched[k]) return '';
    if(!v) return 'Required';
    if(k==='email' && v && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v)) return 'Invalid email';
    if(k==='age' && v && (+v<0 || +v>120)) return 'Invalid age';
    if(k==='mobile' && v && v.replace(/\D/g,'').length<7) return 'Too short';
    return '';
  };

  const submit = async () => {
    if(!canSubmit) return;
    setSubmitting(true); setError(null); setSuccess(false);
    try {
      const primaryFile = photos[0];
      const payload = {
        name: name.trim(),
        gender,
        age: age.trim(),
        where_lost: whereLost.trim(),
        your_name: reporterName.trim(),
        relation_with_lost: relation.trim(),
        user_id: volunteerId,
        mobile_no: mobile.trim(),
        email_id: email.trim(),
        description: description.trim() || undefined, // extra field (tolerated by backend if ignored)
        file: primaryFile
      };
      const res = await createLostReport(payload);
      const record = {
        id: res?.lost_id || res?.face_id || 'lost_'+Date.now(),
        type: 'person',
        description: `${name.trim()} (${age||'?' } yrs) – Last seen ${whereLost.trim()}`,
        photoUrls: [URL.createObjectURL(primaryFile)],
        location: whereLost.trim(),
        status: 'open',
        createdAt: new Date().toISOString(),
        reporterId: volunteerId
      };
      setSuccess(true);
      onCreated && onCreated(record);
  push('Lost report submitted.', { type:'success'});
      setTimeout(()=>{
        setSuccess(false);
        setName('');
        setGender('');
        setAge('');
        setWhereLost('');
        setReporterName('');
        setRelation('');
        setMobile('');
        setEmail('');
        setDescription('');
        setPhotos([]);
      }, 1500);
    } catch(e){
      setError(e?.message || 'Failed to submit report.');
    } finally { setSubmitting(false); }
  };

  return (
  <div className="space-y-5 text-xs mk-text-secondary">
  {success && <div className="p-2 rounded-md bg-green-500/10 text-green-300 border border-green-400/40 text-[11px]">Report submitted.</div>}
  {error && <div className="p-2 rounded-md bg-red-500/10 text-red-300 border border-red-400/40 text-[11px]">{error}</div>}
      <div className="grid grid-cols-3 gap-3">
        <div className="space-y-1 col-span-2">
          <label className="text-[11px] font-medium mk-text-secondary">Person Name *</label>
          <input value={name} onBlur={()=>markTouched('name')} onChange={e=>setName(e.target.value)} placeholder="Full name" className={`w-full h-9 rounded-md mk-border mk-surface-alt px-2 text-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400/60 placeholder:mk-text-fainter mk-text-primary ${fieldError('name') && 'border-red-500/60'}`} />
          {fieldError('name') && <p className="text-[10px] text-red-400">{fieldError('name')}</p>}
        </div>
        <div className="space-y-1">
          <label className="text-[11px] font-medium mk-text-secondary">Age *</label>
          <input type="number" min="0" value={age} onBlur={()=>markTouched('age')} onChange={e=>setAge(e.target.value)} placeholder="Age" className={`w-full h-9 rounded-md mk-border mk-surface-alt px-2 text-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400/60 placeholder:mk-text-fainter mk-text-primary ${fieldError('age') && 'border-red-500/60'}`} />
          {fieldError('age') && <p className="text-[10px] text-red-400">{fieldError('age')}</p>}
        </div>
        <div className="space-y-1 col-span-3">
          <label className="text-[11px] font-medium mk-text-secondary">Gender *</label>
          <select value={gender} onBlur={()=>markTouched('gender')} onChange={e=>setGender(e.target.value)} className={`h-9 rounded-md mk-border mk-surface-alt px-2 text-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400/60 mk-text-primary ${fieldError('gender') && 'border-red-500/60'}`}>
            <option value="">Select</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          {fieldError('gender') && <p className="text-[10px] text-red-400">{fieldError('gender')}</p>}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-[11px] font-medium mk-text-secondary">Your Name *</label>
          <input value={reporterName} onBlur={()=>markTouched('reporterName')} onChange={e=>setReporterName(e.target.value)} placeholder="Reporter name" className={`w-full h-9 rounded-md mk-border mk-surface-alt px-2 text-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400/60 placeholder:mk-text-fainter mk-text-primary ${fieldError('reporterName') && 'border-red-500/60'}`} />
          {fieldError('reporterName') && <p className="text-[10px] text-red-400">{fieldError('reporterName')}</p>}
        </div>
        <div className="space-y-1">
          <label className="text-[11px] font-medium mk-text-secondary">Relation *</label>
          <input value={relation} onBlur={()=>markTouched('relation')} onChange={e=>setRelation(e.target.value)} placeholder="Relation to person" className={`w-full h-9 rounded-md mk-border mk-surface-alt px-2 text-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400/60 placeholder:mk-text-fainter mk-text-primary ${fieldError('relation') && 'border-red-500/60'}`} />
          {fieldError('relation') && <p className="text-[10px] text-red-400">{fieldError('relation')}</p>}
        </div>
        <div className="space-y-1">
          <label className="text-[11px] font-medium mk-text-secondary">Mobile *</label>
          <input value={mobile} onBlur={()=>markTouched('mobile')} onChange={e=>setMobile(e.target.value)} placeholder="Contact number" className={`w-full h-9 rounded-md mk-border mk-surface-alt px-2 text-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400/60 placeholder:mk-text-fainter mk-text-primary ${fieldError('mobile') && 'border-red-500/60'}`} />
          {fieldError('mobile') && <p className="text-[10px] text-red-400">{fieldError('mobile')}</p>}
        </div>
        <div className="space-y-1">
          <label className="text-[11px] font-medium mk-text-secondary">Email *</label>
          <input type="email" value={email} onBlur={()=>markTouched('email')} onChange={e=>setEmail(e.target.value)} placeholder="email@example.com" className={`w-full h-9 rounded-md mk-border mk-surface-alt px-2 text-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400/60 placeholder:mk-text-fainter mk-text-primary ${fieldError('email') && 'border-red-500/60'}`} />
          {fieldError('email') && <p className="text-[10px] text-red-400">{fieldError('email')}</p>}
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-[11px] font-medium mk-text-secondary">Photo *</label>
        <div className="flex flex-wrap gap-3">
          {photos.map(f => (
            <div key={f.name} className="relative h-20 w-20 rounded-md overflow-hidden mk-border mk-surface-alt">
              <img src={URL.createObjectURL(f)} alt="preview" className="object-cover h-full w-full" />
              <button onClick={()=>setPhotos(p=>p.filter(x=>x.name!==f.name))} className="absolute -top-1 -right-1 bg-red-600/80 hover:bg-red-600 text-white h-5 w-5 rounded-full text-[11px] flex items-center justify-center">✕</button>
            </div>
          ))}
          {photos.length<1 && (
            <label className="h-20 w-20 flex flex-col items-center justify-center gap-1 rounded-md border-2 border-dashed mk-border mk-text-muted text-[11px] cursor-pointer hover:border-orange-400/60 hover:mk-text-accent">
              <Camera size={18} />
              <span>Add</span>
              <input ref={inputRef} onChange={handlePhotoInput} accept="image/*" capture="environment" type="file" hidden />
            </label>
          )}
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-[11px] font-medium mk-text-secondary">Description <span className="mk-text-fainter">(optional)</span></label>
        <textarea rows={3} value={description} onChange={e=>setDescription(e.target.value)} className="w-full rounded-md mk-border mk-surface-alt p-2 resize-none focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400/60 placeholder:mk-text-fainter mk-text-primary" placeholder="Clothing, distinctive marks, etc." />
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-medium mk-text-secondary flex items-center gap-1"><MapPin size={12}/> Where Lost *</label>
          <button type="button" onClick={detectLocation} className="text-[10px] underline mk-text-accent hover:mk-text-accent-strong">Auto-detect</button>
        </div>
        <input value={whereLost} onBlur={()=>markTouched('whereLost')} onChange={e=>setWhereLost(e.target.value)} placeholder="Zone 5 or coordinates" className={`w-full h-10 rounded-md mk-border mk-surface-alt px-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400/60 placeholder:mk-text-fainter mk-text-primary ${fieldError('whereLost') && 'border-red-500/60'}`} />
        {fieldError('whereLost') && <p className="text-[10px] text-red-400">{fieldError('whereLost')}</p>}
      </div>
      <div className="pt-2 flex justify-end">
        <button disabled={!canSubmit || submitting} onClick={submit} className="h-10 px-5 rounded-md bg-gradient-to-r from-[var(--mk-accent)] to-[var(--mk-accent-strong)] text-[#081321] text-xs font-semibold flex items-center gap-2 disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400/60 hover:brightness-110">{submitting && <Loader2 size={14} className="animate-spin"/>} Submit Report</button>
      </div>
      {!canSubmit && (name||relation||whereLost||mobile||email||photos.length>0) && (
        <div className="text-[10px] flex items-start gap-1 text-amber-400/80"><AlertCircle size={12}/> Fill all required fields ( * ) and add one photo.</div>
      )}
    </div>
  );
};

export default LostReport;
