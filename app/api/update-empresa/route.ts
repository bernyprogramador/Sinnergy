import { NextRequest, NextResponse } from "next/server";

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY!;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID!;
const EMPRESAS_TABLE = "tblz0ahgP4iCzq1MC";

export async function POST(req: NextRequest) {
  try {
    const { empresaId, estado, eliminar } = await req.json();
    const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${EMPRESAS_TABLE}/${empresaId}`;
    const headers = {
      Authorization: `Bearer ${AIRTABLE_API_KEY}`,
      "Content-Type": "application/json",
    };

    if (eliminar) {
      const res = await fetch(url, { method: "DELETE", headers });
      if (!res.ok) return NextResponse.json({ error: await res.text() }, { status: 500 });
      return NextResponse.json({ ok: true, eliminada: true });
    }

    const fields: Record<string, unknown> = {};
    if (estado) fields["Estado"] = estado;

    const res = await fetch(url, {
      method: "PATCH",
      headers,
      body: JSON.stringify({ fields }),
    });
    if (!res.ok) return NextResponse.json({ error: await res.text() }, { status: 500 });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
