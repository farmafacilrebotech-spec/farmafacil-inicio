export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, nombre, descripcion, categoria, stock, precio, imagen_url } =
      body;

    if (!id) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    const updateData: any = {};
    if (nombre !== undefined) updateData.nombre = nombre;
    if (descripcion !== undefined) updateData.descripcion = descripcion;
    if (categoria !== undefined) updateData.categoria = categoria;
    if (stock !== undefined) updateData.stock = parseInt(stock);
    if (precio !== undefined) updateData.precio = parseFloat(precio);
    if (imagen_url !== undefined) updateData.imagen_url = imagen_url;

    const { data, error } = await supabase
      .from("productos")
      .update(updateData)
      .eq("id", id)
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
    console.error("Error updating product:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update product" },
      { status: 500 }
    );
  }
}
