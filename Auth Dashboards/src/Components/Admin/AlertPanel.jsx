import React, { useState } from 'react';

// Vivid dot colors; contextual pills below use translucent tints
const severityColor = (s) => ({
  Low: 'bg-gray-400',
  Medium: 'bg-amber-400',
  High: 'bg-orange-500',
  Critical: 'bg-red-500'
}[s] || 'bg-gray-500');

const statusBadge = (status) => {
  if (!status) return '';
  return 'bg-orange-500/15 text-orange-300 border border-orange-400/30';
};

const AlertPanel = ({ activeAlerts, historyAlerts, onAck, onResolve }) => {
  const [tab, setTab] = useState('active');
  const list = tab === 'active' ? activeAlerts : historyAlerts;
  return (
  <aside className="flex flex-col h-full border-l mk-border mk-surface-alt backdrop-blur-xl sm:w-80 md:w-96">
  <div className="px-4 pt-3 pb-2 border-b mk-border flex gap-2 text-xs font-medium">
        <button
          onClick={() => setTab('active')}
          className={`px-3 py-1.5 rounded-md border transition ${tab==='active' ? 'bg-orange-500 text-white border-orange-500 shadow-sm' : 'mk-surface-alt mk-text-muted mk-border hover:bg-orange-50 dark:hover:bg-white/10'}`}
        >Active ({activeAlerts.length})</button>
        <button
          onClick={() => setTab('history')}
          className={`px-3 py-1.5 rounded-md border transition ${tab==='history' ? 'bg-orange-500 text-white border-orange-500 shadow-sm' : 'mk-surface-alt mk-text-muted mk-border hover:bg-orange-50 dark:hover:bg-white/10'}`}
        >History ({historyAlerts.length})</button>
      </div>
      <div className="flex-1 overflow-y-auto divide-y mk-border/50 text-xs">
        {list.length === 0 && <div className="p-4 mk-text-muted">No alerts.</div>}
        {list.map(a => (
          <div
            key={a.id}
            className="p-3 flex flex-col gap-1 hover:bg-white/5 transition"
          >
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ring-2 ring-black/40 ${severityColor(a.severity)}`} aria-label={a.severity} />
              <span className="font-semibold mk-text-primary truncate">{a.type}</span>
              <span className="ml-auto text-[10px] mk-text-fainter">{a.timeAgo}</span>
            </div>
            <div className="flex items-center gap-2 text-[11px] mk-text-secondary">
              <span className="px-1.5 py-0.5 rounded mk-surface-alt mk-border mk-text-secondary">{a.zone}</span>
              {a.status && <span className={`px-1.5 py-0.5 rounded ${statusBadge(a.status)}`}>{a.status}</span>}
              <div className="ml-auto flex gap-2">
                {tab === 'active' && (
                  <>
                    <button
                      onClick={() => onAck(a.id)}
                      className="text-orange-400 hover:text-orange-300 hover:underline focus:outline-none focus:ring-2 focus:ring-orange-500/40 rounded"
                      aria-label="Acknowledge alert"
                    >Ack</button>
                    <button
                      onClick={() => onResolve(a.id)}
                      className="mk-text-muted hover:mk-text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-white/30 rounded"
                      aria-label="Resolve alert"
                    >Resolve</button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default AlertPanel;
