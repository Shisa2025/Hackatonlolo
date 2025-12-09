import Image from 'next/image';
import Link from 'next/link';

const threatBands = [
  { label: 'Seismic', value: '6.2', from: 'rgba(248,113,113,0.65)', to: 'rgba(251,146,60,0.55)' },
  { label: 'Radiation', value: 'Sigma-7', from: 'rgba(244,63,94,0.55)', to: 'rgba(255,255,255,0.4)' },
  { label: 'Civilian Evac', value: 'Phase 3', from: 'rgba(254,226,226,0.6)', to: 'rgba(248,113,113,0.45)' },
];

const quickActions = [
  { title: 'Deploy Perimeter Ring Now', detail: 'Seal outer blocks, close tunnels, station armor', tone: 'red' },
  { title: 'Flood Public Shelter Info', detail: 'Push SMS + push alerts to all districts', tone: 'amber' },
  { title: 'Scramble Defense Air Wing', detail: 'VTOLs + drones launch window: T-2:10', tone: 'emerald' },
  { title: 'Activate Coastal Barrier Line', detail: 'Floodgates + barrier pylons deploying', tone: 'amber' },
];

const timeline = [
  { time: '02:16', text: 'Kaiju signature locked. Vectoring from trench 9B. Begin perimeter deployment now.', level: 'critical' },
  { time: '02:19', text: 'Defense WEST cell ready. Railguns calibrating; request final firing lanes.', level: 'warn' },
  { time: '02:22', text: 'Citizens need more shelter guidance. Repeat alert in 45 seconds.', level: 'warn' },
  { time: '02:24', text: 'Civ evac trains at 64%. Tunnel seals in 90s. Reinforce platform 6.', level: 'info' },
];

const broadcasts = [
  { label: 'CIVIL ALERT', text: 'Issue more shelter routes. Keep screens and speakers repeating instructions.', tone: 'amber' },
  { label: 'COMMAND', text: 'Please deploy perimeter to full coverage. No gaps on the north causeway.', tone: 'red' },
  { label: 'OPS', text: 'Public channels overloaded. Mirror messaging on transit displays immediately.', tone: 'emerald' },
];

const priorityOrders = [
  { label: 'Deploy Outer Line', note: 'Seal coastline ring, confirm gate locks', tone: 'red' },
  { label: 'Shelter Broadcast', note: 'Push shelter maps in EN/JP every 30s', tone: 'amber' },
  { label: 'Air Intercept', note: 'VTOL stack 1-4 on standby, fuel topped', tone: 'emerald' },
  { label: 'Medical Corridors', note: 'Clear lanes to triage hubs A/C/D', tone: 'rose' },
];

