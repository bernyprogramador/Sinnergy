"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ContactosActions({ contactoId, estadoActual }: { contactoId: string; estadoActual: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function updateEstado(estado: string) {
    setLoading(true);
    await fetch("/api/update-contacto", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contactoId, estado }),
    });
    setLoading(false);
    router.refresh();
  }

  const esNoContactar = estadoActual === "No contactar";

  return (
    <div className="flex items-center gap-1 justify-end">
      {estadoActual === "Email enviado" && (
        <>
          <button
            onClick={() => updateEstado("Respondió")}
            disabled={loading}
            title="Marcar como Respondió"
            className="text-xs bg-mint/10 hover:bg-mint/20 text-mint px-2 py-1 rounded transition-colors disabled:opacity-50"
          >
            Respondió
          </button>
          <button
            onClick={() => updateEstado("Reunión acordada")}
            disabled={loading}
            title="Reunión acordada"
            className="text-xs bg-blue-400/10 hover:bg-blue-400/20 text-blue-400 px-2 py-1 rounded transition-colors disabled:opacity-50"
          >
            Reunión
          </button>
        </>
      )}
      {!esNoContactar && (
        <button
          onClick={() => updateEstado("No contactar")}
          disabled={loading}
          title="Marcar como No contactar"
          className="text-xs bg-danger/10 hover:bg-danger/20 text-danger px-2 py-1 rounded transition-colors disabled:opacity-50"
        >
          ✕
        </button>
      )}
      <a
        href={`/contactos/${contactoId}`}
        className="text-xs bg-mint/10 hover:bg-mint/20 text-mint px-2 py-1 rounded transition-colors border border-mint/20"
      >
        Ver →
      </a>
    </div>
  );
}
