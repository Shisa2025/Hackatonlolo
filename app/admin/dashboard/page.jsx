'use client';

import {useState} from 'react';
import Link from 'next/link';
import {useRouter} from 'next/navigation';
import { animate, createTimeline, cubicBezier} from 'animejs';

import {useEffect} from 'react';


export default function AdminDashboard() {
  const [clicks, setClicks] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [secretInput, setSecretInput] = useState('');
  const [secretError, setSecretError] = useState('');
  const router = useRouter();
  const [disabled, setDisabled] = useState(false);
  const handleCursorClick = () => {
    const next = clicks + 1;
    if (next >= 7) {
      setClicks(0);
      setShowModal(true);
    } else {
      setClicks(next);
    }
  };

  const handleSecretSubmit = (e) => {
    e.preventDefault();
    if (secretInput.trim() === 'kaijuGo') {
      setSecretError('');
      setShowModal(false);
      window.location.href = '/kaiju';
    } else {
      setSecretError('Keyword incorrect');
    }
  };


  useEffect(() =>{

    const intro = createTimeline({
    })
    intro.add('#subheading1',{
      opacity: [0, 1],
      translateY: [200, 0],
      duration: 800,
      easing: 'easeOutQuad'
    })
    intro.add('#heading',{
      opacity: [0, 1],
      translateY: [200, 0],
      duration: 800,
      easing: 'easeOutQuad'
    }, '-=700')  // Play at same time as previous animation
    intro.add('#subheading2',{
      opacity: [0, 1],
      translateY: [200, 0],
      duration: 800,
      easing: 'easeOutQuad'
    }, '-=700')
    intro.add('#signbutton',{
      opacity: [0, 1],
      translateY: [200, 0],
      duration: 800,
      easing: 'easeOutQuad'
    }, '-=700')

    intro.add('#adminbutton1', {
      opacity: [0, 1],
      translateY: [200, 0],
      duration: 800,
      easing: 'easeOutQuad'
    }, '-=600')
    
    intro.add('#adminbutton2', {
      opacity: [0, 1],
      translateY: [200, 0],
      duration: 800,
      easing: 'easeOutQuad'
    }, '-=600')

    intro.add('#adminbutton3', {
      opacity: [0, 1],
      translateY: [200, 0],
      duration: 800,
      easing: 'easeOutQuad'
    }, '-=600')

    intro.add('#secretbutton', {
      opacity: [0, 1],
      translateY: [200, 0],
      duration: 800,
      easing: 'easeOutQuad'
    }, '-=600')

    intro.add('#signbutton-text',{
      opacity: [0, 1],
      duration: 600,
      easing: 'easeOutQuad'
    }, '+=200')

    intro.add('#adminbuttonstext',{
      opacity: [0, 1],
      duration: 600,
      easing: 'easeOutQuad'
    }, '-=600')

    intro.add('#secretimage',{
      opacity: [0, 1],
      duration: 600,
      easing: 'easeOutQuad'
    }, '-=600')
    
  }, []);
  async function handleSignOut() {
    if (disabled) return;
    setDisabled(true);

    // Optional: call your sign-out endpoint to clear server session
    try {
      await fetch('/signin', { method: 'POST' });
    } catch (err) {
      // continue anyway
    }

    // Animate button up and fade out

    const tl = createTimeline({
      autoplay: true
    });

    tl.add('#all',{
      opacity: [1, 0],
      duration: 800,
      easing: cubicBezier(0.63,0.125,0.815,0.395)
    });



    // Wait for timeline to finish, then navigate
    setTimeout(() => {
      router.push('/signin?role=admin');
    }, 1200); // total animation duration
  }


  return (
    <main className="min-h-screen bg-yellow-50 text-slate-100 px-6 py-10">
      <div id='all' className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div id='subheading1' className="text-xs uppercase tracking-[0.15em] text-red-900 font-medium opacity-0">Admin Dashboard</div>
            <h1 id='heading' className="text-7xl font-bold tracking-tight text-red-700 py-2 opacity-0">Control Panel</h1>
            <p id='subheading2' className="text-red-900 text-m py-2 font-medium translate-x-12 opacity-0">Manage users and review disaster records.</p>
          </div>
          <button
            id="signbutton"
            onClick={handleSignOut}
            disabled={disabled}
            aria-busy={disabled}
            className="px-4 py-2 rounded-xl border border-white/20 bg-red-700 text-sm hover:bg-red-400 hover:text-white hover:shadow-2xl font-medium opacity-0"
          >
            <span id='signbutton-text' className="opacity-0">Sign out / switch</span>
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 ">
          <Link
            href="/admin/users"
            id='adminbutton1'
            className="group rounded-2xl border border-white/10 bg-red-700 p-5 hover:bg-red-400 hover:shadow-2xl opacity-0 space-y-2"
          >
            <div id='adminbuttonstext' className="text-sm uppercase tracking-[0.1em] text-white/80 group-hover:text-white/80 opacity-0">Manage</div>
            <div id='adminbuttonstext' className="text-xl font-semibold group-hover:text-white opacity-0">User management</div>
            <p id='adminbuttonstext' className="text-sm text-white/80 font-medium group-hover:text-white/80 opacity-0">Review users and update pending accounts.</p>
          </Link>

          <Link
            href="/admin/disaster-type"
            id='adminbutton2'
            className="group rounded-2xl border border-white/10 bg-red-700 p-5 hover:bg-red-400 hover:shadow-2xl opacity-0 space-y-2"
          >
            <div id='adminbuttonstext' className="text-sm uppercase tracking-[0.1em] text-white/80 group-hover:text-white/80 opacity-0">Manage</div>
            <div id='adminbuttonstext' className="text-xl font-semibold group-hover:text-white opacity-0">Create disaster types</div>
            <p id='adminbuttonstext' className="text-sm text-white/80 font-medium group-hover:text-white/80 opacity-0">Create and maintain disaster types.</p>
          </Link>

          <Link
            href="/admin/disasters"
            id='adminbutton3'
            className="group rounded-2xl border border-white/10 bg-red-700 p-5 hover:bg-red-400 hover:shadow-2xl opacity-0 space-y-2"
          >
            <div id='adminbuttonstext' className="text-sm uppercase tracking-[0.1em] text-white/80 group-hover:text-white/80 opacity-0">Manage</div>
            <div id='adminbuttonstext' className="text-xl font-semibold group-hover:text-white opacity-0">Disaster management</div>
            <p id='adminbuttonstext' className="text-sm text-white/80 font-medium group-hover:text-white/80 opacity-0">Review disasters and update status.</p>
          </Link>
        </div>
      </div>
      <button
        type="button"
        id='secretbutton'
        onClick={handleCursorClick}
        className="fixed bottom-4 right-4 h-14 w-14 rounded-full border border-white/20 bg-white/80 shadow-lg hover:shadow-xl flex items-center justify-center overflow-hidden opacity-0"
        aria-label="Secret cursor trigger"
      >
        <img id='secretimage' src="/kaiju/index/kaijyu1.png" alt="cursor hint" className="h-10 w-10 object-contain opacity-0" />
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center px-4 z-50">
          <div className="w-full max-w-sm rounded-2xl bg-white text-slate-900 shadow-2xl p-6 space-y-4">
            <div className="text-lg font-semibold">Enter keyword</div>
            <form className="space-y-3" onSubmit={handleSecretSubmit}>
              <input
                type="text"
                value={secretInput}
                onChange={(e) => setSecretInput(e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2"
                placeholder="Type keyword..."
                autoFocus
              />
              {secretError && <div className="text-sm text-red-600">{secretError}</div>}
              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setSecretError('');
                  }}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-slate-700 hover:border-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-red-700 text-white font-semibold hover:bg-red-800"
                >
                  Go
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
