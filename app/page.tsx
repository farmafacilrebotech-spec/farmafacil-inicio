import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Zap,
  Clock,
  Sparkles,
  CheckCircle2,
  MessageSquare,
  Package,
  ArrowRight,
  Star,
} from "lucide-react";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#F7F9FA]">
      <Navbar />

      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-block mb-4">
            <span className="bg-[#4ED3C2] bg-opacity-20 text-[#1ABBB3] px-4 py-2 rounded-full text-sm font-semibold">
              Innovación en Farmacia Digital
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-[#1A1A1A] mb-6 leading-tight">
            La forma más fácil de
            <br />
            <span className="text-[#1ABBB3]">digitalizar tu farmacia</span>
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
            Catálogo conectado, pedidos online y atención automática con IA.
            Todo lo que necesitas para modernizar tu farmacia.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button className="bg-[#1ABBB3] hover:bg-[#4ED3C2] text-white px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all">
                Probar FarmaFácil
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/catalogo">
              <Button
                variant="outline"
                className="border-2 border-[#1ABBB3] text-[#1ABBB3] hover:bg-[#1ABBB3] hover:text-white px-8 py-6 text-lg rounded-full transition-all"
              >
                Ver Catálogo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#1A1A1A] mb-4">
              ¿Cómo funciona?
            </h2>
            <p className="text-gray-600 text-lg">
              Tres pasos para transformar tu farmacia
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="bg-[#4ED3C2] bg-opacity-10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Package className="h-8 w-8 text-[#1ABBB3]" />
                </div>
                <h3 className="text-2xl font-bold text-[#1A1A1A] mb-4">
                  1. Carga tu catálogo
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Sube tus productos con precios, stock e imágenes. Simple y
                  rápido desde el panel de control.
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="bg-[#4ED3C2] bg-opacity-10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <MessageSquare className="h-8 w-8 text-[#1ABBB3]" />
                </div>
                <h3 className="text-2xl font-bold text-[#1A1A1A] mb-4">
                  2. Activa el asistente IA
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Tu asistente virtual atiende a clientes 24/7, responde dudas
                  y ayuda con pedidos automáticamente.
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="bg-[#4ED3C2] bg-opacity-10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Sparkles className="h-8 w-8 text-[#1ABBB3]" />
                </div>
                <h3 className="text-2xl font-bold text-[#1A1A1A] mb-4">
                  3. Gestiona pedidos
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Recibe y gestiona pedidos online desde un panel intuitivo.
                  Todo organizado y automatizado.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#4ED3C2] to-[#1ABBB3]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Ventajas de FarmaFácil
            </h2>
            <p className="text-white text-opacity-90 text-lg">
              Todo lo que necesitas en una sola plataforma
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-white bg-opacity-20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Zap className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">
                Rápido y fácil
              </h3>
              <p className="text-white text-opacity-90 leading-relaxed">
                Configura tu farmacia digital en minutos. Sin complicaciones
                técnicas.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-white bg-opacity-20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Clock className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">
                Atención 24/7
              </h3>
              <p className="text-white text-opacity-90 leading-relaxed">
                El asistente IA responde a tus clientes en cualquier momento del
                día.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-white bg-opacity-20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">
                Sin complicaciones
              </h3>
              <p className="text-white text-opacity-90 leading-relaxed">
                Todo está diseñado para ser intuitivo y fácil de usar desde el
                primer día.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#1A1A1A] mb-4">
              Lo que dicen nuestras farmacias
            </h2>
            <p className="text-gray-600 text-lg">
              Testimonios reales de farmacias que ya confían en FarmaFácil
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-none shadow-lg">
              <CardContent className="p-8">
                <div className="flex mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className="h-5 w-5 fill-[#4ED3C2] text-[#4ED3C2]"
                    />
                  ))}
                </div>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  FarmaFácil nos ha permitido digitalizar nuestro negocio sin
                  complicaciones. El asistente IA ha mejorado enormemente la
                  atención al cliente.
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-[#4ED3C2] rounded-full flex items-center justify-center text-white font-bold mr-4">
                    MG
                  </div>
                  <div>
                    <p className="font-semibold text-[#1A1A1A]">
                      María González
                    </p>
                    <p className="text-sm text-gray-500">
                      Farmacia San Miguel
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg">
              <CardContent className="p-8">
                <div className="flex mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className="h-5 w-5 fill-[#4ED3C2] text-[#4ED3C2]"
                    />
                  ))}
                </div>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Una herramienta imprescindible. Hemos aumentado nuestras
                  ventas online y la gestión del catálogo es muy intuitiva.
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-[#4ED3C2] rounded-full flex items-center justify-center text-white font-bold mr-4">
                    JR
                  </div>
                  <div>
                    <p className="font-semibold text-[#1A1A1A]">
                      Javier Ruiz
                    </p>
                    <p className="text-sm text-gray-500">Farmacia Central</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#1A1A1A] text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">
            ¿Listo para digitalizar tu farmacia?
          </h2>
          <p className="text-xl text-gray-300 mb-10 leading-relaxed">
            Únete a las farmacias que ya están modernizando su negocio con
            FarmaFácil
          </p>
          <Link href="/register">
            <Button className="bg-[#4ED3C2] hover:bg-[#1ABBB3] text-white px-10 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all">
              Comenzar ahora
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
