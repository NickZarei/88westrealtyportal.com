import "./globals.css";
import { ReactNode } from "react";
import Navbar from "@/components/layout/Navbar";
import ClientToaster from "@/components/layout/ClientToaster";
import ClientLayout from "./ClientLayout";

export const metadata = {
  title: "88West Realty Portal",
  description: "Team dashboard and approvals system",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" /> {/* ✅ Favicon */}
        <title>88West Realty Portal</title>
        <meta name="description" content="Team dashboard and approvals system" />
      </head>
      <body style={{ margin: 0 }}>
        <ClientLayout>
          <Navbar />
          <ClientToaster />
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
