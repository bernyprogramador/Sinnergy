import Link from "next/link";
import { getContactosConEmpresa, type Contacto } from "@/lib/airtable";
import StatusBadge from "@/components/StatusBadge";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const ROW_BORDER: Record<string, string> = {
  "No contactado": "border-l-zinc-500",
  "En cola": "border-l-yellow-400",
  "Email enviado": "border-l-blue-400",
  "Respondió": "border-l-mint",
  "Reunión acordada": "border-l-mint",
  "Descartado": "border-l-danger",
  "No contactar": "border-l-danger",
};

const LEGEND = [
  { label: "No contactado", color: "bg-zinc-500" },
  { label: "En cola", color: "bg-yellow-400" },
  { label: "Email enviado", color: "bg-blue-400" },
  { label: "Respondió", color: "bg-mint" },
  { label: "Reunión acordada", color: "bg-mint" },
  { label: "Descartado", color: "bg-danger" },
];

export default async function ContactosPage() {
  let contactos: Contacto[] = [];
  try {
    contactos = await getContactosConEmpresa();
  } catch (e) {
    console.error("Error cargando contactos:", e);
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-white">Contactos</h1>
        <span className="text-sm text-muted">{contactos.length} registros</span>
      </div>

      {/* Leyenda */}
      <div className="flex flex-wrap gap-3 text-xs">
        {LEGEND.map((l) => (
          <div key={l.label} className="flex items-center gap-1.5">
            <span className={`h-2 w-2 rounded-full ${l.color}`} />
            <span className="text-muted">{l.label}</span>
          </div>
        ))}
      </div>

      <div className="rounded-lg border border-line bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-line text-left text-xs text-muted uppercase tracking-wide">
              <th className="px-4 py-3">Nombre</th>
              <th className="px-4 py-3">Cargo</th>
              <th className="px-4 py-3">Empresa</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3 text-right">Ficha</th>
            </tr>
          </thead>
          <tbody>
            {contactos.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-muted">
                  Sin contactos
                </td>
              </tr>
            ) : (
              contactos.map((c) => {
                const borderColor = ROW_BORDER[c.estadoContacto] ?? "border-l-line";
                return (
                  <tr
                    key={c.id}
                    className={`border-b border-line border-l-2 ${borderColor} hover:bg-line/20 transition-colors`}
                  >
                    <td className="px-4 py-3 font-medium text-white">
                      <Link href={`/contactos/${c.id}`} className="hover:text-mint transition-colors">
                        {c.nombre}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-muted text-xs">{c.cargo}</td>
                    <td className="px-4 py-3 text-muted text-xs">{c.empresa}</td>
                    <td className="px-4 py-3">
                      {c.email && c.email !== "—" ? (
                        <Link
                          href={`/contactos/${c.id}`}
                          className="text-mint hover:underline text-xs font-mono"
                          title="Redactar email"
                        >
                          {c.email}
                        </Link>
                      ) : (
                        <span className="text-muted/40 text-xs">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={c.estadoContacto} />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/contactos/${c.id}`}
                        className="inline-flex items-center gap-1 text-xs bg-mint/10 hover:bg-mint/20 text-mint px-3 py-1 rounded-lg transition-colors border border-mint/20"
                      >
                        Ver ficha →
                      </Link>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
