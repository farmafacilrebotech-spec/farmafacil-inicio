"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Pill, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validar que se aceptaron los términos
    if (!acceptedTerms) {
      setError("Debes aceptar los términos y condiciones para continuar");
      return;
    }

    setIsLoading(true);

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) throw signInError;

      if (data.user) {
        const { data: farmacia } = await supabase
          .from("farmacias")
          .select("*")
          .eq("user_id", data.user.id)
          .single();

        if (farmacia) {
          router.push("/dashboard");
        } else {
          router.push("/catalogo");
        }
      }
    } catch (err: any) {
      setError(err.message || "Error al iniciar sesión");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#4ED3C2] to-[#1ABBB3] flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-br from-[#4ED3C2] to-[#1ABBB3] p-3 rounded-xl">
              <Pill className="h-8 w-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold text-[#1A1A1A]">
            Acceder a FarmaFácil
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="farmacia" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="farmacia">Farmacia</TabsTrigger>
              <TabsTrigger value="cliente">Cliente</TabsTrigger>
            </TabsList>

            <TabsContent value="farmacia">
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Email
                  </label>
                  <Input
                    type="email"
                    placeholder="tu@farmacia.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Contraseña
                  </label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                {/* Checkbox de términos y condiciones */}
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="terms-farmacia"
                    checked={acceptedTerms}
                    onCheckedChange={(checked) => setAcceptedTerms(checked as boolean)}
                  />
                  <label
                    htmlFor="terms-farmacia"
                    className="text-sm text-gray-600 leading-relaxed cursor-pointer"
                  >
                    Acepto los{" "}
                    <Link
                      href="/terminos"
                      className="text-[#1ABBB3] hover:underline font-semibold"
                      target="_blank"
                    >
                      términos y condiciones
                    </Link>{" "}
                    y la{" "}
                    <Link
                      href="/privacidad"
                      className="text-[#1ABBB3] hover:underline font-semibold"
                      target="_blank"
                    >
                      política de privacidad
                    </Link>
                  </label>
                </div>

                {error && (
                  <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full bg-[#1ABBB3] hover:bg-[#4ED3C2] text-white"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Accediendo...
                    </>
                  ) : (
                    "Acceder"
                  )}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="cliente">
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Email
                  </label>
                  <Input
                    type="email"
                    placeholder="tu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Contraseña
                  </label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                {/* Checkbox de términos y condiciones */}
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="terms-cliente"
                    checked={acceptedTerms}
                    onCheckedChange={(checked) => setAcceptedTerms(checked as boolean)}
                  />
                  <label
                    htmlFor="terms-cliente"
                    className="text-sm text-gray-600 leading-relaxed cursor-pointer"
                  >
                    Acepto los{" "}
                    <Link
                      href="/terminos"
                      className="text-[#1ABBB3] hover:underline font-semibold"
                      target="_blank"
                    >
                      términos y condiciones
                    </Link>{" "}
                    y la{" "}
                    <Link
                      href="/privacidad"
                      className="text-[#1ABBB3] hover:underline font-semibold"
                      target="_blank"
                    >
                      política de privacidad
                    </Link>
                  </label>
                </div>

                {error && (
                  <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full bg-[#1ABBB3] hover:bg-[#4ED3C2] text-white"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Accediendo...
                    </>
                  ) : (
                    "Acceder"
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              ¿No tienes cuenta?{" "}
              <Link
                href="/register"
                className="text-[#1ABBB3] hover:underline font-semibold"
              >
                Regístrate aquí
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
