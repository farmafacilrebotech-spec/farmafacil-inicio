export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      farmacia_id,
      nombre,
      descripcion,
      categoria,
      stock,
      precio,
      imagen_url,
    } = body;

    if (!farmacia_id || !nombre || !categoria || stock === undefined || !precio) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("productos")
      .insert({
        farmacia_id,
        nombre,
        descripcion: descripcion || "",
        categoria,
        stock: parseInt(stock),
        precio: parseFloat(precio),
        imagen_url: imagen_url || "https://images.pexels.com/photos/3683041/pexels-photo-3683041.jpeg",
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      producto: data,
    });
  } catch (error: any) {
    console.error("Error adding product:", error);
    return NextResponse.json(
      { error: error.message || "Failed to add product" },
      { status: 500 }
    );
  }
}
