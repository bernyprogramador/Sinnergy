import { NextRequest, NextResponse } from "next/server";

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY!;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID!;
const CONTACTOS_TABLE = "tblAb0xCwJGxm7OQ8";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { contactoId, estado, fechaSeguimiento, noContactar } = body;

    const fields: Record<string, unknown> = {};
    if (estado) fields["Estado contacto"] = estado;
    if (fechaSeguimiento) fields["Fecha seguimiento"] = fechaSeguimiento;
    if (noContactar !== undefined) fields["No contactar"] = noContactar;

    const res = await fetch(
      `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${CONTACTOS_TABLE}/${contactoId}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${AIRTABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fields }),
      }
    );
    if (!res.ok) return NextResponse.json({ error: await res.text() }, { status: 500 });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
