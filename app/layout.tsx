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
        <link rel="icon" href="/favicon.ico" />
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
      </head>
      <body className="bg-gray-50 text-gray-900">
        <ClientLayout>
          <Navbar />
          <ClientToaster />
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
