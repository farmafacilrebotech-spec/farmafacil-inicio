# 📄 Milestone 2.4: Páginas de Información

## 📑 Índice de Pasos

1. [Paso 1: Estructura común](#paso-1-estructura-común)
2. [Paso 2: Política de privacidad](#paso-2-política-de-privacidad)
3. [Paso 3: Términos y condiciones](#paso-3-términos-y-condiciones)
4. [Paso 4: Navegación entre páginas](#paso-4-navegación-entre-páginas)
5. [Paso 5: SEO y accesibilidad](#paso-5-seo-y-accesibilidad)

---

## Paso 1: Estructura común

### Descripción
Definición de una estructura reutilizable para páginas legales.

### Componente base: `LegalPageLayout`
```typescript
interface LegalPageLayoutProps {
  title: string
  lastUpdated: string
  children: React.ReactNode
}

export function LegalPageLayout({ title, lastUpdated, children }: LegalPageLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-t-xl border-b p-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {title}
          </h1>
          <p className="text-sm text-gray-500 mt-2">
            Última actualización: {lastUpdated}
          </p>
        </div>

        {/* Contenido */}
        <div className="bg-white rounded-b-xl shadow-sm">
          <div className="prose prose-lg max-w-none p-8">
            {children}
          </div>
        </div>

        {/* Navegación */}
        <div className="mt-8 flex justify-center gap-4 text-sm">
          <Link href="/privacidad" className="text-[#1ABBB3] hover:underline">
            Privacidad
          </Link>
          <span className="text-gray-300">|</span>
          <Link href="/terminos" className="text-[#1ABBB3] hover:underline">
            Términos
          </Link>
          <span className="text-gray-300">|</span>
          <Link href="/contacto" className="text-[#1ABBB3] hover:underline">
            Contacto
          </Link>
        </div>
      </div>
    </div>
  )
}
```

### Estilos prose
```css
/* Estilos para contenido legal */
.prose h2 {
  @apply text-xl font-bold text-gray-900 mt-8 mb-4;
}

.prose h3 {
  @apply text-lg font-semibold text-gray-800 mt-6 mb-3;
}

.prose p {
  @apply text-gray-600 leading-relaxed mb-4;
}

.prose ul {
  @apply list-disc list-inside space-y-2 text-gray-600;
}
```

### Resultado
✅ Layout común para páginas legales

---

## Paso 2: Política de privacidad

### Descripción
Página de política de privacidad con toda la información legal requerida.

### Archivo: `app/privacidad/page.tsx`
```typescript
import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Política de Privacidad',
  description: 'Política de privacidad de FarmaFácil. Conoce cómo protegemos tus datos personales.'
}

export default function PrivacidadPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Política de Privacidad
          </h1>
          <p className="text-sm text-gray-500 mb-8">
            Última actualización: Noviembre 2025
          </p>

          <div className="prose prose-lg max-w-none">
            <h2>1. Información que recopilamos</h2>
            <p>
              En FarmaFácil recopilamos la información que nos proporcionas 
              directamente cuando te registras, realizas una compra o contactas 
              con nosotros. Esta información puede incluir:
            </p>
            <ul>
              <li>Nombre completo y apellidos</li>
              <li>Dirección de correo electrónico</li>
              <li>Número de teléfono</li>
              <li>Dirección de envío</li>
              <li>Información de pago (procesada de forma segura)</li>
            </ul>

            <h2>2. Uso de la información</h2>
            <p>
              Utilizamos la información recopilada para:
            </p>
            <ul>
              <li>Procesar y gestionar tus pedidos</li>
              <li>Enviarte comunicaciones sobre tu cuenta</li>
              <li>Mejorar nuestros servicios</li>
              <li>Cumplir con obligaciones legales</li>
            </ul>

            <h2>3. Protección de datos</h2>
            <p>
              Implementamos medidas de seguridad técnicas y organizativas 
              para proteger tus datos personales contra acceso no autorizado, 
              alteración, divulgación o destrucción.
            </p>

            <h2>4. Compartir información</h2>
            <p>
              Solo compartimos tu información con:
            </p>
            <ul>
              <li>Farmacias para procesar tus pedidos</li>
              <li>Proveedores de servicios de pago</li>
              <li>Servicios de envío para entregas</li>
            </ul>

            <h2>5. Tus derechos</h2>
            <p>
              Tienes derecho a acceder, rectificar, eliminar y portar tus 
              datos personales. Para ejercer estos derechos, contacta con 
              nosotros en privacidad@farmafacil.com
            </p>

            <h2>6. Cookies</h2>
            <p>
              Utilizamos cookies para mejorar tu experiencia. Puedes 
              configurar tu navegador para rechazar cookies, aunque esto 
              puede afectar a algunas funcionalidades.
            </p>

            <h2>7. Contacto</h2>
            <p>
              Para cualquier consulta sobre esta política, contacta con 
              nuestro Delegado de Protección de Datos en dpo@farmafacil.com
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
```

### Resultado
✅ Política de privacidad completa

---

## Paso 3: Términos y condiciones

### Descripción
Página de términos y condiciones de uso del servicio.

### Archivo: `app/terminos/page.tsx`
```typescript
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Términos y Condiciones',
  description: 'Términos y condiciones de uso de FarmaFácil.'
}

export default function TerminosPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Términos y Condiciones
          </h1>
          <p className="text-sm text-gray-500 mb-8">
            Última actualización: Noviembre 2025
          </p>

          <div className="prose prose-lg max-w-none">
            <h2>1. Aceptación de los términos</h2>
            <p>
              Al acceder y utilizar FarmaFácil, aceptas estos términos y 
              condiciones en su totalidad. Si no estás de acuerdo con 
              alguna parte, no debes utilizar nuestros servicios.
            </p>

            <h2>2. Descripción del servicio</h2>
            <p>
              FarmaFácil es una plataforma que conecta a usuarios con 
              farmacias locales, permitiendo la compra online de productos 
              de farmacia y parafarmacia.
            </p>

            <h2>3. Registro de usuario</h2>
            <p>
              Para realizar compras debes registrarte proporcionando 
              información veraz y completa. Eres responsable de mantener 
              la confidencialidad de tu cuenta.
            </p>

            <h2>4. Productos y precios</h2>
            <ul>
              <li>Los precios se muestran en euros (€) e incluyen IVA</li>
              <li>Los productos están sujetos a disponibilidad</li>
              <li>Nos reservamos el derecho de modificar precios</li>
              <li>Las imágenes son orientativas</li>
            </ul>

            <h2>5. Pedidos y pagos</h2>
            <p>
              Al realizar un pedido, confirmas que deseas adquirir los 
              productos seleccionados. El pago se procesa de forma segura 
              a través de pasarelas certificadas.
            </p>

            <h2>6. Entregas</h2>
            <ul>
              <li>Entrega en 24-48 horas laborables</li>
              <li>Gastos de envío según zona y pedido</li>
              <li>Verificación de identidad en ciertos productos</li>
            </ul>

            <h2>7. Devoluciones</h2>
            <p>
              Los productos de farmacia tienen condiciones especiales de 
              devolución según normativa vigente. Los productos de 
              parafarmacia pueden devolverse en 14 días si están 
              precintados.
            </p>

            <h2>8. Responsabilidades</h2>
            <p>
              FarmaFácil actúa como intermediario entre usuarios y 
              farmacias. Cada farmacia es responsable de sus productos 
              y servicios.
            </p>

            <h2>9. Propiedad intelectual</h2>
            <p>
              Todo el contenido de FarmaFácil está protegido por derechos 
              de autor. No está permitida su reproducción sin autorización.
            </p>

            <h2>10. Modificaciones</h2>
            <p>
              Nos reservamos el derecho de modificar estos términos en 
              cualquier momento. Los cambios serán efectivos tras su 
              publicación.
            </p>

            <h2>11. Ley aplicable</h2>
            <p>
              Estos términos se rigen por la legislación española. Para 
              cualquier disputa, serán competentes los juzgados de Madrid.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
```

### Resultado
✅ Términos y condiciones completos

---

## Paso 4: Navegación entre páginas

### Descripción
Sistema de navegación entre páginas legales.

### Implementación
```typescript
// Componente de navegación legal
function LegalNavigation({ current }: { current: 'privacidad' | 'terminos' }) {
  const links = [
    { href: '/privacidad', label: 'Política de Privacidad' },
    { href: '/terminos', label: 'Términos y Condiciones' },
  ]

  return (
    <nav className="flex gap-4 border-b pb-4 mb-8">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={`text-sm font-medium transition-colors ${
            current === link.href.slice(1)
              ? 'text-[#1ABBB3] border-b-2 border-[#1ABBB3] pb-4 -mb-[17px]'
              : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  )
}
```

### Breadcrumbs
```typescript
import { ChevronRight, Home } from 'lucide-react'

function Breadcrumbs({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
      <Link href="/" className="hover:text-[#1ABBB3]">
        <Home className="h-4 w-4" />
      </Link>
      {items.map((item, index) => (
        <Fragment key={index}>
          <ChevronRight className="h-4 w-4" />
          {item.href ? (
            <Link href={item.href} className="hover:text-[#1ABBB3]">
              {item.label}
            </Link>
          ) : (
            <span className="text-gray-900">{item.label}</span>
          )}
        </Fragment>
      ))}
    </nav>
  )
}
```

### Resultado
✅ Navegación entre páginas legales

---

## Paso 5: SEO y accesibilidad

### Descripción
Optimización SEO y accesibilidad de las páginas legales.

### Metadatos
```typescript
// app/privacidad/page.tsx
export const metadata: Metadata = {
  title: 'Política de Privacidad',
  description: 'Conoce cómo FarmaFácil protege tus datos personales. Política de privacidad completa.',
  openGraph: {
    title: 'Política de Privacidad | FarmaFácil',
    description: 'Conoce cómo protegemos tus datos personales.',
  },
  robots: {
    index: true,
    follow: true,
  }
}

// app/terminos/page.tsx
export const metadata: Metadata = {
  title: 'Términos y Condiciones',
  description: 'Términos y condiciones de uso de FarmaFácil. Lee nuestras políticas antes de usar el servicio.',
  openGraph: {
    title: 'Términos y Condiciones | FarmaFácil',
    description: 'Términos de uso del servicio FarmaFácil.',
  }
}
```

### Accesibilidad
```typescript
// Estructura semántica
<article role="document">
  <header>
    <h1>Título de la página</h1>
    <time dateTime="2025-11">Noviembre 2025</time>
  </header>
  
  <main>
    <section aria-labelledby="section-1">
      <h2 id="section-1">Sección 1</h2>
      <p>Contenido...</p>
    </section>
  </main>
</article>

// Skip links
<a href="#main-content" className="sr-only focus:not-sr-only">
  Saltar al contenido principal
</a>

// Print styles
@media print {
  .no-print { display: none; }
  .prose { font-size: 12pt; }
}
```

### Schema.org
```typescript
<script type="application/ld+json">
{JSON.stringify({
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "Política de Privacidad",
  "description": "Política de privacidad de FarmaFácil",
  "publisher": {
    "@type": "Organization",
    "name": "FarmaFácil"
  },
  "dateModified": "2025-11-01"
})}
</script>
```

### Resultado
✅ SEO y accesibilidad optimizados

---

## 📁 Archivos Relacionados

| Archivo | Descripción |
|---------|-------------|
| `app/privacidad/page.tsx` | Política de privacidad |
| `app/terminos/page.tsx` | Términos y condiciones |

---

## ✅ Checklist de Completado

- [x] Estructura común definida
- [x] Política de privacidad creada
- [x] Términos y condiciones creados
- [x] Navegación implementada
- [x] SEO y accesibilidad optimizados

---

[← Anterior: 2.3 ProductCard](../2.3_ProductCard_Componente/README.md) | [Siguiente: 2.5 Contacto →](../2.5_Pagina_Contacto/README.md)

