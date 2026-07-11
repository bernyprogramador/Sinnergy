"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Campana } from "@/lib/airtable";

const SECTORES = [
  "Gestoría/Asesoría", "Inmobiliaria/Promotora", "RRHH/Selección",
  "Legal/Abogados", "Consultoría", "Tecnología", "Formación",
  "Hostelería/Turismo", "Salud", "Industria", "Otro",
];

const ESTADO_COLOR: Record<string, string> = {
  "Activa": "text-mint bg-mint/10 border-mint/20",
  "Pausada": "text-yellow-300 bg-yellow-400/10 border-yellow-400/20",
  "Borrador": "text-muted bg-white/5 border-white/10",
  "Finalizada": "text-muted bg-white/5 border-white/10",
};

type View = "list" | "nueva";

export default function CampanasClient({ campanas: inicial }: { campanas: Campana[] }) {
  const [campanas, setCampanas] = useState(inicial);
  const [selected, setSelected] = useState<Campana | null>(inicial[0] ?? null);
  const [briefing, setBriefing] = useState(inicial[0]?.briefing ?? "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [view, setView] = useState<View>("list");
  const [form, setForm] = useState({ nombre: "", sector: "", briefing: "", dominio: "" });
  const [creating, setCreating] = useState(false);
  const router = useRouter();

  function selectCampana(c: Campana) {
    setSelected(c);
    setBriefing(c.briefing ?? "");
    setSaved(false);
  }

  async function guardarBriefing() {
    if (!selected) return;
    setSaving(true);
    await fetch("/api/update-campana", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ campanaId: selected.id, briefing }),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  async function crearCampana() {
    if (!form.nombre.trim()) return;
    setCreating(true);
    const res = await fetch("/api/create-campana", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setView("list");
      setForm({ nombre: "", sector: "", briefing: "", dominio: "" });
      router.refresh();
    }
    setCreating(false);
  }

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setView("list")}
          className={`text-sm px-4 py-2 rounded-xl border transition-all font-medium ${view === "list" ? "bg-mint/10 border-mint/30 text-mint" : "bg-card border-line text-muted hover:text-white"}`}
        >
          Mis campañas ({campanas.length})
        </button>
        <button
          onClick={() => setView("nueva")}
          className={`text-sm px-4 py-2 rounded-xl border transition-all font-medium ${view === "nueva" ? "bg-mint/10 border-mint/30 text-mint" : "bg-card border-line text-muted hover:text-white"}`}
        >
          + Nueva campaña
        </button>
      </div>

      {/* Vista: Nueva campaña */}
      {view === "nueva" && (
        <div className="rounded-2xl border border-mint/20 bg-card p-6 space-y-5">
          <div>
            <h2 className="text-white font-bold text-lg mb-1">Nueva campaña</h2>
            <p className="text-xs text-muted">El briefing lo usará la IA para personalizar cada email de esta campaña.</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-mint font-semibold uppercase tracking-widest block mb-2">Nombre *</label>
              <input
                value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                placeholder="Ej: Gestorías BCN — Junio 2025"
                className="w-full bg-base border border-line rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-mint/50"
              />
            </div>
            <div>
              <label className="text-xs text-mint font-semibold uppercase tracking-widest block mb-2">Sector objetivo</label>
              <select
                value={form.sector}
                onChange={(e) => setForm({ ...form, sector: e.target.value })}
                className="w-full bg-base border border-line rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-mint/50"
              >
                <option value="">Selecciona sector</option>
                {SECTORES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs text-mint font-semibold uppercase tracking-widest block mb-2">Dominio de envío</label>
            <input
              value={form.dominio}
              onChange={(e) => setForm({ ...form, dominio: e.target.value })}
              placeholder="hola@nexedigital.es"
              className="w-full bg-base border border-line rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-mint/50"
            />
          </div>

          <div>
            <label className="text-xs text-mint font-semibold uppercase tracking-widest block mb-2">Briefing para la IA</label>
            <textarea
              value={form.briefing}
              onChange={(e) => setForm({ ...form, briefing: e.target.value })}
              rows={8}
              placeholder={`Describe el objetivo y contexto. Por ejemplo:\n\n"Campaña para gestorías de Barcelona con 5-20 empleados. Objetivo: ofrecer formación en IA para ahorrar tiempo en tareas como nóminas y facturas. Tono cercano, sin tecnicismos. Mencionar que la formación es bonificable por FUNDAE."`}
              className="w-full bg-base border border-line rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-mint/50 resize-none leading-relaxed placeholder:text-muted/40"
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={crearCampana}
              disabled={creating || !form.nombre.trim()}
              className="bg-mint text-black font-bold text-sm px-6 py-2.5 rounded-xl hover:bg-mint/90 transition-colors disabled:opacity-40"
            >
              {creating ? "Creando..." : "Crear campaña"}
            </button>
            <button
              onClick={() => setView("list")}
              className="text-sm px-4 py-2.5 rounded-xl border border-line text-muted hover:text-white transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Vista: Lista + detalle */}
      {view === "list" && (
        <>
          {campanas.length === 0 ? (
            <div className="rounded-2xl border border-line bg-card p-16 text-center">
              <p className="text-3xl mb-4">◆</p>
              <p className="text-white font-semibold">Sin campañas aún</p>
              <p className="text-muted text-sm mt-2">Crea tu primera campaña con el botón de arriba.</p>
            </div>
          ) : (
            <div className="flex gap-4 min-h-[500px]">
              {/* Lista */}
              <div className="w-64 shrink-0 space-y-1">
                {campanas.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => selectCampana(c)}
                    className={`w-full text-left rounded-xl px-4 py-3 border transition-all ${
                      selected?.id === c.id
                        ? "bg-mint/10 border-mint/30 text-white"
                        : "bg-card border-line text-muted hover:text-white hover:border-white/20"
                    }`}
                  >
                    <p className="font-semibold text-sm truncate">{c.nombre}</p>
                    {c.estado && c.estado !== "—" && (
                      <span className={`mt-1 inline-block text-[10px] px-2 py-0.5 rounded-full border font-medium ${ESTADO_COLOR[c.estado] ?? "text-muted bg-white/5 border-white/10"}`}>
                        {c.estado}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* Detalle */}
              {selected && (
                <div className="flex-1 rounded-2xl border border-line bg-card p-6 space-y-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-white font-bold text-lg">{selected.nombre}</h2>
                      {selected.sector && selected.sector !== "—" && (
                        <p className="text-xs text-mint mt-0.5">{selected.sector}</p>
                      )}
                    </div>
                    {selected.estado && selected.estado !== "—" && (
                      <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${ESTADO_COLOR[selected.estado] ?? "text-muted bg-white/5 border-white/10"}`}>
                        {selected.estado}
                      </span>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs text-mint font-semibold uppercase tracking-widest">Briefing de la campaña</label>
                      <span className="text-xs text-muted/50">La IA lo usará para personalizar cada email</span>
                    </div>
                    <textarea
                      value={briefing}
                      onChange={(e) => { setBriefing(e.target.value); setSaved(false); }}
                      rows={10}
                      placeholder={`Describe el objetivo y contexto de esta campaña...`}
                      className="w-full bg-base border border-line rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-mint/50 resize-none leading-relaxed placeholder:text-muted/40"
                    />
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={guardarBriefing}
                      disabled={saving}
                      className="bg-mint text-black font-bold text-sm px-5 py-2.5 rounded-xl hover:bg-mint/90 transition-colors disabled:opacity-50"
                    >
                      {saving ? "Guardando..." : "Guardar briefing"}
                    </button>
                    {saved && (
                      <span className="text-xs text-mint flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-mint" />
                        Guardado
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
