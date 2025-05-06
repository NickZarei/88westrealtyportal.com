// app/layout.tsx

import './globals.css';
import { ReactNode } from 'react';
import SessionWrapper from './components/SessionWrapper'; // ✅ import your wrapper

export const metadata = {
  title: '88West Realty Portal',
  description: 'Team dashboard and approvals system',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SessionWrapper>{children}</SessionWrapper> {/* ✅ Wrap here */}
      </body>
    </html>
  );
}
