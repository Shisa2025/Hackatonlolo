'use client';

import Link from 'next/link';
import {animate, createTimeline} from 'animejs';
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
    <main className="min-h-screen bg-yellow-50 text-red-700 flex items-center justify-center px-6">
      <div className="max-w-md w-full space-y-6 text-center">
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
            href="/signin"
            className="px-5 py-3 rounded-xl border border-red-700 bg-white text-red-700 font-semibold shadow hover:bg-sky-100"
          >
            Login
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
