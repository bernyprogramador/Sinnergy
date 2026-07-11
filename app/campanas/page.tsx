import { getCampanas } from "@/lib/airtable";
import CampanasClient from "./CampanasClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function CampanasPage() {
  const campanas = await getCampanas();

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between border-b border-line pb-5">
        <div>
          <p className="text-xs text-mint font-semibold tracking-[0.2em] uppercase mb-1">Campañas activas</p>
          <h1 className="text-2xl font-bold text-white tracking-tight">Campañas</h1>
          <p className="text-sm text-muted mt-1">
            El briefing de cada campaña lo usa la IA para personalizar los emails.
          </p>
        </div>
        <span className="text-xs text-muted bg-card border border-line rounded-full px-3 py-1.5">
          {campanas.length} campaña{campanas.length !== 1 ? "s" : ""}
        </span>
      </div>

      <CampanasClient campanas={campanas} />
    </div>
  );
}
