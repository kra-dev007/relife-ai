import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ReLife AI — Diagnose. Refurbish. Resell. Don’t Discard.',
  description: 'AI-Powered Hardware Diagnostics, Battery Aging Intelligence, and Digital Device Passport for Sustainable Laptop Refurbishment.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
