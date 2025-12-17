import Link from "next/link";
import { Pill, Mail, Phone, MapPin, MessageCircle } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#1A1A1A] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
               <div className="flex justify-center mb-4">
                <img 
                  src="https://zvxxdmfljbtlenjatqgm.supabase.co/storage/v1/object/public/farmacias-logos/Farmafacil.png"
                  alt="Logo FarmaFácil"
                  className="w-20 h-20 object-contain"
                />
               </div>
              <span className="text-xl font-bold">FarmaFácil</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              La forma más fácil de digitalizar tu farmacia. Gestión moderna y
              atención automatizada.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Enlaces</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-gray-400 hover:text-[#4ED3C2] transition-colors text-sm"
                >
                  Inicio
                </Link>
              </li>
              <li>
                <Link
                  href="/catalogo"
                  className="text-gray-400 hover:text-[#4ED3C2] transition-colors text-sm"
                >
                  Catálogo
                </Link>
              </li>
              <li>
                <Link
                  href="/contacto"
                  className="text-gray-400 hover:text-[#4ED3C2] transition-colors text-sm"
                >
                  Contacto
                </Link>
              </li>
              <li>
                <Link
                  href="/login"
                  className="text-gray-400 hover:text-[#4ED3C2] transition-colors text-sm"
                >
                  Acceder
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/privacidad"
                  className="text-gray-400 hover:text-[#4ED3C2] transition-colors text-sm"
                >
                  Política de Privacidad
                </Link>
              </li>
              <li>
                <Link
                  href="/terminos"
                  className="text-gray-400 hover:text-[#4ED3C2] transition-colors text-sm"
                >
                  Términos de Uso
                </Link>
              </li>
              <li>
                <Link
                  href="/terminos"
                  className="text-gray-400 hover:text-[#4ED3C2] transition-colors text-sm"
                >
                  Aviso Legal
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Contacto</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-2 text-gray-400 text-sm">
                <Mail className="h-4 w-4" />
                <span>farmafacil.rebotech@gmail.com</span>
              </li>
              <li className="flex items-center space-x-2 text-gray-400 text-sm">
                <Phone className="h-4 w-4" />
                <span>+34 647 734 564</span>
              </li>
              <li className="flex items-center space-x-2 text-gray-400 text-sm">
                <MapPin className="h-4 w-4" />
                <span>Valencia, España</span>
              </li>
              <li>
                <a
                  href="https://wa.me/34647734564"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-[#4ED3C2] hover:text-[#1ABBB3] transition-colors text-sm"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>WhatsApp Business</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} ReBoTech Solutions - FarmaFácil. Todos
            los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}

