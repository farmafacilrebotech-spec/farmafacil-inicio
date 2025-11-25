import { NextResponse } from "next/server";
import { google } from "googleapis";

export const dynamic = "force-dynamic";

const SCOPES = [
  "https://www.googleapis.com/auth/calendar",
  "https://www.googleapis.com/auth/spreadsheets"
];

function getAuth() {
  return new google.auth.JWT({
    email: process.env.GOOGLE_CLIENT_EMAIL,
    key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n") || "",
    scopes: SCOPES,
  });
}

export async function POST(req: Request) {
  try {
    const { fecha, hora, nombre, email, telefono, tipo, direccion } =
      await req.json();

    const auth = getAuth();
    const calendar = google.calendar({ version: "v3", auth });
    const sheets = google.sheets({ version: "v4", auth });

    const start = new Date(`${fecha} ${hora}`);
    const reunionEnd = new Date(start.getTime() + 30 * 60000);
    const trasladoEnd = new Date(start.getTime() + 60 * 60000);

    // Evento 1
    const eventoReunion = await calendar.events.insert({
      calendarId: process.env.GOOGLE_CALENDAR_ID,
      requestBody: {
        summary: `Reunión de prueba con FarmaFácil`,
        description: `Nombre: ${nombre}\nEmail: ${email}\nTeléfono: ${telefono}\nModo: ${tipo}`,
        start: { dateTime: start.toISOString() },
        end: { dateTime: reunionEnd.toISOString() },
        location: tipo === "presencial" ? direccion : undefined,
      },
    });

    // Evento 2 (traslado)
    const eventoTraslado = await calendar.events.insert({
      calendarId: process.env.GOOGLE_CALENDAR_ID,
      requestBody: {
        summary: `Traslado`,
        start: { dateTime: reunionEnd.toISOString() },
        end: { dateTime: trasladoEnd.toISOString() },
      },
    });

    // Registro en Google Sheets
    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GSHEET_GENERAL_ID,
      range: "Citas!A1",
      valueInputOption: "RAW",
      requestBody: {
        values: [
          [
            new Date().toLocaleString("es-ES"),
            fecha,
            hora,
            nombre,
            email,
            telefono,
            tipo,
            direccion,
            eventoReunion.data.id,
            eventoTraslado.data.id,
          ],
        ],
      },
    });

    return NextResponse.json({
      success: true,
      message: "Cita reservada correctamente",
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
