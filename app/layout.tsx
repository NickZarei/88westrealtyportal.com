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
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content={metadata.description} />
        <link rel="icon" href="/favicon.ico" />
        <title>{metadata.title}</title>
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
