"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/", label: "Dashboard", icon: "▣" },
  { href: "/contactos", label: "Contactos", icon: "◎" },
  { href: "/cola", label: "Pipeline", icon: "→" },
  { href: "/empresas", label: "Empresas", icon: "◈" },
  { href: "/campanas", label: "Campañas", icon: "◆" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-56 shrink-0 flex-col border-r border-line bg-sidebar">
      <div className="px-5 pt-7 pb-5 border-b border-line">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg bg-mint flex items-center justify-center">
            <span className="text-xs font-black text-black">N</span>
          </div>
          <span className="text-white font-bold text-lg tracking-tight">nexe</span>
        </div>
        <div className="mt-3 flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-mint" />
          <p className="text-xs text-mint font-medium tracking-wider uppercase">Captación B2B</p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {LINKS.map((link) => {
          const active =
            link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all duration-150 ${
                active
                  ? "bg-mint/10 text-mint font-semibold border border-mint/25"
                  : "text-sidemuted hover:bg-white/5 hover:text-white border border-transparent"
              }`}
            >
              <span className={`text-sm ${active ? "text-mint" : "text-sidemuted group-hover:text-mint"}`}>
                {link.icon}
              </span>
              {link.label}
              {active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-mint" />}
            </Link>
          );
        })}
      </nav>

      <div className="px-4 py-4 border-t border-line">
        <div className="flex items-center gap-2 text-xs text-sidemuted">
          <span className="h-1.5 w-1.5 rounded-full bg-mint animate-pulse" />
          Airtable