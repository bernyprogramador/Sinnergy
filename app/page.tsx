import Link from "next/link";
import { getResumen } from "@/lib/airtable";

export const revalidate = 60;

export default async function DashboardPage() {
  let resumen = {
    totalEmpresas: 0,
    totalContactos: 0,
    leadsNuevos: 0,
    leadsValidados: 0,
  };

  try {
    resumen = await getResumen();
  } catch (e) {
    console.error("Error cargando resumen:", e);
  }

  const CARDS = [
    { label: "Total empresas", value: resumen.totalEmpresas },
    { label: "Total contactos", value: resumen.totalContactos },
    { label: "Leads nuevos", value: resumen.leadsNuevos },
    { label: "Leads validados", value: resumen.leadsValidados },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-ink">Dashboard — ProspectOS</h1>

      <section className="rounded-lg border border-line bg-card p-6">
        <div className="grid grid-cols-2 gap-x-8 gap-y-6 sm:grid-cols-3 lg:grid-cols-5">
          {CARDS.map((card) => (
            <div key={card.label} className="border-b border-line pb-4 lg:border-b-0 lg:pb-0">
              <p className="text-xs text-muted">{card.label}</p>
              <p className="mt-1.5 text-3xl font-bold text-ink">{card.value}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[
          { href: "/contactos", label: "👥 Ver contactos", desc: `${resumen.totalContactos} contactos importados` },
          { href: "/cola", label: "🎯 Pipeline", desc: `${resumen.totalContactos} contactos en el funnel` },
          { href: "/campanas", label: "📧 Campañas", desc: "Estado de envíos" },
          { href: "/oportunidades", label: "🎯 Oportunidades", desc: "Pipeline de reuniones" },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-lg border border-line bg-card p-5 transition-colors hover:border-mint"
          >
            <p className="font-semibold text-ink">{item.label}</p>
            <p className="mt-1 text-xs text-muted">{item.desc}</p>
          </Link>
        ))}
      </section>
    </div>
  );
}
