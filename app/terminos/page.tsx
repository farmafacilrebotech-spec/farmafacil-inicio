import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";

export default function TerminosPage() {
  return (
    <div className="min-h-screen bg-[#F7F9FA]">
      <Navbar />
      
      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-4xl font-bold text-[#1A1A1A] mb-6">
            Términos y Condiciones
          </h1>
          
          <p className="text-sm text-gray-500 mb-8">
            Última actualización: 7 de noviembre de 2025
          </p>
          
          <div className="prose max-w-none text-gray-700 space-y-6">
            <section>
              <h2 className="text-2xl font-semibold text-[#1A1A1A] mt-6 mb-4">
                1. Aceptación de Términos
              </h2>
              <p className="mb-4 leading-relaxed">
                Al acceder y utilizar la plataforma FarmaFácil, usted acepta estar sujeto a estos 
                términos y condiciones de uso. Si no está de acuerdo con alguna parte de estos 
                términos, no debe utilizar nuestros servicios.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#1A1A1A] mt-6 mb-4">
                2. Descripción del Servicio
              </h2>
              <p className="mb-4 leading-relaxed">
                FarmaFácil es una plataforma SaaS que proporciona herramientas de digitalización 
                para farmacias, incluyendo:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Gestión de catálogo de productos</li>
                <li>Sistema de pedidos online</li>
                <li>Asistente virtual con inteligencia artificial</li>
                <li>Panel de administración para farmacias</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#1A1A1A] mt-6 mb-4">
                3. Registro y Cuentas de Usuario
              </h2>
              <p className="mb-4 leading-relaxed">
                Para utilizar ciertos servicios de FarmaFácil, debe registrarse y crear una cuenta. 
                Al crear una cuenta, usted se compromete a:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Proporcionar información precisa y completa</li>
                <li>Mantener la seguridad de su contraseña</li>
                <li>Notificarnos inmediatamente sobre cualquier uso no autorizado de su cuenta</li>
                <li>Ser responsable de todas las actividades que ocurran bajo su cuenta</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#1A1A1A] mt-6 mb-4">
                4. Uso Aceptable
              </h2>
              <p className="mb-4 leading-relaxed">
                Al utilizar FarmaFácil, usted acepta no:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Violar cualquier ley o regulación aplicable</li>
                <li>Infringir los derechos de propiedad intelectual de terceros</li>
                <li>Transmitir contenido malicioso o dañino</li>
                <li>Intentar acceder sin autorización a sistemas o datos</li>
                <li>Utilizar el servicio para propósitos fraudulentos</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#1A1A1A] mt-6 mb-4">
                5. Propiedad Intelectual
              </h2>
              <p className="mb-4 leading-relaxed">
                Todo el contenido, características y funcionalidad de FarmaFácil son propiedad 
                exclusiva de nuestra empresa y están protegidos por leyes de propiedad intelectual. 
                Esto incluye, pero no se limita a, el software, diseño, textos, gráficos y logotipos.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#1A1A1A] mt-6 mb-4">
                6. Precios y Pagos
              </h2>
              <p className="mb-4 leading-relaxed">
                Los precios de nuestros servicios se encuentran disponibles en nuestra plataforma 
                y pueden estar sujetos a cambios. Los pagos deben realizarse según los términos 
                acordados en el plan de suscripción seleccionado.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#1A1A1A] mt-6 mb-4">
                7. Limitación de Responsabilidad
              </h2>
              <p className="mb-4 leading-relaxed">
                FarmaFácil se proporciona &quot;tal cual&quot; y &quot;según disponibilidad&quot;. No garantizamos que 
                el servicio será ininterrumpido, seguro o libre de errores. En ningún caso seremos 
                responsables por daños indirectos, incidentales o consecuentes.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#1A1A1A] mt-6 mb-4">
                8. Terminación
              </h2>
              <p className="mb-4 leading-relaxed">
                Nos reservamos el derecho de suspender o terminar su acceso a FarmaFácil en 
                cualquier momento, sin previo aviso, si consideramos que ha violado estos términos 
                y condiciones.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#1A1A1A] mt-6 mb-4">
                9. Modificaciones
              </h2>
              <p className="mb-4 leading-relaxed">
                Nos reservamos el derecho de modificar estos términos y condiciones en cualquier 
                momento. Las modificaciones entrarán en vigor inmediatamente después de su 
                publicación en la plataforma.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#1A1A1A] mt-6 mb-4">
                10. Contacto
              </h2>
              <p className="mb-4 leading-relaxed">
                Si tiene preguntas sobre estos términos y condiciones, puede contactarnos a través 
                de nuestra página de contacto o enviando un correo electrónico a 
                <a href="mailto:legal@farmafacil.com" className="text-[#1ABBB3] hover:underline ml-1">
                  legal@farmafacil.com
                </a>
              </p>
            </section>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}

