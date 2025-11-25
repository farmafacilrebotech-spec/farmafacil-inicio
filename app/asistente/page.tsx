"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/common/Navbar";
import ChatAssistant from "@/components/assistants/ChatAssistant";
import { supabase } from "@/lib/supabaseClient";

export default function AsistentePage() {
  const router = useRouter();
  const [farmaciaId, setFarmaciaId] = useState("");
  const [clienteId, setClienteId] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      router.push("/login");
      return;
    }

    const { data: farmacia } = await supabase
      .from("farmacias")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (farmacia) {
      setFarmaciaId(farmacia.id);
      setIsLoading(false);
      return;
    }

    const { data: cliente } = await supabase
      .from("clientes")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (cliente) {
      setClienteId(cliente.id);
      const { data: farmacias } = await supabase
        .from("farmacias")
        .select("id")
        .limit(1)
        .single();

      if (farmacias) {
        setFarmaciaId(farmacias.id);
      }
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#F7F9FA]">
      <Navbar />

      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-[#1A1A1A] mb-4">
              Asistente Virtual
            </h1>
            <p className="text-gray-600">
              Pregunta lo que necesites sobre productos, disponibilidad o
              consultas generales
            </p>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Cargando asistente...</p>
            </div>
          ) : farmaciaId ? (
            <ChatAssistant
              farmaciaId={farmaciaId}
              clienteId={clienteId || undefined}
            />
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">
                No se pudo cargar el asistente. Por favor, inicia sesión.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
