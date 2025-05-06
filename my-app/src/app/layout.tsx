import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// Load the font
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "88West Realty Portal",
  description: "Team dashboard and approvals system",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.variable}>
        {children}
      </body>
    </html>
  );
}
