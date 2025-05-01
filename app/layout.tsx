import "./globals.css";
import { ReactNode } from "react";
import Navbar from "../components/layout/Navbar";
import ClientToaster from "../components/layout/ClientToaster"; // ✅ Fixed path

export const metadata = {
  title: "88West Realty Portal",
  description: "Team dashboard and approvals system",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>
        <Navbar />
        <ClientToaster />
        {children}
      </body>
    </html>
  );
}
