# 📐 Milestone 1.5: Navegación y Layout Principal

## 📑 Índice de Pasos

1. [Paso 1: Layout raíz](#paso-1-layout-raíz)
2. [Paso 2: Componente Navbar](#paso-2-componente-navbar)
3. [Paso 3: Componente Footer](#paso-3-componente-footer)
4. [Paso 4: Navegación responsive](#paso-4-navegación-responsive)
5. [Paso 5: Metadatos y SEO](#paso-5-metadatos-y-seo)

---

## Paso 1: Layout raíz

### Descripción
Configuración del layout principal que envuelve toda la aplicación.

### Archivo: `app/layout.tsx`
```typescript
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Navbar } from '@/components/common/Navbar'
import { Footer } from '@/components/common/Footer'
import { Toaster } from '@/components/ui/sonner'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'FarmaFácil - Tu farmacia online',
  description: 'Encuentra y compra productos de farmacia de forma fácil y segura',
  keywords: ['farmacia', 'online', 'medicamentos', 'parafarmacia'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </div>
        <Toaster position="top-right" />
      </body>
    </html>
  )
}
```

### Características
- Font Inter de Google Fonts
- Layout flex con min-height: 100vh
- Navbar fijo en la parte superior
- Footer en la parte inferior
- Sistema de notificaciones global

### Resultado
✅ Layout raíz configurado

---

## Paso 2: Componente Navbar

### Descripción
Barra de navegación principal con logo, menú y acciones de usuario.

### Archivo: `components/common/Navbar.tsx`
```typescript
'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import { Menu, User, LogOut, ShoppingCart } from 'lucide-react'
import { sessionManager } from '@/lib/sessionManager'

export function Navbar() {
  const [session, setSession] = useState<any>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    setSession(sessionManager.getSession())
    
    const handleSessionChange = () => {
      setSession(sessionManager.getSession())
    }
    
    window.addEventListener('sessionChange', handleSessionChange)
    return () => window.removeEventListener('sessionChange', handleSessionChange)
  }, [])

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    sessionManager.clearSession()
    window.location.href = '/'
  }

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Image
                src="/logo_farmafacil.png"
                alt="FarmaFácil"
                width={150}
                height={40}
                className="h-10 w-auto"
              />
            </Link>
          </div>

          {/* Menú Desktop */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              href="/catalogo" 
              className="text-gray-700 hover:text-[#1ABBB3] transition-colors"
            >
              Catálogo
            </Link>
            <Link 
              href="/contacto" 
              className="text-gray-700 hover:text-[#1ABBB3] transition-colors"
            >
              Contacto
            </Link>
            
            {session ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    {session.nombre}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href={session.tipo === 'farmacia' ? '/dashboard' : '/cliente/dashboard'}>
                      Mi Panel
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Cerrar Sesión
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="ghost" asChild>
                  <Link href="/login-cliente">Acceder</Link>
                </Button>
                <Button 
                  asChild
                  className="bg-[#1ABBB3] hover:bg-[#158f89]"
                >
                  <Link href="/register">Registrarse</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Botón menú móvil */}
          <div className="md:hidden flex items-center">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>

      {/* Menú móvil */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-4 py-2 space-y-2">
            <Link 
              href="/catalogo" 
              className="block py-2 text-gray-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              Catálogo
            </Link>
            <Link 
              href="/contacto" 
              className="block py-2 text-gray-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contacto
            </Link>
            {/* ... resto del menú móvil */}
          </div>
        </div>
      )}
    </nav>
  )
}
```

### Resultado
✅ Navbar responsive implementado

---

## Paso 3: Componente Footer

### Descripción
Pie de página con enlaces legales e información de contacto.

### Archivo: `components/common/Footer.tsx`
```typescript
import Link from 'next/link'
import Image from 'next/image'

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo y descripción */}
          <div className="col-span-1 md:col-span-2">
            <Image
              src="/logo_farmafacil.png"
              alt="FarmaFácil"
              width={120}
              height={32}
              className="h-8 w-auto mb-4 brightness-0 invert"
            />
            <p className="text-gray-400 text-sm">
              FarmaFácil es tu plataforma de confianza para encontrar 
              y comprar productos de farmacia de forma fácil y segura.
            </p>
          </div>

          {/* Enlaces */}
          <div>
            <h3 className="font-semibold mb-4">Enlaces</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href="/catalogo" className="hover:text-white transition">
                  Catálogo
                </Link>
              </li>
              <li>
                <Link href="/contacto" className="hover:text-white transition">
                  Contacto
                </Link>
              </li>
              <li>
                <Link href="/login-farmacia" className="hover:text-white transition">
                  Soy Farmacia
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href="/privacidad" className="hover:text-white transition">
                  Política de Privacidad
                </Link>
              </li>
              <li>
                <Link href="/terminos" className="hover:text-white transition">
                  Términos y Condiciones
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>© {new Date().getFullYear()} FarmaFácil. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
```

### Resultado
✅ Footer con enlaces y copyright

---

## Paso 4: Navegación responsive

### Descripción
Implementación de navegación adaptable a diferentes tamaños de pantalla.

### Breakpoints utilizados
| Breakpoint | Ancho | Comportamiento |
|------------|-------|----------------|
| `sm` | ≥640px | Menú móvil |
| `md` | ≥768px | Transición a desktop |
| `lg` | ≥1024px | Menú desktop completo |
| `xl` | ≥1280px | Máximo ancho contenedor |

### CSS aplicado
```css
/* En globals.css */
@layer components {
  .nav-link {
    @apply text-gray-700 hover:text-[#1ABBB3] transition-colors 
           font-medium py-2 px-3 rounded-md;
  }

  .nav-link-active {
    @apply text-[#1ABBB3] bg-[#1ABBB3]/10;
  }

  .mobile-menu {
    @apply fixed inset-0 z-50 bg-white transform transition-transform
           duration-300 ease-in-out;
  }

  .mobile-menu-open {
    @apply translate-x-0;
  }

  .mobile-menu-closed {
    @apply translate-x-full;
  }
}
```

### Resultado
✅ Navegación totalmente responsive

---

## Paso 5: Metadatos y SEO

### Descripción
Configuración de metadatos para SEO y compartir en redes sociales.

### Archivo: `app/layout.tsx` (metadatos)
```typescript
export const metadata: Metadata = {
  title: {
    default: 'FarmaFácil - Tu farmacia online',
    template: '%s | FarmaFácil'
  },
  description: 'Encuentra y compra productos de farmacia de forma fácil y segura. Amplio catálogo de medicamentos y parafarmacia.',
  keywords: [
    'farmacia online',
    'medicamentos',
    'parafarmacia',
    'comprar medicinas',
    'farmacia 24 horas'
  ],
  authors: [{ name: 'FarmaFácil' }],
  creator: 'FarmaFácil',
  publisher: 'FarmaFácil',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://farmafacil.com'),
  openGraph: {
    title: 'FarmaFácil - Tu farmacia online',
    description: 'Encuentra y compra productos de farmacia de forma fácil y segura.',
    url: 'https://farmafacil.com',
    siteName: 'FarmaFácil',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'FarmaFácil - Tu farmacia online',
      },
    ],
    locale: 'es_ES',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FarmaFácil - Tu farmacia online',
    description: 'Encuentra y compra productos de farmacia de forma fácil y segura.',
    images: ['/twitter-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
}
```

### Metadatos por página
```typescript
// Ejemplo: app/catalogo/page.tsx
export const metadata: Metadata = {
  title: 'Catálogo de Productos',
  description: 'Explora nuestro amplio catálogo de productos de farmacia y parafarmacia.',
}
```

### Resultado
✅ SEO optimizado para motores de búsqueda y redes sociales

---

## 📁 Archivos Relacionados

| Archivo | Descripción |
|---------|-------------|
| `app/layout.tsx` | Layout principal |
| `components/common/Navbar.tsx` | Barra de navegación |
| `components/common/Footer.tsx` | Pie de página |
| `app/globals.css` | Estilos globales |

---

## ✅ Checklist de Completado

- [x] Layout raíz configurado
- [x] Navbar implementado
- [x] Footer implementado
- [x] Navegación responsive
- [x] Metadatos SEO configurados

---

[← Anterior: 1.4 Componentes UI](../1.4_Componentes_UI_Base/README.md) | [Siguiente: Milestone 2 →](../../Milestone_2_Interfaces_Publicas/README.md)

