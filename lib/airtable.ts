/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
// Capa de acceso a Airtable.
// La API REST de Airtable devuelve campos por NOMBRE en r.fields, no por field ID.

const BASE_ID = process.env.AIRTABLE_BASE_ID!;
const API_KEY = process.env.AIRTABLE_API_KEY!;
const BASE_URL = `https://api.airtable.com/v0/${BASE_ID}`;

// ── Tabla IDs ─────────────────────────────────────────────────────────────────
export const TABLES = {
  EMPRESAS: "tblz0ahgP4iCzq1MC",
  CONTACTOS: "tblAb0xCwJGxm7OQ8",
  CAMPANAS: "tblIbsF5dgcJBt2xj",
  COLA: "tblvdjqIIfmYHXGTh",
  INTERACCIONES: "tbl68vOyfrfqB8Uzy",
  OPORTUNIDADES: "tbl9mxaTtaOXEtJNw",
  METRICAS: "tblOWODHkYXCkHSTt",
};

// ── Tipos ─────────────────────────────────────────────────────────────────────
export type Empresa = {
  id: string;
  nombre: string;
  sector: string;
  estado: string;
  score: number;
  tamanyo: number;
  web: string;
  linkedin: string;
  notas: string;
};

export type Contacto = {
  id: string;
  nombre: string;
  cargo: string;
  decisor: string;
  email: string;
  estadoEmail: string;
  rebote: boolean;
  noContactar: boolean;
  estadoContacto: string;
  linkedin: string;
  empresa: string;
  empresaId: string;
  fechaEmailEnviado: string;
  asuntoEmail: string;
  notasSeguimiento: string;
  borradorEmail: string;
};

export type Campana = {
  id: string;
  nombre: string;
};

export type ColaMensaje = {
  id: string;
  empresa: string;
  contacto: string;
  asunto: string;
  cuerpo: string;
  estadoAprobacion: string;
  riesgo: string;
  campana: string;
};

export type Oportunidad = {
  id: string;
  empresa: string;
  contacto: string;
  estado: string;
  proximoPaso: string;
  reunionFecha: string;
};

// ── Helper: leer single select (puede ser string o {name}) ────────────────────
function sel(v: any): string {
  if (!v) return "—";
  if (typeof v === "string") return v;
  if (typeof v === "object" && v.name) return v.name;
  return "—";
}

// ── Helper: leer linked record (array de {id,name} o array de strings) ────────
function linked(v: any[]): { id: string; name: string } | null {
  if (!v || v.length === 0) return null;
  const first = v[0];
  if (typeof first === "string") return { id: first, name: "—" };
  return { id: first.id ?? first, name: first.name ?? "—" };
}

