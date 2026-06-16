export async function GET() {
  const key = process.env.AIRTABLE_API_KEY;
  const base = process.env.AIRTABLE_BASE_ID;
  
  if (!key || !base) {
    return Response.json({ error: "Variables no encontradas", key: !!key, base: !!base });
  }

  try {
    const res = await fetch(`https://api.airtable.com/v0/${base}/tblz0ahgP4iCzq1MC?maxRecords=1`, {
      headers: { Authorization: `Bearer ${key}` },
    });
    const data = await res.json();
    return Response.json({ status: res.status, ok: res.ok, records: data.records?.length ?? 0, error: data.error ?? null });
  } catch (e: any) {
    return Response.json({ error: e.message });
  }
}
