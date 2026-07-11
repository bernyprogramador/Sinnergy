import Link from "next/link";
import { getResumen } from "@/lib/airtable";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function DashboardPage() {
  let resumen = { totalEmpresas: 0, totalContactos: 0, leadsNuevos: 0, leadsValidados: 0 };
  try { resumen = await getResumen(); } catch (e) { console.error(e); }

  const conversionRate = resumen.totalContactos > 0
    ? Math.round((resumen.leadsValidados / resumen.totalContactos) * 100)
    : 0;

  const cobertura = resumen.totalEmpresas > 0
    ? Math.round((resumen.totalContactos / resumen.totalEmpresas) * 100)
    : 0;

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-mint font-semibold tracking-[0.2em] uppercase mb-1">
            Sistema de captación
          </p>
          <h1 className="text-2xl font-bold text-white tracking-tight">Dashboard</h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs text-mint bg-mint/8 border border-mint/20 rounded-full px-3 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-mint animate-pulse" />
            En vivo
          </div>
          <div className="text-xs text-muted bg-card border border-line rounded-full px-3 py-1.5">
            {new Date().toLocaleDateString("es-ES", { weekday: "short", day: "numeric", month: "short" })}
          </div>
        </div>
      </div>

      {/* KPIs principales */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Empresas */}
        <div className="relative rounded-2xl border border-line bg-card p-5 overflow-hidden group hover:border-white/20 transition-all">
          <div className="absolute top-0 right-0 w-20 h-20 bg-white/3 rounded-full -translate-y-6 translate-x-6" />
          <div className="flex items-start justify-between mb-4">
            <div className="w-9 h-9 rounded-xl bg-white/8 flex items-center justify-center text-base">◈</div>
            <span className="text-xs text-muted">Empresas</span>
          </div>
          <p className="text-3xl font-bold text-white">{resumen.totalEmpresas}</p>
          <p className="text-xs text-muted mt-1">base de datos</p>
          <div className="mt-3 h-px bg-line" />
          <p className="text-xs text-muted mt-2">{cobertura}% con contacto</p>
        </div>

        {/* Contactos */}
        <div className="relative rounded-2xl border border-line bg-card p-5 overflow-hidden group hover:border-white/20 transition-all">
          <div className="absolute top-0 right-0 w-20 h-20 bg-white/3 rounded-full -translate-y-6 translate-x-6" />
          <div className="flex items-start justify-between mb-4">
            <div className="w-9 h-9 rounded-xl bg-white/8 flex items-center justify-center text-base">◎</div>
            <span className="text-xs text-muted">Contactos</span>
          </div>
          <p className="text-3xl font-bold text-white">{resumen.totalContactos}</p>
          <p className="text-xs text-muted mt-1">importados</p>
          <div className="mt-3 h-px bg-line" />
          <p className="text-xs text-muted mt-2">
            {resumen.totalEmpresas > 0 ? (resumen.totalContactos / resumen.totalEmpresas).toFixed(1) : "—"} por empresa
          </p>
        </div>

        {/* Leads nuevos */}
        <div className="relative rounded-2xl border border-mint/30 bg-mint/5 p-5 overflow-hidden group hover:border-mint/50 transition-all">
          <div className="absolute top-0 right-0 w-20 h-20 bg-mint/5 rounded-full -translate-y-6 translate-x-6" />
          <div className="flex items-start justify-between mb-4">
            <div className="w-9 h-9 rounded-xl bg-mint/15 flex items-center justify-center text-base">◆</div>
            <span className="text-xs text-mint/70">Leads nuevos</span>
          </div>
          <p className="text-3xl font-bold text-mint">{resumen.leadsNuevos}</p>
          <p className="text-xs text-mint/60 mt-1">identificados</p>
          <div className="mt-3 h-px bg-mint/20" />
          <p className="text-xs text-mint/60 mt-2">pendientes de contactar</p>
        </div>

        {/* Conversión */}
        <div className="relative rounded-2xl border border-mint/30 bg-mint/5 p-5 overflow-hidden group hover:border-mint/50 transition-all">
          <div className="absolute top-0 right-0 w-20 h-20 bg-mint/5 rounded-full -translate-y-6 translate-x-6" />
          <div className="flex items-start justify-between mb-4">
            <div className="w-9 h-9 rounded-xl bg-mint/15 flex items-center justify-center text-base">→</div>
            <span className="text-xs text-mint/70">Validados</span>
          </div>
          <p className="text-3xl font-bold text-mint">{resumen.leadsValidados}</p>
          <p className="text-xs text-mint/60 mt-1">leads validados</p>
          <div className="mt-3 h-px bg-mint/20" />
          <p className="text-xs text-mint/60 mt-2">{conversionRate}% conversión</p>
        </div>
      </section>

      {/* Pipeline visual */}
      <section className="rounded-2xl border border-line bg-card p-6">
        <div className="flex items-center justify-between mb-5">
          <p className="text-sm font-semibold text-white">Pipeline de captación</p>
          <span className="text-xs text-muted">flujo activo</span>
        </div>
        <div className="flex items-stretch gap-0">
          {[
            { label: "Empresas", value: resumen.totalEmpresas, pct: 100, color: "bg-white/20" },
            { label: "Contactos", value: resumen.totalContactos, pct: resumen.totalEmpresas > 0 ? Math.round((resumen.totalContactos/resumen.totalEmpresas)*100) : 0, color: "bg-white/30" },
            { label: "Leads nuevos", value: resumen.leadsNuevos, pct: resumen.totalContactos > 0 ? Math.round((resumen.leadsNuevos/resumen.totalContactos)*100) : 0, color: "bg-mint/50" },
            { label: "Validados", value: resumen.leadsValidados, pct: resumen.leadsNuevos > 0 ? Math.round((resumen.leadsValidados/resumen.leadsNuevos)*100) : 0, color: "bg-mint" },
          ].map((stage, i) => (
            <div key={stage.label} className="flex-1 relative">
              {i > 0 && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-px z-10 text-muted text-xs">›</div>
              )}
              <div className={`mx-1 rounded-xl p-4 ${i >= 2 ? "bg-mint/8 border border-mint/20" : "bg-white/4 border border-white/8"}`}>
                <p className="text-xs text-muted mb-1">{stage.label}</p>
                <p className={`text-xl font-bold ${i >= 2 ? "text-mint" : "text-white"}`}>{stage.value}</p>
                <div className="mt-2 h-1 bg-black/20 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${stage.color} transition-all`}
                    style={{ width: `${Math.min(stage.pct, 100)}%` }}
                  />
                </div>
                <p className="text-xs text-muted mt-1">{stage.pct}%</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Accesos rápidos + Salud canal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">

        {/* Accesos rápidos */}
        <div className="lg:col-span-2 grid grid-cols-2 gap-3">
          {[
            { href: "/contactos", label: "Contactos", desc: `${resumen.totalContactos} importados`, icon: "◎", badge: null },
            { href: "/cola", label: "Cola", desc: "Revisar y aprobar emails", icon: "→", badge: "Pendientes" },
            { href: "/empresas", label: "Empresas", desc: "Base de datos", icon: "◈", badge: null },
            { href: "/campanas", label: "Campañas", desc: "Seguimiento activo", icon: "◆", badge: null },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group relative rounded-2xl border border-line bg-card p-5 hover:border-mint/40 hover:bg-mint/3 transition-all duration-200"
            >
              {item.badge && (
                <span className="absolute top-3 right-3 text-[10px] bg-mint/15 text-mint px-2 py-0.5 rounded-full font-medium border border-mint/20">
                  {item.badge}
                </span>
              )}
              <span className="text-xl text-mint mb-3 block">{item.icon}</span>
              <p className="font-semibold text-white text-sm group-hover:text-mint transition-colors">{item.label}</p>
              <p className="mt-0.5 text-xs text-muted">{item.desc}</p>
              <div className="mt-3 flex items-center gap-1 text-xs text-muted/50 group-hover:text-mint/50 transition-colors">
                Abrir <span className="text-[10px]">→</span>
              </div>
            </Link>
          ))}
        </div>

        {/* Salud del canal */}
        <div className="rounded-2xl border border-line bg-card p-5 flex flex-col gap-4">
          <p className="text-sm font-semibold text-white">Salud del canal</p>

          {[
            { label: "Rebote", value: "—", sub: "sin datos aún", ok: null },
            { label: "Respuesta", value: "—", sub: "sin datos aún", ok: null },
            { label: "Warmup", value: "Pendiente", sub: "configura dominio", ok: false },
          ].map((m) => (
            <div key={m.label} className="flex items-center justify-between py-2.5 border-b border-line last:border-0">
              <div>
                <p className="text-xs text-muted">{m.label}</p>
                <p className="text-xs text-muted/50 mt-0.5">{m.sub}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-sm font-semibold ${m.ok === true ? "text-mint" : m.ok === false ? "text-yellow-400" : "text-white/40"}`}>
                  {m.value}
                </span>
                {m.ok === false && <span className="h-1.5 w-1.5 rounded-full bg-yellow-400 animate-pulse" />}
                {m.ok === null && <span className="h-1.5 w-1.5 rounded-full bg-white/20" />}
              </div>
            </div>
          ))}

          <div className="mt-auto pt-2">
            <div className="rounded-xl bg-mint/8 border border-mint/20 p-3">
              <p className="text-xs text-mint font-medium mb-1">Próximo paso</p>
              <p className="text-xs text-muted leading-relaxed">
                Configura tu dominio de envío para activar el warmup y mejorar la entregabilidad.
              </p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
