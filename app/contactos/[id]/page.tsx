import { getContactos } from "@/lib/airtable";
import EmailEditor from "./EmailEditor";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ContactoDetallePage({ params }: { params: { id: string } }) {
  let contactos: Awaited<ReturnType<typeof getContactos>> = [];
  try { contactos = await getContactos(); } catch (e) { console.error(e); }

  const contacto = contactos.find((c) => c.id === params.id);
  if (!contacto) return notFound();

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="border-b border-line pb-5">
        <p className="text-xs text-mint font-semibold tracking-widest uppercase mb-1">Contacto</p>
        <h1 className="text-2xl font-bold text-white">{contacto.nombre}</h1>
        <p className="text-muted text-sm mt-1">{contacto.cargo} · {contacto.empresa}</p>
      </div>

      {/* Info */}
      <div className="grid grid-cols-2 gap-4">
        {[
          { label: "Email", value: contacto.email },
          { label: "Estado", value: contacto.estadoContacto },
          { label: "Empresa", value: contacto.empresa },
          { label: "LinkedIn", value: contacto.linkedin || "—" },
        ].map((f) => (
          <div key={f.label} className="rounded-lg border border-line bg-card p-4">
            <p className="text-xs text-muted uppercase tracking-wider mb-1">{f.label}</p>
            <p className="text-white text-sm font-medium">{f.value}</p>
          </div>
        ))}
      </div>

      {/* Editor email */}
      <EmailEditor contacto={contacto} />
    </div>
  );
}
