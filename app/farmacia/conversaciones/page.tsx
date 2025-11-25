"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, User, Calendar } from "lucide-react";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import { supabase } from "@/lib/supabaseClient";

export default function FarmaciaConversacionesPage() {
  const router = useRouter();
  const [farmaciaId, setFarmaciaId] = useState("");
  const [conversaciones, setConversaciones] = useState<any[]>([]);
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

    if (!farmacia) {
      router.push("/catalogo");
      return;
    }

    setFarmaciaId(farmacia.id);
    await fetchConversaciones(farmacia.id);
    setIsLoading(false);
  };

  const fetchConversaciones = async (fId: string) => {
    const { data } = await supabase
      .from("conversaciones")
      .select(`
        *,
        clientes(nombre, email)
      `)
      .eq("farmacia_id", fId)
      .order("created_at", { ascending: false })
      .limit(100);

    setConversaciones(data || []);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F7F9FA] flex items-center justify-center">
        <p className="text-gray-500">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F9FA]">
      <Navbar />

      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-[#1A1A1A] mb-2">
              Conversaciones del Asistente
            </h1>
            <p className="text-gray-600">
              Historial de interacciones con clientes
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>
                Historial ({conversaciones.length} conversaciones)
              </CardTitle>
            </CardHeader>
            <CardContent>
              {conversaciones.length === 0 ? (
                <div className="text-center py-12">
                  <MessageSquare className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">
                    No hay conversaciones aún
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {conversaciones.map((conv) => (
                    <div
                      key={conv.id}
                      className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <User className="h-5 w-5 text-gray-400" />
                          <span className="font-semibold">
                            {conv.cliente_id
                              ? conv.clientes?.nombre || "Cliente"
                              : "Usuario Anónimo"}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <Calendar className="h-4 w-4" />
                          {new Date(conv.created_at).toLocaleString()}
                        </div>
                      </div>

                      {/* Mensaje del usuario */}
                      <div className="mb-3">
                        <div className="bg-blue-50 p-3 rounded-lg">
                          <p className="text-sm font-semibold text-blue-900 mb-1">
                            Usuario:
                          </p>
                          <p className="text-gray-700">{conv.mensaje_usuario}</p>
                        </div>
                      </div>

                      {/* Respuesta de la IA */}
                      <div>
                        <div className="bg-green-50 p-3 rounded-lg">
                          <p className="text-sm font-semibold text-green-900 mb-1">
                            Asistente IA:
                          </p>
                          <p className="text-gray-700">{conv.respuesta_ia}</p>
                        </div>
                      </div>

                      {conv.clientes?.email && (
                        <div className="mt-2 text-sm text-gray-500">
                          📧 {conv.clientes.email}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
}

