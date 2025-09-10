import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Plus,
  LogOut,
  AlertCircle,
  Home as HomeIcon,
  FileText,
  Bell,
  Search,
  User as UserIcon,
  UploadCloud,
  UserPlus,
} from "lucide-react";
import { StatusBadge as VolunteerStatusBadge } from "../Volunteer/LostAndFound/LostAndFound";
import Home from "./Home/Home";
import MyReports from "./MyReports/MyReports";
import FoundMatches from "./FoundMatches/FoundMatches";
import Alerts from "./Alerts/Alerts";
import Profile from "./Profile/Profile";
import ReportLost from "./ReportLost/ReportLost";
import ReportFound from "./ReportFound/ReportFound";
import { listLostReports, getAllMatches } from "../../Services/api";

/** Fallback local StatusBadge if volunteer export path changes */
const statusStyles = {
  open: "bg-blue-500/15 text-blue-300 border-blue-400/30",
  matched: "bg-amber-500/15 text-amber-300 border-amber-400/30",
  resolved: "bg-green-500/15 text-green-300 border-green-400/30",
  cancelled: "bg-white/10 text-white/55 border-white/15",
};
const StatusBadge = ({ value }) => (
  <span
    className={`inline-flex items-center px-2 py-0.5 rounded-full border text-[10px] font-semibold uppercase tracking-wide ${statusStyles[value] || "bg-gray-100 text-gray-600 border-gray-200"}`}
  >
    {value}
  </span>
);

/** @typedef { { id:string; type:'person'|'item'; description:string; photoUrls:string[]; location:string; status:'open'|'matched'|'resolved'|'cancelled'; createdAt:string; matchedWith?:string; resolvedAt?:string } } UserReport */
/** @typedef { { id:string; message:string; type:'report_update'|'system'|'match'; ts:string; read:boolean } } UserAlert */
/** @typedef { { id:string; lost:UserReport; found:{ id:string; description:string; photoUrls:string[]; location:string; createdAt:string }; confidence:number; status:'pending'|'confirmed'|'rejected' } } UserMatch */

const rel = (iso) => {
  const d = Date.now() - new Date(iso).getTime();
  const m = Math.floor(d / 60000);
  if (m < 1) return "just now";
  if (m < 60) return m + "m";
  const h = Math.floor(m / 60);
  if (h < 24) return h + "h";
  const da = Math.floor(h / 24);
  return da + "d";
};

const TabButton = ({ active, onClick, children }) => (
  <button
    role="tab"
    aria-selected={active}
    onClick={onClick}
  className={`px-3 py-1.5 rounded-md text-xs font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400/60 transition ${active ? 'bg-gradient-to-r from-[var(--mk-accent)] to-[var(--mk-accent-strong)] text-[#081321] shadow' : 'mk-text-muted hover:mk-surface-alt'}`}
  >
    {children}
  </button>
);

// Card/StatCard now housed in child modules where needed

