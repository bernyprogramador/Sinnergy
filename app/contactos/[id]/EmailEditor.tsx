"use client";

import { useState } from "react";
import type { Contacto } from "@/lib/airtable";

export default function EmailEditor({ contacto }: { contacto: Contacto }) {
  const [asunto, setAsunto] = useState(contacto.asuntoEmail || "");
  const [cuerpo, setCuerpo] = useState(contacto.borradorEmail || "");
  const [enviando, setEnviando] = useState(false);
  const [estado, setEstado] = useState<"idle" | "ok" | "error">("idle");
  const [msg, setMsg] = useState("");

  async function handleEnviar() {
    if (!asunto || !cuerpo) { setMsg("Añade asunto y cuerpo del email."); return; }
    setEnviando(true);
    setEstado("idle");
    try {
      const res = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contactoId: contacto.id, email: contacto.email, asunto, cuerpo }),
      });
      const data = await res.json();
      if (res.ok) {
        setEstado("ok");
        setMsg("Email enviado correctamente.");
      } else {
        setEstado("error");
        setMsg(data.error || "Error al enviar.");
      }
    } catch (e) {
      setEstado("error");
      setMsg("Error de conexión.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="rounded-xl border border-line bg-card p-6 space-y-4">
      <p className="text-xs text-mint font-semibold tracking-widest uppercase">Redactar email</p>

      {/* Asunto */}
      <div>
        <label className="text-xs text-muted uppercase tracking-wider block mb-2">Asunto</label>
        <input
          value={asunto}
          onChange={(e) => setAsunto(e.target.value)}
          placeholder="Asunto del email..."
          className="w-full bg-base border border-line rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-mint/50 transition-colors"
        />
      </div>

      {/* Cuerpo */}
      <div>
        <label className="text-xs text-muted uppercase tracking-wider block mb-2">Mensaje</label>
        <textarea
          value={cuerpo}
          onChange={(e) => setCuerpo(e.target.value)}
          rows={12}
          placeholder="Redacta el email aquí o espera el borrador generado por IA..."
          className="w-full bg-base border border-line rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-mint/50 transition-colors resize-none font-mono leading-relaxed"
        />
      </div>

      {/* Feedback */}
      {msg && (
        <p className={`text-sm ${estado === "ok" ? "text-mint" : "text-danger"}`}>{msg}</p>
      )}

      {/* Botón enviar */}
      <div className="flex items-center gap-3 pt-2">
        <button
          onClick={handleEnviar}
          disabled={enviando}
          className="bg-mint text-black font-semibold text-sm px-6 py-2.5 rounded-lg hover:bg-mintdark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {enviando ? "Enviando..." : "Enviar email"}
        </button>
        <p className="text-xs text-muted">Se enviará desde el email de Alba · Nexe</p>
      </div>
    </div>
  );
}
