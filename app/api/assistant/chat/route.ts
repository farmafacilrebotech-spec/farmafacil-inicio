export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { farmacia_id, cliente_id, mensaje } = body;

    if (!mensaje) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    let farmaciaName = "FarmaFácil";
    let farmaciaIdReal = null;
    
    // Solo buscar farmacia si NO es "general"
    if (farmacia_id && farmacia_id !== "general") {
      const { data: farmacia } = await supabase
        .from("farmacias")
        .select("id, nombre")
        .eq("id", farmacia_id)
        .single();
      
      if (farmacia) {
        farmaciaName = farmacia.nombre;
        farmaciaIdReal = farmacia.id;
      }
    }

    const systemPrompt = `Eres un asistente virtual profesional de ${farmaciaName}, una farmacia que utiliza FarmaFácil.
Tu tono es amable, cercano y profesional. Ayudas a los clientes con:
- Consultas sobre medicamentos y productos
- Información sobre disponibilidad y precios
- Recomendaciones generales de salud
- Guía sobre cómo usar la plataforma
- Información de contacto y horarios

Siempre recuerda que NO puedes:
- Diagnosticar enfermedades
- Prescribir medicamentos
- Reemplazar la consulta médica

Si la consulta es médica seria, recomienda consultar con un profesional de la salud.`;

    const openaiApiKey = process.env.OPENAI_API_KEY;

    if (!openaiApiKey) {
      const mockResponse = `Hola! Soy el asistente virtual de ${farmaciaName}. Por el momento estoy en modo de prueba. ¿En qué puedo ayudarte hoy?`;

      // Solo guardar si hay un farmacia_id válido
      if (farmaciaIdReal) {
        await supabase.from("conversaciones").insert({
          farmacia_id: farmaciaIdReal,
          cliente_id: cliente_id || null,
          mensaje_usuario: mensaje,
          respuesta_ia: mockResponse,
        });
      }

      return NextResponse.json({
        success: true,
        respuesta: mockResponse,
      });
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${openaiApiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: mensaje },
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      throw new Error("OpenAI API request failed");
    }

    const data = await response.json();
    const respuestaIA = data.choices[0]?.message?.content || "Lo siento, no pude procesar tu consulta.";

    // Solo guardar si hay un farmacia_id válido
    if (farmaciaIdReal) {
      await supabase.from("conversaciones").insert({
        farmacia_id: farmaciaIdReal,
        cliente_id: cliente_id || null,
        mensaje_usuario: mensaje,
        respuesta_ia: respuestaIA,
      });
    }

    return NextResponse.json({
      success: true,
      respuesta: respuestaIA,
    });
  } catch (error: any) {
    console.error("Error in chat assistant:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process message" },
      { status: 500 }
    );
  }
}
