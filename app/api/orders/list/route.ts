import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const clienteId = searchParams.get("cliente_id");
    const farmaciaId = searchParams.get("farmacia_id");

    let query = supabase
      .from("pedidos")
      .select(
        `
        *,
        clientes(nombre, email, telefono),
        farmacias(nombre, telefono, whatsapp),
        detalles_pedido(
          *,
          productos(nombre, precio, imagen_url)
        )
      `
      )
      .order("created_at", { ascending: false });

    if (clienteId) {
      query = query.eq("cliente_id", clienteId);
    }

    if (farmaciaId) {
      query = query.eq("farmacia_id", farmaciaId);
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      pedidos: data || [],
    });
  } catch (error: any) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch orders" },
      { status: 500 }
    );
  }
}
