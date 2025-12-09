'use client';

import { useEffect, useMemo, useState } from 'react';
import { dashboardOperations, kaijuList } from '../data/kaiju';

function severityChip(level) {
  if (level >= 5) return { label: 'Critical', className: 'border-red-400 text-red-300' };
  if (level >= 3) return { label: 'Elevated', className: 'border-amber-300 text-amber-200' };
  return { label: 'Monitored', className: 'border-emerald-300 text-emerald-200' };
}

export default function DashboardPage() {
  const [selectedId, setSelectedId] = useState(kaijuList[0]?.id ?? null);
  const selected = kaijuList.find((k) => k.id === selectedId) ?? kaijuList[0];
  const [threatLevel, setThreatLevel] = useState(selected?.threatLevel ?? 3);
  const [distanceKm, setDistanceKm] = useState(14);
  const [evacStatus, setEvacStatus] = useState('Green');
  const [prediction, setPrediction] = useState('Holding position');
  const [eventFeed, setEventFeed] = useState([
    '[15:24] Sensors locked on primary target.',
    '[15:23] Ops net synchronized. All squads online.',
    '[15:22] Harbor nets verified; sonar tracking nominal.',
  ]);
  const [alertFlash, setAlertFlash] = useState(false);

  const stats = useMemo(
    () => ({
      incidents: kaijuList.length,
      critical: kaijuList.filter((k) => k.threatLevel >= 5).length,
      elevated: kaijuList.filter((k) => k.threatLevel >= 3 && k.threatLevel < 5).length,
    }),
    [],
  );

  const evacFromThreat = (lvl) => {
    if (lvl >= 5) return 'Red';
    if (lvl >= 4) return 'Orange';
    return 'Green';
  };

  const randomPrediction = () => {
    const dirs = ['NE', 'NW', 'SE', 'SW', 'East', 'West', 'North', 'South'];
    const dir = dirs[Math.floor(Math.random() * dirs.length)];
    const km = (1 + Math.random() * 2.2).toFixed(1);
    return `Estimated shift: ${dir} by ${km} km in ~2 min`;
  };

  const pushEvent = (text) => {
    const time = new Date().toLocaleTimeString('en-GB', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setEventFeed((prev) => [`[${time}] ${text}`, ...prev].slice(0, 12));
  };

  const refreshPrediction = () => {
    setPrediction(randomPrediction());
  };

  const updateThreat = (delta) => {
    setThreatLevel((prev) => {
      const next = Math.min(5, Math.max(1, prev + delta));
      setEvacStatus(evacFromThreat(next));
      return next;
    });
    setAlertFlash(true);
    setTimeout(() => setAlertFlash(false), 450);
  };

  const simulateSurge = () => {
    setDistanceKm((prev) => Math.max(0.4, prev - (0.5 + Math.random() * 1.3)));
    updateThreat(1);
    refreshPrediction();
    pushEvent('Threat spike detected. Assets repositioning.');
  };

  const deployCountermeasure = (label, threatReduction = 1, distancePush = 0.8) => {
    setDistanceKm((prev) => prev + distancePush);
    updateThreat(-threatReduction);
    refreshPrediction();
    pushEvent(`${label} executed. Threat reduced.`);
  };

  useEffect(() => {
    setThreatLevel(selected?.threatLevel ?? 3);
    setDistanceKm(12 + Math.random() * 6);
    setEvacStatus(evacFromThreat(selected?.threatLevel ?? 3));
    refreshPrediction();
    pushEvent(`Tracking ${selected?.name ?? 'target'} updated.`);
  }, [selected?.id]);

  useEffect(() => {
    const templates = [
      'Airspace lockdown expanded by 8km.',
      'Structural integrity dropping near perimeter.',
      'Evac corridor reroute requested.',
      'Countermeasure teams resupplied.',
      'Civilians reporting heavy tremors.',
      'Harbor nets tension holding.',
      'Radar ping confirms trajectory update.',
    ];
    const timer = setInterval(() => {
      const pick = templates[Math.floor(Math.random() * templates.length)];
      pushEvent(pick);
    }, 3200);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1b0000] via-[#2d0000] to-[#430000] text-slate-100 flex flex-col overflow-x-hidden">
      <header className="border-b border-white/10 px-4 sm:px-6 py-5 bg-[#120000]/80 backdrop-blur">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="text-xs uppercase tracking-[0.24em] text-red-200 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
              Kaiju Disaster Simulator
            </div>
            <div className="text-2xl font-bold">Live Threat Monitor</div>
            <div className="text-sm text-slate-200/80 max-w-xl">
              Command dashboard prototype: simulated kaiju crisis with active monitoring, response actions, and evacuation
              guidance. Judges: start with the quick brief or jump to the list.
            </div>
            <div className="flex flex-wrap gap-2 text-[0.8rem]">
              <span className="px-3 py-1 rounded-full border border-white/20 bg-white/10 text-white">Live feel</span>
              <span className="px-3 py-1 rounded-full border border-red-300/60 bg-red-500/25 text-white">Simulated data</span>
              <span className="px-3 py-1 rounded-full border border-white/20 bg-white/5 text-white">How to read: top KPIs &rarr; ops &rarr; per-kaiju</span>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="flex items-center gap-2 text-sm text-slate-200">
              <span className="px-3 py-1 rounded-xl border border-red-300/50 bg-red-500/20 text-white">Critical: {stats.critical}</span>
              <span className="px-3 py-1 rounded-xl border border-amber-200/50 bg-amber-400/15 text-amber-50">Elevated: {stats.elevated}</span>
            </div>
            <div className="flex gap-2">
              <a
                href="#quick-brief"
                className="px-4 py-2 rounded-xl bg-red-500/85 border border-red-200/70 text-white font-semibold shadow-lg hover:bg-red-500"
              >
                Quick Brief
              </a>
              <a
                href="#kaiju-list"
                className="px-4 py-2 rounded-xl border border-white/30 text-white/90 hover:border-white/60 hover:text-white"
              >
                Jump to List
              </a>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 p-4 flex flex-col gap-4">
        <section
          id="quick-brief"
          className="bg-white/10 border border-white/15 rounded-2xl p-4 shadow-xl grid grid-cols-1 md:grid-cols-4 gap-3"
        >
          <div className="rounded-xl border border-white/15 bg-white/5 p-3">
            <div className="text-[0.7rem] uppercase tracking-[0.12em] text-red-200">Threat Level</div>
            <div className="text-2xl font-bold text-white">Scarlet-5</div>
            <div className="text-sm text-white/75">Citywide perimeter deploy. Engage protocols live.</div>
          </div>
          <div className="rounded-xl border border-white/15 bg-white/5 p-3">
            <div className="text-[0.7rem] uppercase tracking-[0.12em] text-red-200">Active Kaiju</div>
            <div className="text-2xl font-bold text-white">{stats.incidents}</div>
            <div className="text-sm text-white/75">Multi-target tracking</div>
          </div>
          <div className="rounded-xl border border-white/15 bg-white/5 p-3">
            <div className="text-[0.7rem] uppercase tracking-[0.12em] text-red-200">Critical Targets</div>
            <div className="text-2xl font-bold text-white">{stats.critical}</div>
            <div className="text-sm text-white/75">Immediate intercept priority</div>
          </div>
          <div className="rounded-xl border border-white/15 bg-white/5 p-3">
            <div className="text-[0.7rem] uppercase tracking-[0.12em] text-red-200">Evacuation</div>
            <div className="text-2xl font-bold text-white">Phase 3</div>
            <div className="text-sm text-white/75">Shelter routing + rail corridors live</div>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-[320px_1fr] gap-4">
          <section
            id="kaiju-list"
            className="bg-white/5 border border-white/10 rounded-2xl p-4 shadow-lg space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="text-xs uppercase tracking-[0.16em] text-slate-300">Active Kaiju</div>
              <div className="text-[0.75rem] px-3 py-1 rounded-full bg-red-500/15 border border-red-400/40 text-red-100">
                {kaijuList.length} threats
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 text-sm">
              <div className="rounded-xl border border-white/10 bg-[#1f0000]/70 p-3">
                <div className="text-[0.68rem] uppercase tracking-[0.08em] text-slate-400">Incidents</div>
                <div className="text-xl font-semibold">{stats.incidents}</div>
              </div>
              <div className="rounded-xl border border-white/10 bg-[#1f0000]/70 p-3">
                <div className="text-[0.68rem] uppercase tracking-[0.08em] text-slate-400">Critical</div>
                <div className="text-xl font-semibold">{stats.critical}</div>
              </div>
              <div className="rounded-xl border border-white/10 bg-[#1f0000]/70 p-3">
                <div className="text-[0.68rem] uppercase tracking-[0.08em] text-slate-400">Elevated</div>
                <div className="text-xl font-semibold">{stats.elevated}</div>
              </div>
            </div>
            <div className="flex flex-col gap-2 max-h-[calc(100vh-220px)] overflow-y-auto">
              {kaijuList.map((k) => {
                const chip = severityChip(k.threatLevel);
                const isActive = selected?.id === k.id;
                return (
                  <button
                    key={k.id}
                    type="button"
                    onClick={() => setSelectedId(k.id)}
                    className={`flex justify-between items-center rounded-xl border border-white/10 bg-[#1f0000]/70 px-3 py-2 transition hover:-translate-y-0.5 hover:border-red-400/50 hover:bg-red-500/15 text-sm ${
                      isActive ? 'border-red-500/70 bg-red-500/15 shadow-[0_0_16px_rgba(239,68,68,0.35)]' : ''
                    }`}
                  >
                    <div className="text-left">
                      <div className="text-base font-semibold tracking-tight">{k.name}</div>
                      <div className="text-xs text-slate-400">{`${k.location} | Lv.${k.threatLevel} | ${k.lastSeen}`}</div>
                    </div>
                    <div className={`text-[0.7rem] px-3 py-1 rounded-full border ${chip.className}`}>{chip.label}</div>
                  </button>
                );
              })}
            </div>
          </section>

          <section className="flex flex-col gap-4">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 shadow-lg space-y-3">
              <div className="flex items-center justify-between">
                <div className="text-xs uppercase tracking-[0.16em] text-slate-300">Selected Kaiju</div>
                <div className="text-[0.75rem] px-3 py-1 rounded-full bg-[#240000] border border-white/10 text-slate-200">
                  {selected ? `Tracking: ${selected.name}` : 'No target selected'}
                </div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-4">
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-2xl font-extrabold tracking-tight">{selected?.name ?? 'None'}</div>
                      <div className="text-sm text-slate-300">{selected?.codename ?? 'Choose a kaiju from the list.'}</div>
                    </div>
                    <div
                      className={`text-xs px-3 py-1 rounded-full border ${
                        alertFlash ? 'border-red-300 bg-red-500/50 text-white' : 'border-white/20 bg-white/5 text-white/80'
                      } transition`}
                    >
                      Threat {threatLevel}/5
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <div className="text-[0.68rem] uppercase tracking-[0.08em] text-slate-400">Threat</div>
                      <div>{selected ? `Level ${selected.threatLevel}` : '-'}</div>
                    </div>
                    <div>
                      <div className="text-[0.68rem] uppercase tracking-[0.08em] text-slate-400">Last Seen</div>
                      <div>{selected?.lastSeen ?? '-'}</div>
                    </div>
                    <div>
                      <div className="text-[0.68rem] uppercase tracking-[0.08em] text-slate-400">Location</div>
                      <div>{selected?.location ?? '-'}</div>
                    </div>
                    <div>
                      <div className="text-[0.68rem] uppercase tracking-[0.08em] text-slate-400">Type</div>
                      <div>{selected?.type ?? '-'}</div>
                    </div>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-[#1f0000]/60 p-3 space-y-2">
                    <div className="text-[0.68rem] uppercase tracking-[0.08em] text-red-200">Live Simulation</div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm">
                      <div className="rounded-lg border border-white/15 bg-white/5 p-2">
                        <div className="text-[0.68rem] uppercase tracking-[0.08em] text-white/70">Threat Now</div>
                        <div className="text-lg font-semibold text-white">{threatLevel}/5</div>
                      </div>
                      <div className="rounded-lg border border-white/15 bg-white/5 p-2">
                        <div className="text-[0.68rem] uppercase tracking-[0.08em] text-white/70">Distance</div>
                        <div className="text-lg font-semibold text-white">{distanceKm.toFixed(1)} km</div>
                      </div>
                      <div className="rounded-lg border border-white/15 bg-white/5 p-2">
                        <div className="text-[0.68rem] uppercase tracking-[0.08em] text-white/70">Evac Status</div>
                        <div
                          className={`text-lg font-semibold ${
                            evacStatus === 'Red' ? 'text-red-200' : evacStatus === 'Orange' ? 'text-amber-200' : 'text-white'
                          }`}
                        >
                          {evacStatus}
                        </div>
                      </div>
                      <div className="rounded-lg border border-white/15 bg-white/5 p-2">
                        <div className="text-[0.68rem] uppercase tracking-[0.08em] text-white/70">Prediction</div>
                        <div className="text-sm text-white/90">{prediction}</div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={simulateSurge}
                        className="px-3 py-2 rounded-lg bg-red-500/80 border border-red-200/70 text-white text-sm font-semibold hover:bg-red-500 shadow"
                      >
                        Simulate Threat Surge
                      </button>
                      <button
                        type="button"
                        onClick={() => deployCountermeasure('Railgun fired', 2, 1.4)}
                        className="px-3 py-2 rounded-lg border border-white/30 text-white/90 hover:border-white/60 hover:text-white text-sm"
                      >
                        Fire Railgun
                      </button>
                      <button
                        type="button"
                        onClick={() => deployCountermeasure('Jets scrambled', 1, 0.8)}
                        className="px-3 py-2 rounded-lg border border-white/30 text-white/90 hover:border-white/60 hover:text-white text-sm"
                      >
                        Deploy Jets
                      </button>
                      <button
                        type="button"
                        onClick={() => deployCountermeasure('Evac protocol escalated', 0, 0)}
                        className="px-3 py-2 rounded-lg border border-white/30 text-white/90 hover:border-white/60 hover:text-white text-sm"
                      >
                        Evac Protocol
                      </button>
                    </div>
                  </div>

                  <div>
                    <div className="text-[0.68rem] uppercase tracking-[0.08em] text-slate-400">Capabilities</div>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {selected?.tags?.map((tag) => (
                        <div key={tag} className="text-[0.72rem] px-3 py-1 rounded-full border border-white/15 bg-white/5">
                          {tag}
                        </div>
                      )) || <span className="text-slate-400 text-sm">-</span>}
                    </div>
                  </div>
                  <div>
                    <div className="text-[0.68rem] uppercase tracking-[0.08em] text-slate-400">Notes</div>
                    <div className="text-sm text-slate-300">{selected?.notes ?? '-'}</div>
                  </div>
                </div>
                <div className="rounded-xl border border-white/10 bg-[#1f0000]/70 p-4 text-sm space-y-2">
                  <div className="text-[0.68rem] uppercase tracking-[0.08em] text-slate-400">Ops Snapshot</div>
                  <div className="flex flex-col gap-2 max-h-60 overflow-y-auto">
                    {dashboardOperations.map((op) => (
                      <div key={op.title} className="rounded-xl border border-white/10 bg-[#260000]/80 p-3 space-y-1">
                        <div className="flex justify-between items-baseline gap-3">
                          <div className="font-semibold">{op.title}</div>
                          <div className="text-xs text-slate-400">
                            {op.time} | {op.level}
                          </div>
                        </div>
                        <div>{op.description}</div>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {op.tags.map((t) => (
                            <div key={t} className="text-[0.68rem] px-2 py-1 rounded-full border border-white/10 text-slate-300">
                              {t}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 shadow-lg text-sm space-y-3">
              <div className="flex items-center justify-between">
                <div className="text-[0.68rem] uppercase tracking-[0.08em] text-slate-400">Live Event Feed</div>
                <div className="text-[0.68rem] px-2 py-1 rounded-full border border-white/20 bg-white/10 text-white/80">Auto-updating</div>
              </div>
              <div className="flex flex-col gap-2 max-h-56 overflow-y-auto">
                {eventFeed.map((evt, idx) => (
                  <div key={`${evt}-${idx}`} className="rounded-lg border border-white/10 bg-[#1f0000]/60 px-3 py-2 text-white/90">
                    {evt}
                  </div>
                ))}
              </div>
            </div>
          </section>
        </section>
      </main>

      <footer className="text-[0.75rem] text-slate-300 border-t border-white/10 px-4 py-3 text-right bg-[#1a0000]">
        (c) 2025 Kaiju Dashboard | Demo
      </footer>
    </div>
  );
}




