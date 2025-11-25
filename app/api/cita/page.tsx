"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import { es } from "date-fns/locale";

type TipoCita = "presencial" | "online";

interface FormData {
  nombre: string;
  email: string;
  telefono: string;
  direccion: string;
  mensaje: string;
}

export default function CitaPage() {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [tipo, setTipo] = useState<TipoCita>("presencial");
  const [fecha, setFecha] = useState<string>("");
  const [slots, setSlots] = useState<string[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string>("");
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState<FormData>({
    nombre: "",
    email: "",
    telefono: "",
    direccion: "",
    mensaje: "",
  });
  const [error, setError] = useState<string | null>(null);

  const today = format(new Date(), "yyyy-MM-dd");

  const handleBuscarSlots = async () => {
    if (!fecha) {
      setError("Selecciona una fecha.");
      return;
    }
    setError(null);
    setLoadingSlots(true);
    setSlots([]);
    setSelectedSlot("");
    try {
      const res = await fetch("/api/cita/disponibilidad", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: fecha, tipo }),
      });
      const data = await res.json();
      if (!data.success) {
        setError(data.error || "No se pudo obtener la disponibilidad.");
        return;
      }
      setSlots(data.slots || []);
      if ((data.slots || []).length === 0) {
        setError("No hay huecos disponibles para ese día.");
      }
    } catch (e: any) {
      setError("Error al consultar la disponibilidad.");
    } finally {
      setLoadingSlots(false);
    }
  };

  const handleReserva = async () => {
    if (!selectedSlot) {
      setError("Selecciona una hora.");
      return;
    }
    if (!form.nombre || !form.email || !form.telefono) {
      setError("Nombre, email y teléfono son obligatorios.");
      return;
    }
    if (tipo === "presencial" && !form.direccion) {
      setError("Para citas presenciales necesitamos la dirección de la farmacia.");
      return;
    }

    setError(null);
    setSubmitting(true);

    try {
      const res = await fetch("/api/cita/reservar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fecha,
          hora: selectedSlot,
          nombre: form.nombre,
          email: form.email,
          telefono: form.telefono,
          tipo,
          direccion: form.direccion,
          mensaje: form.mensaje,
        }),
      });
      const data = await res.json();
      if (!data.success) {
        setError(data.error || "No se pudo reservar la cita.");
        return;
      }
      setStep(4);
    } catch (e: any) {
      setError("Error al reservar la cita.");
    } finally {
      setSubmitting(false);
    }
  };

  const formattedFecha =
    fecha &&
    format(new Date(fecha + "T00:00:00"), "EEEE d 'de' MMMM", { locale: es });

  return (
    <div className="min-h-screen bg-[#F7F9FA] py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Card className="shadow-lg border-0">
          <CardContent className="p-8 space-y-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-[#1A1A1A] mb-2">
                Reserva una cita con FarmaFácil
              </h1>
              <p className="text-gray-600">
                Elige el tipo de reunión, la fecha y la hora que mejor se adapte
                a tu farmacia.
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded">
                {error}
              </div>
            )}

            {step === 1 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-[#1A1A1A]">
                  1. Tipo de cita
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setTipo("presencial")}
                    className={`border rounded-lg p-4 text-left transition ${
                      tipo === "presencial"
                        ? "border-[#1ABBB3] bg-[#E6F7F6]"
                        : "border-gray-200 bg-white"
                    }`}
                  >
                    <h3 className="font-semibold mb-1">Presencial</h3>
                    <p className="text-sm text-gray-600">
                      Visitamos tu farmacia para ver de cerca cómo puede
                      ayudarte FarmaFácil.
                    </p>
                  </button>
                  <button
                    type="button"
                    onClick={() => setTipo("online")}
                    className={`border rounded-lg p-4 text-left transition ${
                      tipo === "online"
                        ? "border-[#1ABBB3] bg-[#E6F7F6]"
                        : "border-gray-200 bg-white"
                    }`}
                  >
                    <h3 className="font-semibold mb-1">Online / Telefónica</h3>
                    <p className="text-sm text-gray-600">
                      Reunión por videollamada o teléfono para una demo rápida.
                    </p>
                  </button>
                </div>

                <div className="flex justify-end">
                  <Button
                    onClick={() => setStep(2)}
                    className="bg-[#1ABBB3] hover:bg-[#4ED3C2] text-white"
                  >
                    Continuar
                  </Button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-[#1A1A1A]">
                  2. Selecciona fecha y hora
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fecha
                    </label>
                    <Input
                      type="date"
                      min={today}
                      value={fecha}
                      onChange={(e) => setFecha(e.target.value)}
                    />
                  </div>
                  <Button
                    type="button"
                    onClick={handleBuscarSlots}
                    disabled={!fecha || loadingSlots}
                    className="bg-[#1ABBB3] hover:bg-[#4ED3C2] text-white"
                  >
                    {loadingSlots
                      ? "Buscando disponibilidad..."
                      : "Ver horas disponibles"}
                  </Button>
                </div>

                {formattedFecha && (
                  <p className="text-sm text-gray-600">
                    Disponibilidad para:{" "}
                    <span className="font-medium">{formattedFecha}</span> (
                    {tipo === "presencial"
                      ? "mañana (visita presencial)"
                      : "tarde (online/telefónica)"}
                    )
                  </p>
                )}

                {slots.length > 0 && (
                  <div className="space-y-3">
                    <p className="text-sm font-medium text-gray-700">
                      Elige una hora
                    </p>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                      {slots.map((slot) => (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setSelectedSlot(slot)}
                          className={`border rounded-md px-2 py-2 text-sm transition ${
                            selectedSlot === slot
                              ? "bg-[#1ABBB3] text-white border-[#1ABBB3]"
                              : "bg-white text-gray-800 border-gray-200 hover:border-[#1ABBB3]"
                          }`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex justify-between">
                  <Button
                    variant="outline"
                    onClick={() => setStep(1)}
                  >
                    Volver
                  </Button>
                  <Button
                    onClick={() => setStep(3)}
                    disabled={!selectedSlot}
                    className="bg-[#1ABBB3] hover:bg-[#4ED3C2] text-white"
                  >
                    Continuar
                  </Button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-[#1A1A1A]">
                  3. Datos de contacto
                </h2>
                <p className="text-sm text-gray-600">
                  Reservando para el día{" "}
                  <span className="font-medium">{formattedFecha}</span> a las{" "}
                  <span className="font-medium">{selectedSlot}</span> (
                  {tipo === "presencial" ? "visita presencial" : "online"}).
                </p>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre de la farmacia / persona de contacto
                    </label>
                    <Input
                      value={form.nombre}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, nombre: e.target.value }))
                      }
                      placeholder="Farmacia San Miguel - Laura"
                    />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <Input
                        type="email"
                        value={form.email}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, email: e.target.value }))
                        }
                        placeholder="correo@farmacia.es"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Teléfono
                      </label>
                      <Input
                        value={form.telefono}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, telefono: e.target.value }))
                        }
                        placeholder="+34 600 000 000"
                      />
                    </div>
                  </div>

                  {tipo === "presencial" && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Dirección de la farmacia
                      </label>
                      <Input
                        value={form.direccion}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, direccion: e.target.value }))
                        }
                        placeholder="Calle, número, ciudad"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Comentarios (opcional)
                    </label>
                    <Textarea
                      rows={3}
                      value={form.mensaje}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, mensaje: e.target.value }))
                      }
                      placeholder="Cuéntanos si hay algo concreto que te gustaría ver en la demo..."
                    />
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button
                    variant="outline"
                    onClick={() => setStep(2)}
                  >
                    Volver
                  </Button>
                  <Button
                    onClick={handleReserva}
                    disabled={submitting}
                    className="bg-[#1ABBB3] hover:bg-[#4ED3C2] text-white"
                  >
                    {submitting ? "Reservando..." : "Confirmar cita"}
                  </Button>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-4 text-center">
                <h2 className="text-2xl font-bold text-[#1A1A1A]">
                  Cita reservada 🎉
                </h2>
                <p className="text-gray-600">
                  Hemos registrado tu cita y la verás reflejada en la agenda de
                  FarmaFácil. Te contactaremos si necesitamos ajustar algún
                  detalle.
                </p>
                <p className="text-sm text-gray-500">
                  Si necesitas modificar o cancelar la cita, responde al correo
                  de confirmación o escríbenos por WhatsApp.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
