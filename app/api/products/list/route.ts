import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const farmaciaId = searchParams.get("farmacia_id");
    const categoria = searchParams.get("categoria");
    const search = searchParams.get("search");

    let query = supabase
      .from("productos")
      .select("*, farmacias(nombre, telefono, whatsapp)")
      .order("created_at", { ascending: false });

    if (farmaciaId) {
      query = query.eq("farmacia_id", farmaciaId);
    }

    if (categoria && categoria !== "todas") {
      query = query.eq("categoria", categoria);
    }

    if (search) {
      query = query.or(
        `nombre.ilike.%${search}%,descripcion.ilike.%${search}%`
      );
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      productos: data || [],
    });
  } catch (error: any) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch products" },
      { status: 500 }
    );
  }
}