// ── Fetch helper ──────────────────────────────────────────────────────────────
async function fetchAirtable(tableId: string, params: Record<string, string> = {}) {
  const url = new URL(`${BASE_URL}/${tableId}`);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));

  const res = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${API_KEY}` },
    cache: "no-store",
  });

  if (!res.ok) throw new Error(`Airtable error ${res.status}: ${await res.text()}`);
  return res.json();
}

async function fetchAll(tableId: string, params: Record<string, string> = {}) {
  const records: any[] = [];
  let offset: string | undefined;

  do {
    const p = { ...params, ...(offset ? { offset } : {}) };
    const data = await fetchAirtable(tableId, p);
    records.push(...(data.records ?? []));
    offset = data.offset;
  } while (offset);

  return records;
}

// ── Queries ───────────────────────────────────────────────────────────────────

export async function getEmpresas(): Promise<Empresa[]> {
  const records = await fetchAll(TABLES.EMPRESAS, {
    "sort[0][field]": "Nombre",
    "sort[0][direction]": "asc",
  });

  return records.map((r: any) => {
    const f = r.fields ?? {};
    return {
      id: r.id,
      nombre: f["Nombre"] ?? "—",
      sector: sel(f["Sector"]),
      estado: sel(f["Estado"]),
      score: f["Score"] ?? 0,
      tamanyo: f["Tamaño"] ?? f["Tamano"] ?? f["Tamaño"] ?? 0,
      web: f["Web"] ?? "",
      linkedin: f["LinkedIn"] ?? f["Linkedin"] ?? "",
      notas: f["Notas"] ?? "",
    };
  });
}

export async function getContactos(): Promise<Contacto[]> {
  // Pedimos también la tabla EMPRESAS para resolver el linked record por ID
  const [records, empresas] = await Promise.all([
    fetchAll(TABLES.CONTACTOS),
    getEmpresas(),
  ]);
  const empresaMap = Object.fromEntries(empresas.map((e) => [e.id, e.nombre]));

  return records.map((r: any) => {
    const f = r.fields ?? {};
    // linked record viene como array de record IDs (strings) en la API REST
    const empresaIds: string[] = f["Empresa"] ?? [];
    const empresaId = empresaIds[0] ?? "";
    const empresaNombre = empresaMap[empresaId] ?? "—";
    return {
      id: r.id,
      nombre: f["Nombre"] ?? "—",
      cargo: f["Cargo"] ?? "—",
      decisor: sel(f["Decisor"]),
      email: f["Email"] ?? "—",
      estadoEmail: sel(f["Estado email"]),
      rebote: f["Rebote"] ?? false,
      noContactar: f["No contactar"] ?? false,
      estadoContacto: sel(f["Estado contacto"]),
      linkedin: f["LinkedIn"] ?? f["Linkedin"] ?? "",
      empresa: empresaNombre,
      empresaId,
      fechaEmailEnviado: f["Fecha email enviado"] ?? "",
      asuntoEmail: f["Asunto email"] ?? "",
      notasSeguimiento: f["Notas seguimiento"] ?? "",
      borradorEmail: f["Borrador email"] ?? "",
    };
  });
}

export async function getContactosConEmpresa(): Promise<Contacto[]> {
  return getContactos();
}

export async function getColaMensajes(): Promise<ColaMensaje[]> {
  const records = await fetchAll(TABLES.COLA);

  return records.map((r: any) => {
    const f = r.fields ?? {};
    return {
      id: r.id,
      empresa: f["Empresa"] ?? "—",
      contacto: f["Contacto"] ?? "—",
      asunto: f["Asunto"] ?? "(sin asunto)",
      cuerpo: f["Cuerpo"] ?? "",
      estadoAprobacion: sel(f["Estado aprobación"] ?? f["Estado aprobacion"]),
      riesgo: sel(f["Riesgo"]),
      campana: f["Campaña"] ?? f["Campana"] ?? "—",
    };
  });
}

export async function getCampanas(): Promise<Campana[]> {
  const records = await fetchAll(TABLES.CAMPANAS);
  return records.map((r: any) => ({
    id: r.id,
    nombre: r.fields?.["Nombre"] ?? "—",
  }));
}

export async function getOportunidades(): Promise<Oportunidad[]> {
  const records = await fetchAll(TABLES.OPORTUNIDADES);
  return records.map((r: any) => {
    const f = r.fields ?? {};
    return {
      id: r.id,
      empresa: f["Empresa"] ?? "—",
      contacto: f["Contacto"] ?? "—",
      estado: sel(f["Estado"]),
      proximoPaso: f["Próximo paso"] ?? f["Proximo paso"] ?? "—",
      reunionFecha: f["Fecha reunión"] ?? f["Fecha reunion"] ?? "",
    };
  });
}

// ── Resumen para el dashboard ─────────────────────────────────────────────────
export async function getResumen() {
  const [empresas, contactos] = await Promise.all([
    getEmpresas(),
    getContactos(),
  ]);

  return {
    totalEmpresas: empresas.length,
    totalContactos: contactos.length,
    leadsNuevos: empresas.filter((e) => e.estado === "Nueva").length,
    leadsValidados: empresas.filter((e) => e.estado === "Validada").length,
  };
}
