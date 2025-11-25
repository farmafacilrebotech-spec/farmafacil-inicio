"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, User, ArrowRight } from "lucide-react";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-[#F7F9FA]">
      <Navbar />

      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-[#1A1A1A] mb-4">
              Acceso al Panel
            </h1>
            <p className="text-xl text-gray-600">
              Selecciona tu tipo de cuenta para continuar
            </p>
          </div>

          {/* Cards de Selección */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Card Farmacias */}
            <Link href="/login-farmacia">
              <Card className="cursor-pointer hover:shadow-2xl transition-all hover:scale-105 border-2 hover:border-[#1ABBB3] h-full">
                <CardHeader className="text-center pb-4">
                  <div className="flex justify-center mb-4">
                    <div className="bg-gradient-to-br from-[#4ED3C2] to-[#1ABBB3] p-6 rounded-2xl">
                      <Building2 className="h-16 w-16 text-white" />
                    </div>
                  </div>
                  <CardTitle className="text-3xl font-bold text-[#1A1A1A]">
                    Farmacias
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-600 mb-6 text-lg">
                    Accede al panel de gestión para administrar tu farmacia,
                    productos y pedidos.
                  </p>
                  <div className="flex items-center justify-center text-[#1ABBB3] font-semibold text-lg">
                    <span>Acceder como Farmacia</span>
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </div>
                </CardContent>
              </Card>
            </Link>

            {/* Card Clientes */}
            <Link href="/login-cliente">
              <Card className="cursor-pointer hover:shadow-2xl transition-all hover:scale-105 border-2 hover:border-[#1ABBB3] h-full">
                <CardHeader className="text-center pb-4">
                  <div className="flex justify-center mb-4">
                    <div className="bg-gradient-to-br from-[#4ED3C2] to-[#1ABBB3] p-6 rounded-2xl">
                      <User className="h-16 w-16 text-white" />
                    </div>
                  </div>
                  <CardTitle className="text-3xl font-bold text-[#1A1A1A]">
                    Clientes
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-600 mb-6 text-lg">
                    Accede a tu cuenta de cliente para realizar compras y
                    gestionar tus pedidos.
                  </p>
                  <div className="flex items-center justify-center text-[#1ABBB3] font-semibold text-lg">
                    <span>Acceder como Cliente</span>
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>

          {/* Info adicional */}
          <div className="mt-12 text-center">
            <p className="text-gray-600">
              ¿No tienes cuenta?{" "}
              <Link
                href="/register"
                className="text-[#1ABBB3] hover:underline font-semibold"
              >
                Regístrate aquí
              </Link>
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
