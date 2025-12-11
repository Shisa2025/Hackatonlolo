import './globals.css';
import '../component/index.css';
import NavBar from './components/NavBar';

export const metadata = {
  title: 'Hackatonlolo',
  description: 'World saving website built with Next.js',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body className="bg-[#0d0000] text-slate-100">
        <NavBar />
        {children}
      </body>
    </html>
  );
}
