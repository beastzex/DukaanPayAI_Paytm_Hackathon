import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'DukaanPayAI: Autonomous AI Business Partner for Indian Kirana Stores',
  description:
    'An autonomous AI business partner for Indian kirana store owners, operating entirely through WhatsApp. Built for Paytm Build For India AI Hackathon (Track 1: Merchant Growth AI).',
  keywords: [
    'DukaanPayAI',
    'Kirana AI',
    'WhatsApp AI',
    'Paytm Soundbox',
    'Merchant Growth AI',
    'Build For India',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth bg-white text-slate-900">
      <body className="min-h-screen bg-white text-slate-900 antialiased selection:bg-amber-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
