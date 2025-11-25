export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const data = await req.json();

    const webhookUrl = process.env.GOOGLE_SHEET_WEBHOOK_URL;
    if (!webhookUrl) {
      console.error("Falta GOOGLE_SHEET_WEBHOOK_URL en el .env");
      return NextResponse.json(
        { success: false, error: "Config error" },
        { status: 500 }
      );
    }

    const sheetResponse = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!sheetResponse.ok) {
      const text = await sheetResponse.text();
      console.error("Apps Script respondió con error:", text);
      return NextResponse.json(
        { success: false, error: "Apps Script error" },
        { status: 500 }
      );
    }

    // No parseamos nada, sólo confirmamos que ha ido bien
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error enviando mensaje:", error);
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 }
    );
  }
}
