"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Pill, Menu, X, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { 
  getFarmaciaSession, 
  getClienteSession, 
  clearSession 
} from "@/lib/sessionManager";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [userType, setUserType] = useState<"farmacia" | "cliente" | null>(null);
  const [userName, setUserName] = useState<string>("");
  const [logoError, setLogoError] = useState(false);
  const router = useRouter();

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = () => {
    // Verificar sesión de farmacia
    const farmaciaSession = getFarmaciaSession();
    if (farmaciaSession) {
      setUserType("farmacia");
      setUserName(farmaciaSession.nombre || "Farmacia");
      return;
    }

    // Verificar sesión de cliente
    const clienteSession = getClienteSession();
    if (clienteSession) {
      setUserType("cliente");
      setUserName(clienteSession.nombre || "Cliente");
      return;
    }

    // No hay sesión
    setUserType(null);
    setUserName("");
  };

  const handleSignOut = () => {
    clearSession();
    setUserType(null);
    setUserName("");
    router.push("/");
  };

  // Determinar a qué dashboard redirigir
  const getDashboardLink = () => {
    if (userType === "farmacia") return "/farmacia/dashboard";
    if (userType === "cliente") return "/cliente/dashboard";
    return "/dashboard";
  };

  return (
    <nav className="bg-white shadow-md fixed top-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2">
            {!logoError ? (
              <div className="relative w-10 h-10">
                <Image
                  src="/images/logo/farmafacil-logo.png"
                  alt="FarmaFácil Logo"
                  width={40}
                  height={40}
                  className="object-contain"
                  onError={() => setLogoError(true)}
                />
              </div>
            ) : (
              <div className="bg-gradient-to-br from-[#4ED3C2] to-[#1ABBB3] p-2 rounded-lg">
                <Pill className="h-6 w-6 text-white" />
              </div>
            )}
            <span className="text-2xl font-bold text-gray-800">
              FarmaFácil
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="text-gray-700 hover:text-[#1ABBB3] transition-colors font-medium"
            >
              Inicio
            </Link>
            <Link
              href="/catalogo"
              className="text-gray-700 hover:text-[#1ABBB3] transition-colors font-medium"
            >
              Catálogo
            </Link>
            <Link
              href="/contacto"
              className="text-gray-700 hover:text-[#1ABBB3] transition-colors font-medium"
            >
              Contacto
            </Link>

            {userType ? (
              <div className="flex items-center space-x-4">
                <Link href={getDashboardLink()}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-700 hover:text-[#1ABBB3]"
                  >
                    <User className="h-4 w-4 mr-2" />
                    {userType === "farmacia" ? "Mi Farmacia" : "Mi Cuenta"}
                  </Button>
                </Link>
                <Button
                  onClick={handleSignOut}
                  variant="ghost"
                  size="sm"
                  className="text-gray-700 hover:text-red-600"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Salir
                </Button>
              </div>
            ) : (
              <Link href="/dashboard">
                <Button className="bg-[#1ABBB3] hover:bg-[#4ED3C2] text-white rounded-full px-6">
                  Acceder
                </Button>
              </Link>
            )}
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-gray-700"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-4 pt-2 pb-4 space-y-3">
            <Link
              href="/"
              className="block py-2 text-gray-700 hover:text-[#1ABBB3]"
              onClick={() => setIsOpen(false)}
            >
              Inicio
            </Link>
            <Link
              href="/catalogo"
              className="block py-2 text-gray-700 hover:text-[#1ABBB3]"
              onClick={() => setIsOpen(false)}
            >
              Catálogo
            </Link>
            <Link
              href="/contacto"
              className="block py-2 text-gray-700 hover:text-[#1ABBB3]"
              onClick={() => setIsOpen(false)}
            >
              Contacto
            </Link>
            {userType ? (
              <>
                <Link
                  href={getDashboardLink()}
                  className="block py-2 text-gray-700 hover:text-[#1ABBB3]"
                  onClick={() => setIsOpen(false)}
                >
                  {userType === "farmacia" ? "Mi Farmacia" : "Mi Cuenta"}
                </Link>
                <button
                  onClick={() => {
                    handleSignOut();
                    setIsOpen(false);
                  }}
                  className="block w-full text-left py-2 text-red-600"
                >
                  Salir
                </button>
              </>
            ) : (
              <Link
                href="/dashboard"
                className="block py-2"
                onClick={() => setIsOpen(false)}
              >
                <Button className="w-full bg-[#1ABBB3] hover:bg-[#4ED3C2] text-white rounded-full">
                  Acceder
                </Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

