import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '5-Second Reflex - Hyper-Casual Reflex Game',
  description: 'Test your reflexes in this addictive hyper-casual game',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
