"use client";

import { ReactNode } from "react";
import { SessionProvider } from "next-auth/react";
import ClientLayout from "./ClientLayout";
import Navbar from "@/components/layout/Navbar";

export default function ClientLayoutWrapper({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <ClientLayout>
        <Navbar />
        {children}
      </ClientLayout>
    </SessionProvider>
  );
}
