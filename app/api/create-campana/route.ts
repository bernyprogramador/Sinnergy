import { NextRequest, NextResponse } from "next/server";

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY!;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID!;
const CAMPANAS_TABLE = "tblIbsF5dgcJBt2xj";

export async function POST(req: NextRequest) {
  try {
    const { nombre, sector, briefing, dominio } = await req.json();
    if (!nombre) return NextResponse.json({ error: "Nombre requerido" }, { status: 400 });

    const res = await fetch(
      `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${CAMPANAS_TABLE}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${AIRTABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fields: {
            "Nombre": nombre,
            "Sector objetivo": sector || undefined,
            "Briefing campaña": briefing || "",
            "Dominio de envío": dominio || "",
            "Estado campaña": "Borrador",
            "Fecha inicio": new Date().toISOString().split("T")[0],
          },
        }),
      }
    );
    if (!res.ok) return NextResponse.json({ error: await res.text() }, { status: 500 });
    const data = await res.json();
    return NextResponse.json({ ok: true, id: data.id });
  } catch {
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
