import { getEmpresas, getContactos } from "@/lib/airtable";
import EmpresasClient from "./EmpresasClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function EmpresasPage() {
  const [empresas, contactos] = await Promise.all([getEmpresas(), getContactos()]);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-white">Empresas</h1>
        <span className="text-sm text-muted">{empresas.length} empresas · clic para ver ficha</span>
      </div>
      <EmpresasClient empresas={empresas} contactos={contactos} />
    </div>
  );
}
