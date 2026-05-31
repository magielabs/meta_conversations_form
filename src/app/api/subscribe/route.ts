import { NextResponse } from "next/server";
import { subscriptionSchema } from "@/lib/schema";
import { formatPhone } from "@/lib/phone";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Corpo da requisição inválido." },
      { status: 400 },
    );
  }

  const parsed = subscriptionSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        error: "Dados inválidos.",
        issues: parsed.error.flatten().fieldErrors,
      },
      { status: 422 },
    );
  }

  const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
  if (!webhookUrl) {
    console.error("GOOGLE_SHEETS_WEBHOOK_URL não configurada.");
    return NextResponse.json(
      { ok: false, error: "Integração indisponível no momento." },
      { status: 500 },
    );
  }

  const record = {
    nome: parsed.data.nome,
    telefone: formatPhone(parsed.data.telefone),
    empresa: parsed.data.empresa,
    email: parsed.data.email,
    submittedAt: new Date().toISOString(),
  };

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(record),
      // Apps Script Web Apps respondem com redirect 302 para googleusercontent;
      // o fetch segue o redirect automaticamente.
    });

    if (!response.ok) {
      const text = await response.text().catch(() => "");
      console.error("Falha ao gravar no Sheets:", response.status, text);
      return NextResponse.json(
        { ok: false, error: "Não foi possível registrar sua inscrição." },
        { status: 502 },
      );
    }
  } catch (error) {
    console.error("Erro ao chamar o webhook do Sheets:", error);
    return NextResponse.json(
      { ok: false, error: "Não foi possível registrar sua inscrição." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
