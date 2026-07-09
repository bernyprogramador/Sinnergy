import type { Metadata, Viewport } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "Nexe · Captación B2B",
  description: "Sistema de captación de leads B2B — Nexe Digital",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="font-sans antialiased">
        <div className="flex min-h-screen bg-base text-ink">
          <Sidebar />
          <main className="flex-1 overflow-x-auto">
            <div className="mx-auto max-w-screen-2xl px-8 py-8">{children}</div>
          </main>
        </div>
      </body>
    </html>
  );
}
