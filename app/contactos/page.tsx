import Link from "next/link";
import { getContactosConEmpresa, type Contacto } from "@/lib/airtable";
import StatusBadge from "@/components/StatusBadge";
import ContactosActions from "./ContactosActions";

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
  { label: "No contactar", color: "bg-danger" },
];

function formatFecha(fecha: string) {
  if (!fecha) return "—";
  try {
    return new Date(fecha).toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit", year: "2-digit" });
  } catch { return fecha; }
}

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

      <div className="flex flex-wrap gap-3 text-xs">
        {LEGEND.map((l) => (
          <div key={l.label} className="flex items-center gap-1.5">
            <span className={`h-2 w-2 rounded-full ${l.color}`} />
            <span className="text-muted">{l.label}</span>
          </div>
        ))}
      </div>

      <div className="rounded-lg border border-line bg-card overflow-x-auto">
        <table className="w-full text-sm min-w-[1000px]">
          <thead>
            <tr className="border-b border-line text-left text-xs text-muted uppercase tracking-wide">
              <th className="px-4 py-3">Nombre</th>
              <th className="px-4 py-3">Cargo</th>
              <th className="px-4 py-3">Empresa</th>
              <th className="px-4 py-3">Ubicación</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3">Fecha envío</th>
              <th className="px-4 py-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {contactos.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-muted">Sin contactos</td>
              </tr>
            ) : (
              contactos.map((c) => {
                const borderColor = ROW_BORDER[c.estadoContacto] ?? "border-l-line";
                const esNoContactar = c.estadoContacto === "No contactar" || c.noContactar;
                return (
                  <tr key={c.id} className={`border-b border-line border-l-2 ${borderColor} hover:bg-line/20 transition-colors ${esNoContactar ? "opacity-50" : ""}`}>
                    <td className="px-4 py-3 font-medium text-white">
                      <Link href={`/contactos/${c.id}`} className="hover:text-mint transition-colors">{c.nombre}</Link>
                    </td>
                    <td className="px-4 py-3 text-muted text-xs">{c.cargo}</td>
                    <td className="px-4 py-3 text-muted text-xs">{c.empresa}</td>
                    <td className="px-4 py-3 text-muted text-xs">{c.ubicacion || "—"}</td>
                    <td className="px-4 py-3">
                      {c.email && c.email !== "—" ? (
                        <Link href={`/contactos/${c.id}`} className="text-mint hover:underline text-xs font-mono" title="Redactar email">{c.email}</Link>
                      ) : (
                        <span className="text-muted/40 text-xs">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3"><StatusBadge status={c.estadoContacto} /></td>
                    <td className="px-4 py-3 text-muted text-xs">{formatFecha(c.fechaEmailEnviado)}</td>
                    <td className="px-4 py-3 text-right">
                      <ContactosActions contactoId={c.id} estadoActual={c.estadoContacto} />
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
