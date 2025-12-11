'use client';

import Link from 'next/link';
import {animate, createTimeline} from 'animejs';
import { useEffect } from 'react';


export default function Home() {

  useEffect(() => {
    const tl = createTimeline({
      autoplay: true
    })


    tl.add('#content',{
      opacity: 1,
      duration: 1500,
      easing: 'easeInOutQuad',
      delay: 1300
    })
  }, []);

  return (
    
    <main id='page' className="min-h-screen bg-yellow-50 text-red-700 flex items-center justify-center px-6">
      
      <p id='start2' className='absolute text-center max-w-md w-full text-black text-xl translate-y-[60px] opacity-0'>placeholder</p>
      <p id='start1' className='absolute text-center max-w-md w-full text-black text-7xl opacity-0'>placeholder</p>
      <div id='content' className="max-w-md w-full space-y-6 text-center opacity-0">
        <div className="text-xs uppercase tracking-[0.2em] text-red-500 font-semibold">Disaster Simulation</div>
        <h1 className="text-8xl font-bold tracking-tight">Welcome</h1>
        <p className="text-red-500">Choose an action to continue.</p>
        <div className="flex justify-center gap-4 flex-wrap">
          <Link
            href="/register"
            className="px-5 py-3 rounded-xl border border-red-700 bg-sky-200 text-slate-900 font-semibold shadow hover:bg-white"
          >
            Get started
          </Link>
          <Link
            href="/more-info"
            className="px-5 py-3 rounded-xl bg-sky-200 border border-red-700 text-slate-900 font-semibold hover:bg-white"
          >
            More info
          </Link>
        </div>
      </div>
    </main>
  );
}