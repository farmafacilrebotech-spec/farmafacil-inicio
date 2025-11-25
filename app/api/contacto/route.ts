export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const data = await req.json();

    const webhookUrl = process.env.NEXT_PUBLIC_GOOGLE_SHEET_WEBHOOK_URL;
    if (!webhookUrl) {
      console.error("Falta NEXT_PUBLIC_GOOGLE_SHEET_WEBHOOK_URL en .env.local");
      return NextResponse.json(
        { success: false, error: "Config error: falta NEXT_PUBLIC_GOOGLE_SHEET_WEBHOOK_URL" },
        { status: 500 }
      );
    }

    const sheetResponse = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const rawText = await sheetResponse.text();

    if (!sheetResponse.ok) {
      console.error(
        "Apps Script devolvió error:",
        sheetResponse.status,
        rawText
      );
      return NextResponse.json(
        { success: false, error: "Apps Script error" },
        { status: 500 }
      );
    }

    // Intentamos parsear la respuesta del script (por si devuelves JSON)
    let result: any = {};
    try {
      result = JSON.parse(rawText);
    } catch {
      result = { raw: rawText };
    }

    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error("Error en /api/contacto:", error);
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 }
    );
  }
}
