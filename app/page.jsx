'use client';

import Link from 'next/link';
import {animate, createTimeline} from 'animejs';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const tl = createTimeline({
      autoplay: true
    })
    tl.add('#start1',{
      delay: 1300,
      opacity: 1,
      easing: 'easeOutQuad',
      duration: 800
    })

    tl.add('#start2',{
      opacity: 1,
      easing: 'easeOutQuad',
      duration: 800
    }, '+=1200')

    tl.add('#start1',{
      opacity: 0,
      easing: 'easeOutQuad',
      duration: 800,

    }, '+=1300')

    tl.add('#start2',{
      opacity: 0,
      easing: 'easeOutQuad',
      duration: 800,

    }, '-=800')

    const mainpage = createTimeline({
      autoplay:true
    })

    mainpage.add('#page',{
      backgroundColor: ['#ffffff', '#fffde7'],
      duration: 1800,
      easing: 'easeInOutQuad',
      autoplay: false,
      delay: 6200
    }, '+=1300');

    setTimeout(() => {
      router.push('/mainpage');
    }, 8800);
  }, []);

  return (
    
    <main id='page' className="min-h-screen bg-white text-red-700 flex items-center justify-center px-6">
      
      <p id='start2' className='absolute text-center max-w-md w-full text-black text-xl translate-y-[60px] opacity-0'>by group f26</p>
      <p id='start1' className='absolute text-center max-w-md w-full text-black text-7xl opacity-0'>placeholder</p>

    </main>
  );
}
