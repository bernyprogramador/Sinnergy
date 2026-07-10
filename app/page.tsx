import Link from "next/link";
import { getResumen } from "@/lib/airtable";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function DashboardPage() {
  let resumen = { totalEmpresas: 0, totalContactos: 0, leadsNuevos: 0, leadsValidados: 0 };
  try { resumen = await getResumen(); } catch (e) { console.error(e); }

  const CARDS = [
    { label: "Total empresas", value: resumen.totalEmpresas, color: "text-white" },
    { label: "Total contactos", value: resumen.totalContactos, color: "text-white" },
    { label: "Leads nuevos", value: resumen.leadsNuevos, color: "text-mint" },
    { label: "Leads validados", value: resumen.leadsValidados, color: "text-mint" },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-end justify-between border-b border-line pb-6">
        <div>
          <p className="text-xs text-mint font-semibold tracking-widest uppercase mb-1">Sistema de captación</p>
          <h1 className="text-3xl font-bold text-white tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted mt-1">Visión general de la captación de leads B2B</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-sidemuted bg-card border border-line rounded-lg px-3 py-2">
          <span className="h-1.5 w-1.5 rounded-full bg-mint animate-pulse" />
          Sistema operativo
        </div>
      </div>

      {/* KPIs */}
      <section className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {CARDS.map((card) => (
          <div key={card.label} className="rounded-xl border border-line bg-card p-5 hover:border-mint/30 transition-colors">
            <p className="text-xs text-muted uppercase tracking-wider mb-3">{card.label}</p>
            <p className={`text-4xl font-bold ${card.color}`}>{card.value}</p>
          </div>
        ))}
      </section>

      {/* Accesos rápidos */}
      <section>
        <p className="text-xs text-muted uppercase tracking-widest mb-4">Acceso rápido</p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { href: "/contactos", label: "Contactos", desc: `${resumen.totalContactos} importados`, icon: "◎", color: "hover:border-mint/40" },
            { href: "/cola", label: "Cola de aprobación", desc: "Revisar y enviar emails", icon: "→", color: "hover:border-mint/40" },
            { href: "/empresas", label: "Empresas", desc: "Base de datos", icon: "◈", color: "hover:border-mint/40" },
            { href: "/campanas", label: "Campañas", desc: "Seguimiento de campañas", icon: "◆", color: "hover:border-mint/40" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`group rounded-xl border border-line bg-card p-5 transition-all duration-200 ${item.color}`}
            >
              <span className="text-2xl text-mint mb-3 block">{item.icon}</span>
              <p className="font-semibold text-white group-hover:text-mint transition-colors">{item.label}</p>
              <p className="mt-1 text-xs text-muted">{item.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Salud del canal */}
      <section className="rounded-xl border border-line bg-card p-6">
        <p className="text-xs text-muted uppercase tracking-widest mb-4">Salud del canal email</p>
        <div className="grid grid-cols-3 gap-6">
          {[
            { label: "Tasa de rebote", value: "—" },
            { label: "Tasa de respuesta", value: "—" },
            { label: "Estado warmup", value: "Pendiente" },
          ].map((m) => (
            <div key={m.label}>
              <p className="text-xs text-muted mb-1">{m.label}</p>
              <p className="text-lg font-semibold text-white">{m.value}</p>
              <div className="mt-2 h-0.5 w-8 bg-mint/30 rounded" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
