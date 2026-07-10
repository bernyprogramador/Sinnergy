"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Empresa, Contacto } from "@/lib/airtable";
import StatusBadge from "@/components/StatusBadge";

const SECTOR_COLOR: Record<string, string> = {
  "Gestoría/Asesoría": "text-mint",
  "Inmobiliaria/Promotora": "text-warn",
  "Entidad pública compatible": "text-blue-400",
};

function initials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

export default function EmpresasClient({
  empresas,
  contactos,
}: {
  empresas: Empresa[];
  contactos: Contacto[];
}) {
  const [selected, setSelected] = useState<Empresa | null>(null);
  const router = useRouter();

  const contactosDeEmpresa = selected
    ? contactos.filter((c) => c.empresaId === selected.id)
    : [];

  return (
    <div className="flex gap-4 min-h-[600px] overflow-x-auto">
      {/* Lista izquierda */}
      <div className="flex-1 overflow-y-auto rounded-xl border border-line bg-card">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-thead z-10">
            <tr className="border-b border-line text-left text-xs text-muted">
              <th className="px-4 py-3">Empresa</th>
              <th className="px-4 py-3">Sector</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3 text-right">Score</th>
            </tr>
          </thead>
          <tbody>
            {empresas.map((e) => (
              <tr
                key={e.id}
                onClick={() => setSelected(selected?.id === e.id ? null : e)}
                className={`border-b border-line cursor-pointer transition-colors ${
                  selected?.id === e.id
                    ? "bg-mint/10 border-l-2 border-l-mint"
                    : "hover:bg-line/30"
                }`}
              >
                <td className="px-4 py-3 font-medium text-white">{e.nombre}</td>
                <td className={`px-4 py-3 text-xs ${SECTOR_COLOR[e.sector] ?? "text-muted"}`}>
                  {e.sector}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={e.estado} />
                </td>
                <td className="px-4 py-3 text-right">
                  <span
                    className={`font-bold text-sm ${
                      e.score >= 7
                        ? "text-mint"
                        : e.score >= 4
                        ? "text-warn"
                        : "text-muted"
                    }`}
                  >
                    {e.score || "—"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Panel detalle derecho */}
      {selected ? (
        <div className="w-80 shrink-0 overflow-y-auto rounded-xl border border-mint/20 bg-card space-y-5 p-5">
          {/* Header */}
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-lg bg-mint/20 flex items-center justify-center shrink-0">
              <span className="text-mint font-bold text-sm">{initials(selected.nombre)}</span>
            </div>
            <div>
              <h2 className="text-white font-bold text-base leading-tight">{selected.nombre}</h2>
              <div className="flex gap-2 mt-1.5 flex-wrap">
                {selected.sector && (
                  <span className="text-xs bg-mint/10 text-mint px-2 py-0.5 rounded-full">
                    {selected.sector}
                  </span>
                )}
                <span className="text-xs bg-line text-muted px-2 py-0.5 rounded-full">
                  {selected.estado || "—"}
                </span>
              </div>
            </div>
            <button
              onClick={() => setSelected(null)}
              className="ml-auto text-muted hover:text-white text-lg leading-none"
            >
              ×
            </button>
          </div>

          {/* Notas / descripción */}
          {selected.notas && (
            <div>
              <p className="text-xs text-mint font-semibold uppercase tracking-widest mb-2">
                A qué se dedican
              </p>
              <p className="text-muted text-xs leading-relaxed">{selected.notas}</p>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: "Tamaño", value: selected.tamanyo ? `${selected.tamanyo} empl.` : "—" },
              { label: "Contactos", value: contactosDeEmpresa.length },
              { label: "Score lead", value: selected.score ? `${selected.score}/10` : "0/10" },
            ].map((s) => (
              <div key={s.label} className="rounded-lg bg-base border border-line p-3 text-center">
                <p className="text-xs text-muted mb-1">{s.label}</p>
                <p className="text-white font-semibold text-sm">{s.value}</p>
              </div>
            ))}
          </div>

          {/* Contactos */}
          {contactosDeEmpresa.length > 0 && (
            <div>
              <p className="text-xs text-mint font-semibold uppercase tracking-widest mb-2">
                Quiénes son
              </p>
              <div className="space-y-2">
                {contactosDeEmpresa.map((c) => (
                  <div
                    key={c.id}
                    className="rounded-lg bg-base border border-line p-3 space-y-2"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-7 w-7 rounded-full bg-mint/15 flex items-center justify-center shrink-0">
                        <span className="text-mint text-xs font-bold">{initials(c.nombre)}</span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-white text-xs font-semibold truncate">{c.nombre}</p>
                        <p className="text-muted text-xs truncate">{c.cargo}</p>
                      </div>
                      {c.decisor === "Sí" && (
                        <span className="text-xs bg-mint/10 text-mint px-1.5 py-0.5 rounded shrink-0">
                          Decisor
                        </span>
                      )}
                    </div>
                    {c.email && c.email !== "—" && (
                      <button
                        onClick={() => router.push(`/contactos/${c.id}`)}
                        className="w-full text-xs bg-mint/10 hover:bg-mint/20 text-mint border border-mint/20 rounded-lg py-1.5 transition-colors font-medium"
                      >
                        ✉ Redactar email
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Links */}
          <div className="flex gap-2">
            {selected.web && (
              <a
                href={selected.web}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 text-center text-xs bg-base border border-line text-muted hover:text-white hover:border-mint/30 rounded-lg py-2 transition-colors"
              >
                🌐 Web
              </a>
            )}
          