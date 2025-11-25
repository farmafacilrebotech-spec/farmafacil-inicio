import { NextResponse } from "next/server";
import { google } from "googleapis";

export const dynamic = "force-dynamic";

const SCOPES = ["https://www.googleapis.com/auth/calendar.readonly"];

function getClient() {
  return new google.auth.JWT({
    email: process.env.GOOGLE_CLIENT_EMAIL,
    key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n") || "",
    scopes: SCOPES,
  });
}

const morningStart = 9;
const morningEnd = 14;
const afternoonStart = 16;
const afternoonEnd = 19;

function generateSlots(startHour: number, endHour: number) {
  const slots = [];
  for (let h = startHour; h < endHour; h++) {
    for (let m = 0; m < 60; m += 15) {
      slots.push({ hour: h, minute: m });
    }
  }
  return slots;
}

function isFree(slotStart: Date, busyEvents: any[]) {
  return busyEvents.every((ev) => {
    const evStart = new Date(ev.start.dateTime || ev.start.date);
    const evEnd = new Date(ev.end.dateTime || ev.end.date);
    return slotStart >= evEnd || slotStart < evStart;
  });
}

export async function POST(request: Request) {
  try {
    const { date, tipo } = await request.json();
    const auth = getClient();
    const calendar = google.calendar({ version: "v3", auth });

    const day = new Date(date);
    const timeMin = new Date(day.setHours(0, 0, 0, 0)).toISOString();
    const timeMax = new Date(day.setHours(23, 59, 59, 999)).toISOString();

    const events = await calendar.events.list({
      calendarId: process.env.GOOGLE_CALENDAR_ID,
      timeMin,
      timeMax,
      singleEvents: true,
      orderBy: "startTime",
    });

    const busy = events.data.items || [];

    const slots =
      tipo === "presencial"
        ? generateSlots(morningStart, morningEnd)
        : generateSlots(afternoonStart, afternoonEnd);

    const available: string[] = [];

    for (let i = 0; i < slots.length - 3; i++) {
      const s0 = new Date(date + "T" + slots[i].hour.toString().padStart(2, "0") + ":" + slots[i].minute.toString().padStart(2, "0") + ":00");
      const s1 = new Date(s0.getTime() + 15 * 60000);
      const s2 = new Date(s1.getTime() + 15 * 60000);
      const s3 = new Date(s2.getTime() + 15 * 60000);

      if (
        isFree(s0, busy) &&
        isFree(s1, busy) &&
        isFree(s2, busy) &&
        isFree(s3, busy)
      ) {
        available.push(
          s0.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })
        );
      }
    }

    return NextResponse.json({ success: true, slots: available });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
