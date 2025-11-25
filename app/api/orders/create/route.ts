export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { cliente_id, farmacia_id, items } = body;

    if (!cliente_id || !farmacia_id || !items || items.length === 0) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    let total = 0;
    for (const item of items) {
      total += parseFloat(item.precio) * parseInt(item.cantidad);
    }

    const { data: pedido, error: pedidoError } = await supabase
      .from("pedidos")
      .insert({
        cliente_id,
        farmacia_id,
        total,
        estado: "Pendiente",
      })
      .select()
      .single();

    if (pedidoError || !pedido) {
      throw pedidoError || new Error("Failed to create order");
    }

    const detalles = items.map((item: any) => ({
      pedido_id: pedido.id,
      producto_id: item.producto_id,
      cantidad: parseInt(item.cantidad),
      subtotal: parseFloat(item.precio) * parseInt(item.cantidad),
    }));

    const { error: detallesError } = await supabase
      .from("detalles_pedido")
      .insert(detalles);

    if (detallesError) {
      throw detallesError;
    }

    for (const item of items) {
      const { data: producto } = await supabase
        .from("productos")
        .select("stock")
        .eq("id", item.producto_id)
        .single();

      if (producto) {
        await supabase
          .from("productos")
          .update({ stock: producto.stock - parseInt(item.cantidad) })
          .eq("id", item.producto_id);
      }
    }

    return NextResponse.json({
      success: true,
      pedido,
    });
  } catch (error: any) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create order" },
      { status: 500 }
    );
  }
}