const UserDashboard = ({ userId = "user123", onLogout }) => {
  // Active tab key (home|reports|matches|alerts|profile)
  const [tab, setTab] = useState("home");
  const [reports, setReports] = useState(/** @type {UserReport[]} */ ([]));
  const [matches, setMatches] = useState(/** @type {UserMatch[]} */ ([]));
  const [alerts, setAlerts] = useState(/** @type {UserAlert[]} */ ([]));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [detailReport, setDetailReport] = useState(null);
  const [detailMatch, setDetailMatch] = useState(null);
  const [profile, setProfile] = useState({
    name: "John Doe",
    email: "john@example.com",
    phone: "+1 555 0100",
    password: "",
  });
  const [profileSaving, setProfileSaving] = useState(false);
  const [filterStatus, setFilterStatus] = useState("");

  // Removed legacy inline report modal state (now dedicated tabs)

  // Load from API
  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch lost reports
      let reportData = [];
      try {
        const lr = await listLostReports();
        // Attempt to detect array container (records | items | direct array)
        const arr = Array.isArray(lr) ? lr : (lr.records || lr.items || lr.data || []);
        reportData = arr.map((r, idx) => ({
          id: r.id || r.face_id || r._id || 'lr' + idx,
            // fallback type inference
          type: r.type || (r.age !== undefined || r.gender ? 'person' : 'item'),
          description: r.description || r.name || '(no description provided)',
          photoUrls: r.photoUrls || r.photos || [],
          location: r.location || r.last_known_location || r.where_lost || 'Unknown',
          status: r.status || 'open',
          createdAt: r.createdAt || r.upload_time || new Date().toISOString(),
          matchedWith: r.matchedWith,
          resolvedAt: r.resolvedAt,
        }));
      } catch (err) {
        // Soft fail (keep UI usable)
        setAlerts(a => [{ id:'al'+Date.now(), message:`Could not fetch reports: ${err.message}`, type:'system', ts:new Date().toISOString(), read:false }, ...a]);
      }

      // Fetch matches
      let matchData = [];
      try {
        const gm = await getAllMatches();
        const arr = Array.isArray(gm) ? gm : (gm.records || gm.data || []);
        matchData = arr.map((m, idx) => {
          const lostPerson = m.lost_person || {};
          const foundPerson = m.found_person || {};
          return {
            id: m.match_id || m.id || 'm' + idx,
            lost: {
              id: m.lost_face_id || lostPerson.face_id || ('lost'+idx),
              type: 'person',
              description: lostPerson.name || lostPerson.description || 'Lost person',
              photoUrls: lostPerson.photoUrls || [],
              location: lostPerson.where_lost || lostPerson.location || 'Unknown',
              status: (lostPerson.status === 'found' ? 'matched' : (lostPerson.status || 'open')), 
              createdAt: lostPerson.createdAt || m.match_time || new Date().toISOString(),
            },
            found: {
              id: m.found_face_id || foundPerson.face_id || ('found'+idx),
              description: foundPerson.name || foundPerson.description || 'Found person',
              photoUrls: foundPerson.photoUrls || [],
              location: foundPerson.location_found || foundPerson.location || 'Unknown',
              createdAt: foundPerson.createdAt || m.match_time || new Date().toISOString(),
            },
            confidence: m.confidence !== undefined ? m.confidence : 0.8, // backend currently not exposing
            status: m.match_status === 'confirmed' ? 'confirmed' : (m.match_status === 'rejected' ? 'rejected' : 'pending'),
          };
        });
      } catch (err) {
        setAlerts(a => [{ id:'al'+Date.now(), message:`Could not fetch matches: ${err.message}`, type:'system', ts:new Date().toISOString(), read:false }, ...a]);
      }

      setReports(reportData);
      setMatches(matchData);
      if (!reportData.length && !matchData.length) {
        setAlerts(a => [{ id:'al'+Date.now(), message:'No data retrieved from server yet.', type:'system', ts:new Date().toISOString(), read:false }, ...a]);
      }
    } catch (e) {
      setError('Failed to load user data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // Simulated realtime events
  useEffect(() => {
    if (loading) return;
    const ivMatch = setInterval(() => {
      // occasionally push a new match referencing an open report
      const open = reports.find((r) => r.status === "open");
      if (!open) return;
      const mid = "m" + Date.now();
      const match = {
        id: mid,
        lost: open,
        found: {
          id: "f" + Date.now(),
          description: "Found " + open.type + " possibly yours",
          photoUrls: [],
          location: "Zone " + (Math.floor(Math.random() * 6) + 1),
          createdAt: new Date().toISOString(),
        },
        confidence: 0.7 + Math.random() * 0.2,
        status: "pending",
      };
      setMatches((m) => [match, ...m]);
      setAlerts((a) => [
        {
          id: "al" + Date.now(),
          message: `New match for report ${open.id}.`,
          type: "match",
          ts: new Date().toISOString(),
          read: false,
        },
        ...a,
      ]);
    }, 150000);
    const ivAlert = setInterval(() => {
      setAlerts((a) => [
        {
          id: "al" + Date.now(),
          message: "System broadcast update.",
          type: "system",
          ts: new Date().toISOString(),
          read: false,
        },
        ...a,
      ]);
    }, 300000);
    return () => {
      clearInterval(ivMatch);
      clearInterval(ivAlert);
    };
  }, [loading, reports]);

  // Derived
  const totalReports = reports.length;
  const openReports = reports.filter((r) => r.status === "open").length;
  const resolvedReports = reports.filter((r) => r.status === "resolved").length;
  const recentActivity = useMemo(() => {
    const act = [];
    reports.forEach((r) =>
      act.push({ ts: r.createdAt, label: `Report ${r.id} created` })
    );
    matches.forEach((m) =>
      act.push({
        ts: m.found.createdAt,
        label: `Match candidate for ${m.lost.id}`,
      })
    );
    alerts.forEach((al) => act.push({ ts: al.ts, label: al.message }));
    return act.sort((a, b) => new Date(b.ts) - new Date(a.ts)).slice(0, 5);
  }, [reports, matches, alerts]);

  const filteredReports = useMemo(() => {
    let list = reports;
    if (filterStatus) list = list.filter((r) => r.status === filterStatus);
    return [...list].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
  }, [reports, filterStatus]);

  const startReport = () => setTab('report-lost');

  const cancelReport = (id) => {
    setReports((rs) =>
      rs.map((r) => (r.id === id ? { ...r, status: "cancelled" } : r))
    );
    setAlerts((a) => [
      {
        id: "al" + Date.now(),
        message: `Report ${id} cancelled.`,
        type: "report_update",
        ts: new Date().toISOString(),
        read: false,
      },
      ...a,
    ]);
    setDetailReport(null);
  };

  const confirmMatch = (id) => {
    setMatches((ms) =>
      ms.map((m) => (m.id === id ? { ...m, status: "confirmed" } : m))
    );
    // underlying report resolved
    setReports((rs) =>
      rs.map((r) =>
        matches.find((m) => m.id === id)?.lost.id === r.id
          ? { ...r, status: "resolved", resolvedAt: new Date().toISOString() }
          : r
      )
    );
    setAlerts((a) => [
      {
        id: "al" + Date.now(),
        message: `You confirmed a match.`,
        type: "report_update",
        ts: new Date().toISOString(),
        read: false,
      },
      ...a,
    ]);
    setDetailMatch(null);
  };
  const rejectMatch = (id) => {
    setMatches((ms) =>
      ms.map((m) => (m.id === id ? { ...m, status: "rejected" } : m))
    );
    setAlerts((a) => [
      {
        id: "al" + Date.now(),
        message: `You rejected a match.`,
        type: "report_update",
        ts: new Date().toISOString(),
        read: false,
      },
      ...a,
    ]);
    setDetailMatch(null);
  };

  const unreadAlerts = alerts.filter((a) => !a.read).length;
  const markAlertRead = (id) =>
    setAlerts((as) => as.map((a) => (a.id === id ? { ...a, read: true } : a)));
  const markAllAlertsRead = () =>
    setAlerts((as) => as.map((a) => (a.read ? a : { ...a, read: true })));

  const saveProfile = async () => {
    setProfileSaving(true);
    await new Promise((r) => setTimeout(r, 500));
    setProfileSaving(false);
    setAlerts((a) => [
      {
        id: "al" + Date.now(),
        message: "Profile updated successfully.",
        type: "system",
        ts: new Date().toISOString(),
        read: false,
      },
      ...a,
    ]);
  };

  const ActiveStatusBadge = VolunteerStatusBadge || StatusBadge;

  // Tab metadata for navigation (mobile + desktop)
  const tabs = [
    { key: "home", label: "Home", icon: HomeIcon },
    { key: "reports", label: "Reports", icon: FileText },
    { key: "report-lost", label: "Report Lost", icon: UserPlus },
    { key: "report-found", label: "Report Found", icon: UploadCloud },
    { key: "matches", label: "Matches", icon: Search },
    { key: "alerts", label: "Alerts", icon: Bell, badge: unreadAlerts },
    { key: "profile", label: "Profile", icon: UserIcon },
  ];

  const contentMap = {
    home: (
      <Home
        stats={{ total: totalReports, open: openReports, resolved: resolvedReports }}
        recent={recentActivity.map((r) => ({ label: r.label, time: rel(r.ts) }))}
      />
    ),
    reports: (
      <MyReports
        reports={reports}
        loading={loading}
        filterStatus={filterStatus}
        onFilterStatus={setFilterStatus}
        onCancel={cancelReport}
      />
    ),
    'report-lost': <ReportLost />,
    'report-found': <ReportFound userId={userId} />,
    matches: (
      <FoundMatches
        matches={matches}
        loading={loading}
        onConfirm={confirmMatch}
        onReject={rejectMatch}
      />
    ),
    alerts: (
      <Alerts
        alerts={alerts}
        onMarkRead={markAlertRead}
        onMarkAll={markAllAlertsRead}
        unread={alerts.filter((a) => !a.read).length}
      />
    ),
    profile: (
      <Profile
        profile={profile}
        onChange={setProfile}
        onSave={saveProfile}
        saving={profileSaving}
        onLogout={onLogout}
      />
    ),
  };
  const content = contentMap[tab];

  return (
    <div
      className="min-h-dvh flex flex-col lg:flex-row mk-gradient-bg mk-text-secondary lg:max-w-7xl lg:mx-auto lg:border-x mk-border"
      aria-label="User dashboard"
    >
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col w-64 mk-border-r mk-surface-alt backdrop-blur-sm">
        <div className="px-5 py-5 border-b mk-border flex items-center gap-3">
          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-orange-500 to-pink-500 text-white flex items-center justify-center font-semibold text-lg shadow-inner">
            {profile.name.slice(0, 1)}
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold mk-text-primary truncate">{profile.name}</span>
            <span className="text-[11px] mk-text-fainter">User Portal</span>
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto py-4 text-sm mk-text-secondary" role="tablist">
          <ul className="space-y-0.5 px-3">
            {tabs.map(t => {
              const Icon = t.icon; const active = tab === t.key;
              return (
                <li key={t.key}>
                  <button
                    onClick={() => setTab(t.key)}
                    role="tab"
                    aria-selected={active}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-left transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400/60 ${active ? 'bg-gradient-to-r from-[var(--mk-accent)] to-[var(--mk-accent-strong)] text-[#081321] shadow-sm' : 'mk-text-muted hover:mk-surface-alt hover:mk-text-primary'}`}
                  >
                    <Icon size={18} strokeWidth={active ? 2.2 : 1.8} />
                    <span className="flex-1 truncate text-[13px] font-medium">{t.label}</span>
                    {t.badge ? <span className="inline-flex items-center justify-center h-5 min-w-[1.1rem] px-1 rounded-full bg-red-600/80 text-white text-[10px] font-semibold shadow">{t.badge}</span> : null}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="p-4 border-t mk-border flex flex-col gap-3">
          <div className="grid grid-cols-3 gap-2 text-center text-[10px] mk-text-secondary">
            <div className="p-2 rounded-md mk-surface-alt mk-border"><div className="text-xs font-semibold mk-text-primary">{totalReports}</div><div className="text-[10px] mk-text-fainter">Total</div></div>
            <div className="p-2 rounded-md mk-surface-alt mk-border"><div className="text-xs font-semibold mk-accent">{openReports}</div><div className="text-[10px] mk-text-fainter">Open</div></div>
            <div className="p-2 rounded-md mk-surface-alt mk-border"><div className="text-xs font-semibold text-green-400">{resolvedReports}</div><div className="text-[10px] mk-text-fainter">Resolved</div></div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button onClick={()=>setTab('report-lost')} className="h-9 rounded-md bg-gradient-to-r from-[var(--mk-accent)] to-[var(--mk-accent-strong)] hover:brightness-110 text-[#081321] text-[11px] font-semibold flex items-center justify-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400/60"><Plus size={14}/> Lost</button>
            <button onClick={()=>setTab('report-found')} className="h-9 rounded-md mk-surface-alt hover:mk-surface text-[11px] font-semibold flex items-center justify-center gap-2 mk-text-muted hover:mk-text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400/60"><UploadCloud size={14}/> Found</button>
          </div>
          <button onClick={load} disabled={loading} className="h-9 w-full rounded-md mk-surface-alt hover:mk-surface text-[11px] font-medium mk-text-muted hover:mk-text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400/60 disabled:opacity-40">{loading? 'Refreshing...' : 'Refresh Data'}</button>
          <button onClick={()=>onLogout?.()} className="h-9 w-full rounded-md mk-surface-alt hover:mk-surface text-[11px] font-medium flex items-center justify-center gap-2 mk-text-muted hover:mk-text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400/60"><LogOut size={14}/> Logout</button>
        </div>
      </aside>

      {/* Right side content */}
      <div className="flex-1 flex flex-col min-h-dvh">
        {/* Mobile Header */}
        <header className="px-4 py-3 mk-surface-alt backdrop-blur-sm border-b mk-border flex items-center gap-3 lg:hidden">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <button
              onClick={() => setTab("profile")}
              className="h-11 w-11 rounded-full bg-gradient-to-br from-orange-500 to-pink-500 text-white flex items-center justify-center font-semibold text-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400/60 shadow-inner"
              aria-label="Profile"
            >
              {profile.name.slice(0, 1)}
            </button>
            <div className="flex flex-col truncate">
              <span className="text-sm font-semibold mk-text-primary truncate">
                {profile.name}
              </span>
              <span className="text-[11px] mk-text-fainter">User Portal</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={load}
              disabled={loading}
              className="h-10 px-3 rounded-md mk-surface-alt hover:mk-surface text-[11px] font-medium mk-text-muted hover:mk-text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400/60 disabled:opacity-40"
            >
              {loading ? '...' : 'Refresh'}
            </button>
            <button
              onClick={()=>setTab('report-lost')}
              className="h-10 px-3 rounded-md bg-gradient-to-r from-[var(--mk-accent)] to-[var(--mk-accent-strong)] hover:brightness-110 text-[#081321] text-xs font-semibold flex items-center gap-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400/60"
            >
              <Plus size={14} />
              <span className="hidden sm:inline">Lost</span>
            </button>
            <button
              onClick={()=>setTab('report-found')}
              className="h-10 px-3 rounded-md mk-surface-alt hover:mk-surface text-xs font-semibold flex items-center gap-1 mk-text-muted hover:mk-text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400/60"
            >
              <UploadCloud size={14} />
              <span className="hidden sm:inline">Found</span>
            </button>
          </div>
        </header>

        {/* Error */}
        {error && (
          <div className="m-3 p-3 bg-red-500/15 border border-red-400/30 rounded-md text-xs text-red-300 flex items-center gap-2">
            <AlertCircle size={14} className="text-red-300" /> {error}
          </div>
        )}

  {/* Main Content */}
  <main className="flex-1 overflow-y-auto pb-20 px-3 pt-3" id="user-main">{content}</main>

        {/* Bottom Navigation (mobile) */}
        <nav
          className="fixed bottom-0 inset-x-0 z-20 mk-surface-alt backdrop-blur-sm border-t mk-border shadow-sm flex lg:hidden mk-text-muted"
          role="tablist"
          aria-label="User navigation"
        >
          {tabs.map(t => {
            const Icon = t.icon; const active = tab === t.key;
            return (
              <button
                key={t.key}
                role="tab"
                aria-selected={active}
                onClick={() => setTab(t.key)}
                className={`relative flex-1 flex flex-col items-center justify-center gap-1 py-2.5 text-[11px] font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400/60 ${active ? 'mk-accent' : 'mk-text-fainter'} hover:mk-accent`}
              >
                <Icon size={20} strokeWidth={active ? 2.2 : 1.8} />
                <span>{t.label}</span>
                <span aria-hidden="true" className={`h-0.5 w-8 rounded-full mt-0.5 transition-colors ${active ? 'bg-[var(--mk-accent)]' : 'bg-transparent'}`} />
                {t.badge ? (
                  <span className="absolute top-1.5 right-5 h-4 min-w-[1rem] px-1 rounded-full bg-red-600/80 text-white text-[9px] leading-4 font-semibold">{t.badge}</span>
                ) : null}
              </button>
            );
          })}
        </nav>
        </div>
      </div>
  );
};

export default UserDashboard;
