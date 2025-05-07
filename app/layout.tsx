// app/layout.tsx

import './globals.css';
import { ReactNode } from 'react';
import SessionWrapper from './components/SessionWrapper';

export const metadata = {
  title: '88West Realty Portal',
  description: 'Team dashboard and approvals system',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900 font-sans">
        <SessionWrapper>{children}</SessionWrapper>
      </body>
    </html>
  );
}
