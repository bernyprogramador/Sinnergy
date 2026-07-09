import { NextRequest, NextResponse } from "next/server";

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY!;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID!;
const CONTACTOS_TABLE = "tblAb0xCwJGxm7OQ8";

// n8n webhook URL (configurar en variables de entorno)
// Crea un webhook en n8n que reciba POST y lo envíe por Gmail
const N8N_WEBHOOK_URL = process.env.N8N_EMAIL_WEBHOOK_URL || "";

export async function POST(req: NextRequest) {
  try {
    const { contactoId, email, asunto, cuerpo } = await req.json();

    if (!contactoId || !email || !asunto || !cuerpo) {
      return NextResponse.json({ error: "Faltan campos obligatorios." }, { status: 400 });
    }

    // 1. Enviar email via n8n webhook (que tiene Gmail conectado)
    if (!N8N_WEBHOOK_URL) {
      return NextResponse.json(
        { error: "N8N_EMAIL_WEBHOOK_URL no configurada. Añade la variable de entorno." },
        { status: 500 }
      );
    }

    const n8nRes = await fetch(N8N_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ to: email, subject: asunto, body: cuerpo }),
    });

    if (!n8nRes.ok) {
      const txt = await n8nRes.text();
      return NextResponse.json({ error: `Error enviando email: ${txt}` }, { status: 500 });
    }

    // 2. Actualizar Airtable: estado, fecha enviado, asunto, cuerpo
    const hoy = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

    const patchRes = await fetch(
      `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${CONTACTOS_TABLE}/${contactoId}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${AIRTABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fields: {
            "Estado contacto": "Email enviado",
            "Fecha email enviado": hoy,
            "Asunto email": asunto,
            "Borrador email": cuerpo,
          },
        }),
      }
    );

    if (!patchRes.ok) {
      const txt = await patchRes.text();
      console.error("Airtable patch error:", txt);
      // Email enviado pero no se pudo registrar → avisamos pero no fallamos
      return NextResponse.json({ ok: true, warning: "Email enviado pero error al actualizar Airtable." });
    }

    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    console.error("send-email error:", err);
    return NextResponse.json({ error: "Error interno del servidor." }, { status: 500 });
  }
}
