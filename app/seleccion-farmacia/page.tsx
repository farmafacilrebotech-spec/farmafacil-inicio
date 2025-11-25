"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Building2, Loader2, ArrowRight } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { getClienteSession } from "@/lib/sessionManager";
import { clienteUrl } from "@/lib/urlBuilder";
import Image from "next/image";

interface Farmacia {
  id: string;
  codigo: string;
  nombre: string;
  direccion: string;
  telefono: string;
  logo_url: string;
  color_principal: string;
}

export default function SeleccionFarmaciaPage() {
  const router = useRouter();
  const [farmacias, setFarmacias] = useState<Farmacia[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Verificar que el cliente esté autenticado
    const session = getClienteSession();
    if (!session) {
      router.push("/login-cliente");
      return;
    }

    fetchFarmacias();
  }, [router]);

  const fetchFarmacias = async () => {
    try {
      const { data, error } = await supabase
        .from("farmacias")
        .select("id, codigo, nombre, direccion, telefono, logo_url, color_principal")
        .order("nombre", { ascending: true });

      if (error) throw error;

      setFarmacias(data || []);
    } catch (err: any) {
      console.error("Error al obtener farmacias:", err);
      setError("Error al cargar las farmacias");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectFarmacia = (codigo: string) => {
    // Redirigir a la aplicación externa de clientes usando urlBuilder
    const url = clienteUrl(codigo);
    window.location.href = url;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F7F9FA] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-[#1ABBB3] animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Cargando farmacias...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F9FA] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block mb-4">
            <div className="bg-gradient-to-br from-[#4ED3C2] to-[#1ABBB3] p-3 rounded-xl">
              <Building2 className="h-10 w-10 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-[#1A1A1A] mb-4">
            Selecciona tu Farmacia
          </h1>
          <p className="text-gray-600 text-lg">
            Elige la farmacia donde deseas realizar tu compra
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 max-w-2xl mx-auto">
            {error}
          </div>
        )}

        {/* Farmacias Grid */}
        {farmacias.length === 0 ? (
          <div className="text-center py-12">
            <Building2 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No hay farmacias disponibles</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {farmacias.map((farmacia) => (
              <Card
                key={farmacia.id}
                className="hover:shadow-xl transition-shadow cursor-pointer border-2 hover:border-[#1ABBB3]"
                onClick={() => handleSelectFarmacia(farmacia.codigo)}
              >
                <CardContent className="p-6">
                  {/* Logo */}
                  <div className="flex justify-center mb-4">
                    {farmacia.logo_url ? (
                      <div className="w-24 h-24 relative rounded-lg overflow-hidden bg-gray-100">
                        <Image
                          src={farmacia.logo_url}
                          alt={farmacia.nombre}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                    ) : (
                      <div
                        className="w-24 h-24 rounded-lg flex items-center justify-center"
                        style={{
                          backgroundColor: farmacia.color_principal || "#1ABBB3",
                        }}
                      >
                        <Building2 className="h-12 w-12 text-white" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-[#1A1A1A] mb-2">
                      {farmacia.nombre}
                    </h3>
                    {farmacia.direccion && (
                      <p className="text-sm text-gray-600 mb-1">
                        📍 {farmacia.direccion}
                      </p>
                    )}
                    {farmacia.telefono && (
                      <p className="text-sm text-gray-600 mb-4">
                        📞 {farmacia.telefono}
                      </p>
                    )}
                    
                    <div className="flex items-center justify-center text-[#1ABBB3] font-semibold">
                      <span>Ir al catálogo</span>
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

