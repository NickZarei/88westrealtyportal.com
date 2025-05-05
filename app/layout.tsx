import "./globals.css";
import { ReactNode } from "react";

export const metadata = {
  title: "88West Realty Portal",
  description: "Elegant UI for team collaboration",
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
      <body className="min-h-screen bg-gradient-to-br from-white to-gray-100 text-gray-900 font-sans antialiased">
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
      </body>
    </html>
  );
}
