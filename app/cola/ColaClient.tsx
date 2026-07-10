"use client";

import { useState } from "react";
import type { Contacto } from "@/lib/airtable";

type Estado = "idle" | "enviando" | "ok" | "error" | "rechazando" | "seguimiento";

export default function ColaClient({ contactos }: { contactos: Contacto[] }) {
  const [items, setItems] = useState(
    contactos.map((c) => ({
      ...c,
      asunto: c.asuntoEmail || `Formación bonificada vía FUNDAE para ${c.empresa}`,
      borrador: c.borradorEmail || "",
      estado: "idle" as Estado,
      msg: "",
      fechaEnviado: c.fechaEmailEnviado || "",
    }))
  );

  async function aprobarYEnviar(idx: number) {
    const item = items[idx];
    if (!item.borrador || !item.asunto) {
      setItems((prev) => prev.map((it, i) => i === idx ? { ...it, msg: "Añade asunto y mensaje antes de enviar." } : it));
      return;
    }
    setItems((prev) => prev.map((it, i) => i === idx ? { ...it, estado: "enviando" } : it));
    try {
      const res = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contactoId: item.id, email: item.email, asunto: item.asunto, cuerpo: item.borrador }),
      });
      const data = await res.json();
      if (res.ok) {
        const fechaHoy = new Date().toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit", year: "2-digit" });
        setItems((prev) => prev.map((it, i) => i === idx ? { ...it, estado: "ok", msg: "✓ Email enviado", fechaEnviado: fechaHoy } : it));
      } else {
        setItems((prev) => prev.map((it, i) => i === idx ? { ...it, estado: "error", msg: data.error || "Error al enviar" } : it));
      }
    } catch {
      setItems((prev) => prev.map((it, i) => i === idx ? { ...it, estado: "error", msg: "Error de conexión" } : it));
    }
  }

  async function marcarEstado(idx: number, nuevoEstado: string) {
    const item = items[idx];
    await fetch("/api/update-contacto", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contactoId: item.id, estado: nuevoEstado }),
    });
    setItems((prev) => prev.filter((_, i) => i !== idx));
  }

  async function rechazar(idx: number) {
    const item = items[idx];
    setItems((prev) => prev.map((it, i) => i === idx ? { ...it, estado: "rechazando" } : it));
    try {
      await fetch("/api/update-contacto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contactoId: item.id, estado: "No contactado" }),
      });
      setItems((prev) => prev.filter((_, i) => i !== idx));
    } catch {
      setItems((prev) => prev.map((it, i) => i === idx ? { ...it, estado: "idle", msg: "Error al rechazar" } : it));
    }
  }

  async function programarSeguimiento(idx: number) {
    const item = items[idx];
    // Seguimiento en 7 días
    const fecha = new Date();
    fecha.setDate(fecha.getDate() + 7);
    const fechaISO = fecha.toISOString().split("T")[0];
    setItems((prev) => prev.map((it, i) => i === idx ? { ...it, estado: "seguimiento" } : it));
    await fetch("/api/update-contacto", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contactoId: item.id, fechaSeguimiento: fechaISO }),
    });
    setItems((prev) => prev.map((it, i) => i === idx ? { ...it, estado: "ok", msg: `📅 Seguimiento programado para ${fecha.toLocaleDateString("es-ES")}` } : it));
  }

  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-line bg-card p-16 text-center">
        <p className="text-4xl mb-4">✓</p>
        <p className="text-white font-semibold text-lg">Cola vacía</p>
        <p className="text-muted text-sm mt-2">No hay emails pendientes de aprobación.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {items.map((item, idx) => (
        <div
          key={item.id}
          className={`rounded-xl border bg-card p-5 space-y-4 transition-all ${
            item.estado === "ok" ? "border-mint/40" : "border-line"
          }`}
        >
          {/* Cabecera */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-white font-semibold">{item.nombre}</p>
              <p className="text-muted text-xs mt-0.5">{item.cargo} · {item.empresa}</p>
              <p className="text-mint text-xs font-mono mt-0.5">{item.email}</p>
              {item.fechaEnviado && (
                <p className="text-muted text-xs mt-0.5">📅 Enviado: {item.fechaEnviado}</p>
              )}
            </div>
            {item.estado === "ok" ? (
              <span className="text-xs bg-mint/15 text-mint px-3 py-1 rounded-full font-medium shrink-0">Enviado ✓</span>
            ) : (
              <span className="text-xs bg-yellow-400/15 text-yellow-300 px-3 py-1 rounded-full font-medium shrink-0">Pendiente</span>
            )}
          </div>

          {/* Después de enviar: opciones de seguimiento */}
          {item.estado === "ok" && (
            <div className="space-y-3 pt-1 border-t border-line">
              <p className="text-xs text-muted">{item.msg}</p>
              <p className="text-xs text-muted uppercase tracking-wider">¿Qué ha pasado?</p>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => marcarEstado(idx, "Respondió")}
                  className="text-xs bg-mint/10 hover:bg-mint/20 text-mint border border-mint/20 px-3 py-1.5 rounded-lg transition-colors font-medium"
                >
                  ✉ Respondió
                </button>
                <button
                  onClick={() => marcarEstado(idx, "Reunión acordada")}
                  className="text-xs bg-blue-400/10 hover:bg-blue-400/20 text-blue-400 border border-blue-400/20 px-3 py-1.5 rounded-lg transition-colors font-medium"
                >
                  📅 Reunión acordada
                </button>
                <button
                  onClick={() => programarSeguimiento(idx)}
                  disabled={item.estado === "seguimiento"}
                  className="text-xs bg-line hover:bg-line/80 text-muted border border-line px-3 py-1.5 rounded-lg transition-colors font-medium disabled:opacity-50"
                >
                  🔔 Recordatorio en 7 días
                </button>
                <button
                  onClick={() => marcarEstado(idx, "No contactar")}
                  className="text-xs bg-danger/10 hover:bg-danger/20 text-danger border border-danger/20 px-3 py-1.5 rounded-lg transition-colors font-medium"
                >
                  ✕ No contactar
                </button>
              </div>
            </div>
          )}

          {/* Editor (solo si no enviado) */}
          {item.estado !== "ok" && (
            <>
              <div>
                <label className="text-xs text-muted uppercase tracking-wider block mb-1.5">Asunto</label>
                <input
                  value={item.asunto}
                  onChange={(e) => setItems((prev) => prev.map((it, i) => i === idx ? { ...it, asunto: e.target.value } : it))}
                  className="w-full bg-base border border-line rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-mint/50"
                />
              </div>

              <div>
                <label className="text-xs text-muted uppercase tracking-wider block mb-1.5">
                  Mensaje
                  {!item.borrador && <span className="ml-2 text-yellow-400">· Borrador pendiente de IA</span>}
                </label>
                <textarea
                  value={item.borrador}
                  onChange={(e) => setItems((prev) => prev.map((it, i) => i === idx ? { ...it, borrador: e.target.value } : it))}
                  rows={8}
                  placeholder="El borrador generado por IA aparecerá aquí. También puedes escribirlo manualmente."
                  className="w-full bg-base border border-line rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-mint/50 resize-none font-mono leading-relaxed"
                />
              </div>

              {item.msg && (
                <p className={`text-xs ${item.estado === "error" ? "text-danger" : "text-muted"}`}>{item.msg}</p>
              )}

              <div className="flex gap-3 pt-1">
                <button
                  onClick={() => aprobarYEnviar(idx)}
                  disabled={item.estado === "enviando"}
                  className="bg-mint text-black font-semibold text-sm px-5 py-2 rounded-lg hover:bg-mintdark transition-colors disabled:opacity-50"
                >
                  {item.estado === "enviando" ? "Enviando..." : "Aprobar y enviar"}
                </button>
                <button
                  onClick={() => rechazar(idx)}
                  disabled={item.estado === "rechazando"}
                  className="text-sm px-4 py-2 rounded-lg border border-line text-muted hover:text-danger hover:border-danger/40 transition-colors"
                >
                  Rechazar
                </button>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
