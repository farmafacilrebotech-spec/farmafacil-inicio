import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

// Datos mock para desarrollo (cuando Supabase no está configurado)
const PRODUCTOS_MOCK = [
  {
    id: "prod_1",
    nombre: "Ibuprofeno 400mg",
    descripcion: "Analgésico y antiinflamatorio. Caja de 20 comprimidos.",
    precio: 5.99,
    stock: 50,
    categoria: "Analgésicos",
    imagen_url: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400",
    farmacia_id: "farm_1",
    farmacia_nombre: "Farmacia San Miguel",
  },
  {
    id: "prod_2",
    nombre: "Paracetamol 1g",
    descripcion: "Antipirético y analgésico. Caja de 40 comprimidos.",
    precio: 4.50,
    stock: 100,
    categoria: "Analgésicos",
    imagen_url: "https://images.unsplash.com/photo-1550572017-edd951b55104?w=400",
    farmacia_id: "farm_1",
    farmacia_nombre: "Farmacia San Miguel",
  },
  {
    id: "prod_3",
    nombre: "Vitamina C 1000mg",
    descripcion: "Suplemento vitamínico. 30 comprimidos efervescentes.",
    precio: 12.50,
    stock: 30,
    categoria: "Vitaminas",
    imagen_url: "https://images.unsplash.com/photo-1577401239170-897942555fb3?w=400",
    farmacia_id: "farm_2",
    farmacia_nombre: "Farmacia Central",
  },
  {
    id: "prod_4",
    nombre: "Omega 3",
    descripcion: "Aceite de pescado. 60 cápsulas blandas.",
    precio: 18.99,
    stock: 25,
    categoria: "Suplementos",
    imagen_url: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400",
    farmacia_id: "farm_2",
    farmacia_nombre: "Farmacia Central",
  },
  {
    id: "prod_5",
    nombre: "Crema Hidratante Facial",
    descripcion: "Hidratación intensiva 24h. 50ml.",
    precio: 15.99,
    stock: 40,
    categoria: "Cuidado personal",
    imagen_url: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400",
    farmacia_id: "farm_1",
    farmacia_nombre: "Farmacia San Miguel",
  },
  {
    id: "prod_6",
    nombre: "Tiritas Surtidas",
    descripcion: "Pack de 40 tiritas de diferentes tamaños.",
    precio: 3.99,
    stock: 80,
    categoria: "Primeros auxilios",
    imagen_url: "https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=400",
    farmacia_id: "farm_3",
    farmacia_nombre: "Farmacia Salud Plus",
  },
  {
    id: "prod_7",
    nombre: "Alcohol 96°",
    descripcion: "Antiséptico. Botella de 250ml.",
    precio: 2.99,
    stock: 60,
    categoria: "Primeros auxilios",
    imagen_url: "https://images.unsplash.com/photo-1584483766114-2cea6facdf57?w=400",
    farmacia_id: "farm_3",
    farmacia_nombre: "Farmacia Salud Plus",
  },
  {
    id: "prod_8",
    nombre: "Multivitamínico",
    descripcion: "Complejo vitamínico completo. 90 comprimidos.",
    precio: 22.00,
    stock: 35,
    categoria: "Vitaminas",
    imagen_url: "https://images.unsplash.com/photo-1550572017-4a8d85f10426?w=400",
    farmacia_id: "farm_1",
    farmacia_nombre: "Farmacia San Miguel",
  },
];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const farmaciaId = searchParams.get("farmacia_id");
    const categoria = searchParams.get("categoria");
    const search = searchParams.get("search");

    // Intentar obtener de Supabase primero
    let productos = [];
    let useMock = false;

    try {
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
        console.warn("Supabase error, usando datos mock:", error.message);
        useMock = true;
      } else {
        productos = data || [];
        // Si no hay datos en Supabase, usar mock
        if (productos.length === 0) {
          useMock = true;
        }
      }
    } catch (e) {
      console.warn("Error conectando a Supabase, usando datos mock");
      useMock = true;
    }

    // Usar datos mock si es necesario
    if (useMock) {
      productos = [...PRODUCTOS_MOCK];

      // Aplicar filtros a los datos mock
      if (farmaciaId) {
        productos = productos.filter((p) => p.farmacia_id === farmaciaId);
      }

      if (categoria && categoria !== "todas") {
        productos = productos.filter((p) => p.categoria === categoria);
      }

      if (search) {
        const searchLower = search.toLowerCase();
        productos = productos.filter(
          (p) =>
            p.nombre.toLowerCase().includes(searchLower) ||
            p.descripcion?.toLowerCase().includes(searchLower)
        );
      }
    }

    return NextResponse.json({
      success: true,
      productos,
    });
  } catch (error: any) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch products" },
      { status: 500 }
    );
  }
}
