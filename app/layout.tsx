import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Arrow Flow | Arrow Solutions Agency OS',
  description: 'Enterprise internal agency management operating system for Arrow Solutions: Offline Marketing, Brand Activation & Web/IT Solutions.',
  icons: {
    icon: '/arrow-logo.jpg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-slate-950 text-slate-100 antialiased selection:bg-sky-500/30 selection:text-sky-200">
        {children}
      </body>
    </html>
  );
}
