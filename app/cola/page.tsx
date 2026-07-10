import { getContactosConEmpresa } from "@/lib/airtable";
import ColaClient from "./ColaClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ColaPage() {
  let enCola = [];
  try {
    const todos = await getContactosConEmpresa();
    enCola = todos.filter((c) => c.estadoContacto === "En cola");
  } catch (e) {
    console.error(e);
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-mint font-semibold tracking-widest uppercase mb-1">Revisión previa al envío</p>
          <h1 className="text-2xl font-semibold text-white">Cola de aprobación</h1>
        </div>
        <span className="text-sm text-muted">{enCola.length} pendientes</span>
      </div>

      {enCola.length === 0 ? (
        <div className="rounded-xl border border-line bg-card p-16 text-center">
          <p className="text-4xl mb-4">✓</p>
          <p className="text-white font-semibold">Cola vacía</p>
          <p className="text-muted text-sm mt-2">No hay emails pendientes. Cuando n8n detecte nuevos contactos aparecerán aquí.</p>
        </div>
      ) : (
        <ColaClient contactos={enCola} />
      )}
    </div>
  );
}
