import "./globals.css";
import { ReactNode } from "react";
import ClientSession from "./ClientSession";
import Navbar from "../components/layout/Navbar"; // ✅ Make sure path is correct

export const metadata = {
  title: "88West Realty Portal",
  description: "Team dashboard and approvals system",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ClientSession>
          <Navbar /> {/* ✅ This adds your top navigation bar */}
          {children}
        </ClientSession>
      </body>
    </html>
  );
}
