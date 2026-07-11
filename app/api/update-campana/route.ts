import { NextRequest, NextResponse } from "next/server";

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY!;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID!;
const CAMPANAS_TABLE = "tblIbsF5dgcJBt2xj";

export async function POST(req: NextRequest) {
  try {
    const { campanaId, briefing } = await req.json();
    const res = await fetch(
      `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${CAMPANAS_TABLE}/${campanaId}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${AIRTABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fields: { "Briefing campaña": briefing } }),
      }
    );
    if (!res.ok) return NextResponse.json({ error: await res.text() }, { status: 500 });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