const intelPings = [
  { title: 'Thermal spike near sector 7 docks', tag: 'Thermal', tone: 'red' },
  { title: 'Civilians clustering at exit 12 shelters', tag: 'CivFlow', tone: 'amber' },
  { title: 'Rail uplink stable, spectrum clean', tag: 'Comms', tone: 'emerald' },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#210000] via-[#3a0000] to-[#5a0c0c] text-slate-100 relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            'radial-gradient(circle at 20% 20%, rgba(248,113,113,0.28), transparent 26%), radial-gradient(circle at 80% 10%, rgba(255,255,255,0.18), transparent 28%), radial-gradient(circle at 70% 70%, rgba(252,165,165,0.22), transparent 30%), linear-gradient(120deg, rgba(255,255,255,0.07) 1px, transparent 1px), linear-gradient(0deg, rgba(255,255,255,0.07) 1px, transparent 1px)',
          backgroundSize: 'cover, cover, cover, 30px 30px, 30px 30px',
        }}
      />

      <div className="relative max-w-6xl mx-auto px-6 py-10 flex flex-col gap-8">
        <div className="rounded-2xl border border-red-400/60 bg-red-500/25 text-white px-4 py-3 shadow-xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 glow-tag alert-stripes">
          <div className="text-sm font-semibold uppercase tracking-[0.18em]">Urgent Broadcast</div>
          <div className="text-sm sm:text-base font-medium">
            Please deploy perimeter now. Citizens need more shelter guidance. Keep citywide alerts looping.
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="h-2 w-2 rounded-full bg-white animate-ping" />
            Live
          </div>
        </div>

        <div className="relative rounded-3xl border border-white/10 bg-white/5 backdrop-blur-sm shadow-2xl overflow-hidden h-64 sm:h-80 lg:h-96 holo-grid scanline frame-accent glass-hard">
          <Image
            src="/index/kaijyu1.png"
            alt="Kaiju live capture visual"
            fill
            className="object-contain"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#200000]/70 via-[#300000]/25 to-transparent" />
          <div className="noise-overlay" />
          <div className="absolute bottom-4 left-4 right-4 sm:left-6 sm:right-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-white">
            <div>
              <div className="text-xs uppercase tracking-[0.2em] text-white/70">Live Visual</div>
              <div className="text-lg font-semibold">Kaiju vector approaching coastal sectors</div>
              <div className="text-sm text-white/80">Confirm perimeter deployment and keep shelters broadcasting routes.</div>
            </div>
            <div className="px-3 py-2 rounded-xl bg-red-500/80 border border-red-200/70 text-sm font-semibold shadow-lg">
              Alert: Forward cameras feed locked
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/10 backdrop-blur-sm shadow-2xl p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4 frame-accent">
          <div className="space-y-1">
            <div className="text-xs uppercase tracking-[0.16em] text-white/80">Disaster Response Prototype</div>
            <div className="text-lg font-semibold text-white">
              Monitor incidents, deploy countermeasures, and brief mission teams in one command surface.
            </div>
            <div className="text-sm text-white/70">
              Crisis / defense simulation built for hackathon demo. Live feel, simulated data.
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/dashboard"
              className="px-4 py-2 rounded-xl bg-red-500/80 border border-red-200/70 text-white font-semibold shadow-lg hover:bg-red-500"
            >
              Open Dashboard
            </Link>
            <Link
              href="/synopsis"
              className="px-4 py-2 rounded-xl border border-white/40 text-white/90 hover:border-white/70 hover:text-white"
            >
              Quick Tour
            </Link>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/10 backdrop-blur-sm shadow-2xl p-4 grid grid-cols-1 md:grid-cols-3 gap-3 frame-accent">
          {[
            { title: 'Monitor Incidents', desc: 'Track kaiju vector, threat bands, and field units in real time.' },
            { title: 'Deploy Countermeasures', desc: 'Launch perimeter, barrier lines, air intercept, and evac routing.' },
            { title: 'Guide Civilians', desc: 'Push shelter routes, alerts, and public messaging from one console.' },
          ].map((item) => (
            <div key={item.title} className="rounded-xl border border-white/20 bg-white/5 p-3 holo-grid">
              <div className="text-sm font-semibold text-white">{item.title}</div>
              <div className="text-sm text-white/75 mt-1">{item.desc}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 rounded-2xl border border-white/10 bg-white/10 backdrop-blur-sm shadow-2xl p-4 frame-accent">
            <div className="flex items-center justify-between mb-3">
              <div className="text-xs uppercase tracking-[0.16em] text-slate-100/80">Priority Orders</div>
              <div className="text-[11px] px-2 py-1 rounded-lg bg-amber-400/25 border border-amber-200/60 text-amber-50">
                Execute immediately
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {priorityOrders.map((item) => (
                <div
                  key={item.label}
                  className={`rounded-2xl border px-3 py-3 shadow-lg holo-grid ${
                    item.tone === 'red'
                      ? 'border-red-200/70 bg-red-500/15 text-red-50'
                      : item.tone === 'amber'
                        ? 'border-amber-200/70 bg-amber-400/15 text-amber-50'
                        : item.tone === 'emerald'
                          ? 'border-emerald-200/70 bg-emerald-400/15 text-emerald-50'
                          : 'border-rose-200/70 bg-rose-400/15 text-rose-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="text-[12px] uppercase tracking-[0.14em] opacity-90">{item.label}</div>
                    <span className="text-[10px] px-2 py-1 rounded-full bg-white/10 border border-white/20">Now</span>
                  </div>
                  <div className="mt-1 text-sm leading-relaxed">{item.note}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/10 backdrop-blur-sm shadow-2xl p-4 space-y-3 holo-grid">
            <div className="flex items-center justify-between">
              <div className="text-xs uppercase tracking-[0.16em] text-slate-100/80">Intel Pings</div>
              <div className="text-[10px] px-2 py-1 rounded-lg bg-white/10 border border-white/20">Live Feed</div>
            </div>
            {intelPings.map((ping) => (
              <div
                key={ping.title}
                className={`rounded-xl border px-3 py-2 text-sm flex items-start gap-2 ${
                  ping.tone === 'red'
                    ? 'border-red-200/70 bg-red-500/15 text-red-50'
                    : ping.tone === 'amber'
                      ? 'border-amber-200/70 bg-amber-400/15 text-amber-50'
                      : 'border-emerald-200/70 bg-emerald-400/15 text-emerald-50'
                }`}
              >
                <span className="text-[10px] px-2 py-1 rounded-full bg-white/10 border border-white/20">{ping.tag}</span>
                <span className="leading-relaxed">{ping.title}</span>
              </div>
            ))}
          </div>
        </div>

        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full bg-red-200/30 border border-red-300/60 text-xs tracking-[0.2em] uppercase text-red-50">
                Defense Command
              </span>
              <span className="px-2 py-1 rounded-md bg-amber-500/30 border border-amber-300/60 text-amber-50 text-xs font-semibold">
                Situation: Critical
              </span>
            </div>
            <h1 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-white">Kaiju Response Hub</h1>
            <p className="text-slate-100/80 max-w-2xl mt-1">
              Real-time command surface for Defense Command. Choose a console for live ops, countermeasures, and mission
              brief. Keep comms clear; all channels encrypted.
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-red-200/40 shadow-2xl">
            <div className="text-xs uppercase tracking-[0.18em] text-red-50">Threat Level</div>
            <div className="mt-2 text-4xl font-extrabold text-white drop-shadow-[0_0_18px_rgba(248,113,113,0.45)]">
              Scarlet-5
            </div>
            <div className="mt-2 text-red-50 text-sm font-medium">Full readiness / engage protocols live</div>
          </div>
        </header>

        <section className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-3 rounded-3xl border border-white/10 bg-white/10 backdrop-blur-sm shadow-2xl overflow-hidden">
            <div className="border-b border-white/10 px-5 py-3 flex items-center justify-between bg-white/5">
              <div className="text-sm uppercase tracking-[0.16em] text-slate-100/80">Command Lanes</div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-red-300 animate-pulse" />
                <span className="text-xs text-red-50">Secure link active</span>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-5">
              <Link
                href="/dashboard"
                className="group relative block p-5 rounded-2xl border border-red-200/70 bg-gradient-to-br from-red-500/20 via-red-500/10 to-white/5 hover:border-red-200 transition shadow-xl"
              >
                <div className="text-xs uppercase tracking-[0.14em] text-red-50 mb-1">Live Dashboard</div>
                <div className="text-xl font-semibold text-white">Kaiju Crisis Console</div>
                <p className="text-sm text-red-50/90 mt-2">
                  Incidents, telemetry, strike assets, evacuation corridors, and radio feed.
                </p>
                <div className="absolute right-4 top-4 text-[10px] px-2 py-1 rounded-full bg-red-500/30 border border-red-200/80 text-white">
                  HOT
                </div>
              </Link>
              <Link
                href="/countermeasures"
                className="group relative block p-5 rounded-2xl border border-amber-200/70 bg-gradient-to-br from-amber-400/20 via-amber-400/10 to-white/5 hover:border-amber-200 transition shadow-xl"
              >
                <div className="text-xs uppercase tracking-[0.14em] text-amber-50 mb-1">Playbook</div>
                <div className="text-xl font-semibold text-white">Countermeasure Briefing</div>
                <p className="text-sm text-amber-50/90 mt-2">
                  Per-kaiju patterns, weapon pairings, interdiction and fallback lines.
                </p>
                <div className="absolute right-4 top-4 text-[10px] px-2 py-1 rounded-full bg-amber-400/25 border border-amber-200/80 text-white">
                  READY
                </div>
              </Link>
              <Link
                href="/synopsis"
                className="group relative block p-5 rounded-2xl border border-emerald-200/70 bg-gradient-to-br from-emerald-400/20 via-emerald-400/10 to-white/5 hover:border-emerald-200 transition shadow-xl"
              >
                <div className="text-xs uppercase tracking-[0.14em] text-emerald-50 mb-1">Synopsis</div>
                <div className="text-xl font-semibold text-white">Mission Overview + BGM</div>
                <p className="text-sm text-emerald-50/90 mt-2">
                  Situation brief, map overlays, and mission soundtrack launch control.
                </p>
                <div className="absolute right-4 top-4 text-[10px] px-2 py-1 rounded-full bg-emerald-400/25 border border-emerald-200/80 text-white">
                  OPEN
                </div>
              </Link>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/10 backdrop-blur-sm shadow-2xl p-5 flex flex-col gap-3">
            <div className="text-xs uppercase tracking-[0.16em] text-slate-100/80">Threat Bands</div>
            <div className="space-y-3">
              {threatBands.map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-white/10 bg-white/5 p-3 shadow-inner relative overflow-hidden"
                >
                  <div
                    className="absolute inset-0 opacity-60 blur-3xl"
                    style={{
                      background: `linear-gradient(120deg, ${item.from}, ${item.to})`,
                    }}
                  />
                  <div className="relative flex items-center justify-between">
                    <div className="text-sm text-slate-50/90">{item.label}</div>
                    <div className="text-lg font-semibold text-white">{item.value}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-xs uppercase tracking-[0.16em] text-slate-100/80 mt-1">Action</div>
            <div className="flex flex-wrap gap-2">
              {quickActions.map((action) => (
                <button
                  key={action.title}
                  className={`flex-1 min-w-[150px] text-left px-3 py-2 rounded-xl border transition shadow-lg ${
                    action.tone === 'red'
                      ? 'border-red-200/70 bg-red-500/15 text-red-50 hover:bg-red-500/25'
                      : action.tone === 'amber'
                        ? 'border-amber-200/70 bg-amber-400/15 text-amber-50 hover:bg-amber-400/25'
                        : 'border-emerald-200/70 bg-emerald-400/15 text-emerald-50 hover:bg-emerald-400/25'
                  }`}
                >
                  <div className="text-[11px] uppercase tracking-[0.12em] opacity-80">Command</div>
                  <div className="text-sm font-semibold leading-5">{action.title}</div>
                  <div className="text-xs opacity-80">{action.detail}</div>
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 rounded-3xl border border-white/10 bg-white/10 backdrop-blur-sm shadow-2xl p-5">
            <div className="flex items-center justify-between">
              <div className="text-xs uppercase tracking-[0.14em] text-slate-100/80">Ops Timeline</div>
              <div className="flex items-center gap-2 text-xs text-slate-50">
                <span className="h-2 w-2 rounded-full bg-emerald-300" />
                Live sync
              </div>
            </div>
            <div className="mt-4 space-y-3">
              {timeline.map((event) => (
                <div
                  key={event.time}
                  className={`flex items-start gap-3 rounded-2xl border px-3 py-3 ${
                    event.level === 'critical'
                      ? 'border-red-200/60 bg-red-500/15 text-red-50'
                      : event.level === 'warn'
                        ? 'border-amber-200/60 bg-amber-400/15 text-amber-50'
                        : 'border-rose-200/60 bg-rose-400/15 text-rose-50'
                  }`}
                >
                  <div className="text-sm font-mono opacity-80">{event.time}</div>
                  <div className="text-sm leading-relaxed">{event.text}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/10 backdrop-blur-sm shadow-2xl p-5 space-y-4">
            <div className="text-xs uppercase tracking-[0.14em] text-slate-100/80">Sector Status</div>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                <div className="text-[11px] uppercase tracking-[0.12em] text-slate-100/80">Forward Units</div>
                <div className="text-2xl font-bold text-emerald-100">12</div>
                <div className="text-xs text-slate-200/80">Rail / VTOL / Armor</div>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                <div className="text-[11px] uppercase tracking-[0.12em] text-slate-100/80">Civ Evac</div>
                <div className="text-2xl font-bold text-amber-100">64%</div>
                <div className="text-xs text-slate-200/80">Tunnels + Rail active</div>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                <div className="text-[11px] uppercase tracking-[0.12em] text-slate-100/80">Weather</div>
                <div className="text-xl font-semibold text-cyan-100">Crosswind 18kt</div>
                <div className="text-xs text-slate-200/80">Affects drone stacks</div>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                <div className="text-[11px] uppercase tracking-[0.12em] text-slate-100/80">Comms</div>
                <div className="text-xl font-semibold text-emerald-100">Encrypted</div>
                <div className="text-xs text-slate-200/80">Spectrum clean</div>
              </div>
            </div>

            <div className="text-xs uppercase tracking-[0.14em] text-slate-100/80">Urgent Broadcasts</div>
            <div className="space-y-2">
              {broadcasts.map((item) => (
                <div
                  key={item.text}
                  className={`rounded-2xl border px-3 py-3 text-sm ${
                    item.tone === 'red'
                      ? 'border-red-200/70 bg-red-500/15 text-red-50'
                      : item.tone === 'amber'
                        ? 'border-amber-200/70 bg-amber-400/15 text-amber-50'
                        : 'border-emerald-200/70 bg-emerald-400/15 text-emerald-50'
                  }`}
                >
                  <div className="text-[11px] uppercase tracking-[0.14em] opacity-80">{item.label}</div>
                  <div className="mt-1 leading-relaxed">{item.text}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}


