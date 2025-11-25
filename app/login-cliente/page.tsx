"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { User, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { comparePassword } from "@/lib/authUtils";
import { setClienteSession } from "@/lib/sessionManager";

export default function LoginClientePage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!acceptedTerms) {
      setError("Debes aceptar los términos y condiciones para continuar");
      return;
    }

    setIsLoading(true);

    try {
      // 1. Buscar cliente en tabla clientes
      const { data: cliente, error: clienteError } = await supabase
        .from("clientes")
        .select("id, email, nombre, password_hash")
        .eq("email", email)
        .single();

      if (clienteError || !cliente) {
        setError("Credenciales incorrectas");
        setIsLoading(false);
        return;
      }

      // 2. Verificar contraseña con bcrypt
      const isPasswordValid = await comparePassword(password, cliente.password_hash);

      if (!isPasswordValid) {
        setError("Credenciales incorrectas");
        setIsLoading(false);
        return;
      }

      // 3. Guardar sesión en localStorage
      setClienteSession({
        cliente_id: cliente.id,
        email: cliente.email,
        nombre: cliente.nombre,
      });

      // 4. Redirigir a selección de farmacia
      router.push("/seleccion-farmacia");
    } catch (err: any) {
      console.error("Error en login cliente:", err);
      setError("Error al iniciar sesión. Por favor intenta de nuevo.");
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
              <User className="h-8 w-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold text-[#1A1A1A]">
            Login Cliente
          </CardTitle>
          <p className="text-sm text-gray-600 mt-2">
            Accede para realizar tus compras
          </p>
        </CardHeader>
        <CardContent>
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
                disabled={isLoading}
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
                disabled={isLoading}
              />
            </div>

            {/* Checkbox términos */}
            <div className="flex items-start space-x-2">
              <Checkbox
                id="terms-cliente"
                checked={acceptedTerms}
                onCheckedChange={(checked) => setAcceptedTerms(checked as boolean)}
                disabled={isLoading}
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
                  Verificando...
                </>
              ) : (
                "Iniciar Sesión"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center space-y-2">
            <p className="text-sm text-gray-600">
              ¿No tienes cuenta?{" "}
              <Link
                href="/register"
                className="text-[#1ABBB3] hover:underline font-semibold"
              >
                Regístrate aquí
              </Link>
            </p>
            <p className="text-sm text-gray-600">
              ¿Eres farmacia?{" "}
              <Link
                href="/login-farmacia"
                className="text-[#1ABBB3] hover:underline font-semibold"
              >
                Accede aquí
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

