"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Phone, MapPin, MessageCircle, CalendarDays } from "lucide-react";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import { useToast } from "@/hooks/use-toast";

export default function ContactoPage() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    tipoUsuario: "",
    mensaje: "",
    aceptarRGPD: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!formData.aceptarRGPD) {
      toast({
        title: "Debes aceptar la política de datos",
        description: "Por favor, marca la casilla antes de enviar.",
        variant: "destructive",
      });
      return;
    }
  
    try {
      const payload = {
        nombre: formData.nombre,
        email: formData.email,
        telefono: formData.telefono || "",
        tipoUsuario: formData.tipoUsuario || "",
        mensaje: formData.mensaje,
      };
  
      const response = await fetch("/api/contacto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
  
      const data = await response.json();
  
      if (!response.ok || !data.success) {
        throw new Error(data.error || "Error desconocido");
      }
  
      toast({
        title: "Mensaje enviado",
        description: "Nos pondremos en contacto contigo pronto.",
      });
  
      // Reseteo limpio
      setFormData({
        nombre: "",
        email: "",
        telefono: "",
        tipoUsuario: "",
        mensaje: "",
        aceptarRGPD: false,
      });
  
    } catch (error: any) {
      console.error("Error al enviar:", error);
  
      toast({
        title: "Error al enviar",
        description: "Intenta de nuevo más tarde.",
        variant: "destructive",
      });
    }
  };
  

  return (
    <div className="min-h-screen bg-[#F7F9FA]">
      <Navbar />

      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Cabecera */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-[#1A1A1A] mb-4">Contáctanos</h1>
            <p className="text-gray-600 text-lg">
              Estamos aquí para ayudarte. Escríbenos o reserva una cita si eres farmacia.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Formulario */}
            <Card>
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-[#1A1A1A] mb-6">
                  Envíanos un mensaje
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Nombre
                    </label>
                    <Input
                      placeholder="Tu nombre"
                      value={formData.nombre}
                      onChange={(e) =>
                        setFormData({ ...formData, nombre: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Email
                    </label>
                    <Input
                      type="email"
                      placeholder="tu@email.com"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Teléfono
                    </label>
                    <Input
                      type="tel"
                      placeholder="+34 600 000 000"
                      value={formData.telefono}
                      onChange={(e) =>
                        setFormData({ ...formData, telefono: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Soy...
                    </label>
                    <select
                      value={formData.tipoUsuario}
                      onChange={(e) =>
                        setFormData({ ...formData, tipoUsuario: e.target.value })
                      }
                      required
                      className="w-full border border-gray-300 rounded-lg p-2"
                    >
                      <option value="">Selecciona una opción</option>
                      <option value="farmacia">Una farmacia</option>
                      <option value="cliente">Un cliente</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Mensaje
                    </label>
                    <Textarea
                      placeholder="¿En qué podemos ayudarte?"
                      rows={5}
                      value={formData.mensaje}
                      onChange={(e) =>
                        setFormData({ ...formData, mensaje: e.target.value })
                      }
                      required
                    />
                  </div>

                  {/* RGPD */}
                  <div className="flex items-start space-x-2 mt-4">
                    <input
                      type="checkbox"
                      checked={formData.aceptarRGPD}
                      onChange={(e) =>
                        setFormData({ ...formData, aceptarRGPD: e.target.checked })
                      }
                      className="mt-1"
                      required
                    />
                    <label className="text-sm text-gray-600">
                      He leído y acepto la{" "}
                      <a
                        href="/politica-privacidad"
                        className="text-[#1ABBB3] hover:underline"
                        target="_blank"
                      >
                        política de protección de datos
                      </a>.
                    </label>
                  </div>

                  <p className="text-xs text-gray-500">
                    Tus datos serán tratados por <b>ReboTech Solutions </b> con la finalidad
                    de gestionar tu solicitud e informarte sobre productos o futuros programas de
                    aceleración. Puedes ejercer tus derechos escribiendo a{" "}
                    <a
                      href="mailto:rgpd@rebotech.solutions"
                      className="text-[#1ABBB3] hover:underline"
                    >
                      rgpd@rebotech.solutions
                    </a>.
                  </p>

                  <Button
                    type="submit"
                    className="w-full bg-[#1ABBB3] hover:bg-[#4ED3C2] text-white mt-4"
                  >
                    Enviar mensaje
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Información lateral */}
            <div className="space-y-6">
              <Card>
                <CardContent className="p-8 space-y-4">
                  <div className="flex items-start space-x-4">
                    <div className="bg-[#4ED3C2] bg-opacity-10 p-3 rounded-lg">
                      <Mail className="h-6 w-6 text-[#1ABBB3]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#1A1A1A] mb-1">Email</h3>
                      <p className="text-gray-600">farmafacil.rebotech@gmail.com</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="bg-[#4ED3C2] bg-opacity-10 p-3 rounded-lg">
                      <Phone className="h-6 w-6 text-[#1ABBB3]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#1A1A1A] mb-1">Teléfono</h3>
                      <p className="text-gray-600">+34 647 734 564</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="bg-[#4ED3C2] bg-opacity-10 p-3 rounded-lg">
                      <MapPin className="h-6 w-6 text-[#1ABBB3]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#1A1A1A] mb-1">Oficina</h3>
                      <p className="text-gray-600">
                        Calle Marina de Empresas<br />46024 Valencia, España
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* WhatsApp */}
              <Card className="bg-gradient-to-br from-[#4ED3C2] to-[#1ABBB3]">
                <CardContent className="p-8 text-white">
                  <div className="flex items-start space-x-4">
                    <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                      <MessageCircle className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white mb-2">WhatsApp Business</h3>
                      <p className="text-white text-opacity-90 mb-4">
                        Contáctanos directamente por WhatsApp
                      </p>
                      <a
                        href="https://wa.me/34647734564"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button
                          variant="secondary"
                          className="bg-white text-[#1ABBB3] hover:bg-gray-100"
                        >
                          Abrir WhatsApp
                        </Button>
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>
              {/* ✅ Calendario solo si es farmacia */}
              {formData.tipoUsuario === "farmacia" && (
                    <div className="mt-6 bg-gradient-to-br from-[#4ED3C2] to-[#1ABBB3] rounded-lg p-6 text-white shadow-lg">
                      <div className="flex items-start space-x-4">
                        <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                          <CalendarDays className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-white mb-2">
                            Agenda una cita presencial
                          </h3>
                          <p className="text-white text-opacity-90 mb-4 text-sm">
                            Si eres una farmacia interesada en FarmaFácil, puedes
                            reservar una reunión con nuestro equipo.
                          </p>
                          <a
                            href="https://calendly.com/farmafacil/bienvenida"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Button
                              variant="secondary"
                              className="bg-white text-[#1ABBB3] hover:bg-gray-100"
                            >
                              Ver calendario
                            </Button>
                          </a>
                        </div>
                      </div>
                    </div>
                  )}

            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
