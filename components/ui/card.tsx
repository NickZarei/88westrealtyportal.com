// components/ui/card.tsx
import React from "react";

interface Props {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className = "" }: Props) {
  return <div className={`rounded-lg border bg-white p-4 shadow ${className}`}>{children}</div>;
}

export function CardHeader({ children, className = "" }: Props) {
  return <div className={`mb-2 ${className}`}>{children}</div>;
}

export function CardTitle({ children, className = "" }: Props) {
  return <h2 className={`text-lg font-semibold ${className}`}>{children}</h2>;
}

export function CardContent({ children, className = "" }: Props) {
  return <div className={`text-sm text-gray-700 ${className}`}>{children}</div>;
}
