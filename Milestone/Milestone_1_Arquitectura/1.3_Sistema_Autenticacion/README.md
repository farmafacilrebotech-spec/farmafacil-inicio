# 🔐 Milestone 1.3: Sistema de Autenticación

## 📑 Índice de Pasos

1. [Paso 1: Utilidades de autenticación](#paso-1-utilidades-de-autenticación)
2. [Paso 2: API de registro](#paso-2-api-de-registro)
3. [Paso 3: API de login](#paso-3-api-de-login)
4. [Paso 4: Middleware de protección](#paso-4-middleware-de-protección)
5. [Paso 5: Gestión de sesiones](#paso-5-gestión-de-sesiones)

---

## Paso 1: Utilidades de autenticación

### Descripción
Creación de funciones de utilidad para hash de contraseñas y validación.

### Archivo: `lib/auth.ts`
```typescript
import bcrypt from 'bcryptjs'

// Hash de contraseña
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(12)
  return bcrypt.hash(password, salt)
}

// Verificar contraseña
export async function verifyPassword(
  password: string, 
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

// Generar token de sesión
export function generateSessionToken(): string {
  return crypto.randomUUID()
}

// Validar formato de email
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Validar fortaleza de contraseña
export function isStrongPassword(password: string): boolean {
  return password.length >= 8
}
```

### Archivo: `lib/authUtils.ts`
```typescript
import { cookies } from 'next/headers'

export type UserType = 'cliente' | 'farmacia'

export interface SessionData {
  id: string
  email: string
  nombre: string
  tipo: UserType
}

// Obtener sesión actual
export async function getSession(): Promise<SessionData | null> {
  const cookieStore = cookies()
  const sessionCookie = cookieStore.get('farmafacil_session')
  
  if (!sessionCookie) return null
  
  try {
    return JSON.parse(sessionCookie.value)
  } catch {
    return null
  }
}

// Establecer sesión
export async function setSession(data: SessionData): Promise<void> {
  const cookieStore = cookies()
  cookieStore.set('farmafacil_session', JSON.stringify(data), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7 // 7 días
  })
}

// Cerrar sesión
export async function clearSession(): Promise<void> {
  const cookieStore = cookies()
  cookieStore.delete('farmafacil_session')
}
```

### Resultado
✅ Utilidades de autenticación implementadas

---

## Paso 2: API de registro

### Descripción
Endpoints para registro de nuevos clientes y farmacias.

### Archivo: `app/api/auth/register/route.ts`
```typescript
import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'
import { hashPassword, isValidEmail, isStrongPassword } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, nombre, tipo, ...extras } = body

    // Validaciones
    if (!email || !password || !nombre || !tipo) {
      return NextResponse.json(
        { error: 'Todos los campos son obligatorios' },
        { status: 400 }
      )
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: 'Email no válido' },
        { status: 400 }
      )
    }

    if (!isStrongPassword(password)) {
      return NextResponse.json(
        { error: 'La contraseña debe tener al menos 8 caracteres' },
        { status: 400 }
      )
    }

    // Hash de contraseña
    const password_hash = await hashPassword(password)

    // Tabla según tipo de usuario
    const tabla = tipo === 'farmacia' ? 'farmacias' : 'clientes'

    // Verificar si ya existe
    const { data: existing } = await supabase
      .from(tabla)
      .select('id')
      .eq('email', email)
      .single()

    if (existing) {
      return NextResponse.json(
        { error: 'El email ya está registrado' },
        { status: 409 }
      )
    }

    // Crear usuario
    const { data, error } = await supabase
      .from(tabla)
      .insert({
        email,
        password_hash,
        nombre,
        ...extras
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({
      success: true,
      message: 'Usuario registrado correctamente',
      user: { id: data.id, email: data.email, nombre: data.nombre }
    })

  } catch (error) {
    console.error('Error en registro:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
```

### Resultado
✅ API de registro funcionando para clientes y farmacias

---

## Paso 3: API de login

### Descripción
Endpoint para autenticación de usuarios existentes.

### Archivo: `app/api/auth/login/route.ts`
```typescript
import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'
import { verifyPassword } from '@/lib/auth'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    const { email, password, tipo } = await request.json()

    if (!email || !password || !tipo) {
      return NextResponse.json(
        { error: 'Email, contraseña y tipo son obligatorios' },
        { status: 400 }
      )
    }

    // Tabla según tipo
    const tabla = tipo === 'farmacia' ? 'farmacias' : 'clientes'

    // Buscar usuario
    const { data: user, error } = await supabase
      .from(tabla)
      .select('*')
      .eq('email', email)
      .single()

    if (error || !user) {
      return NextResponse.json(
        { error: 'Credenciales incorrectas' },
        { status: 401 }
      )
    }

    // Verificar contraseña
    const passwordValid = await verifyPassword(password, user.password_hash)
    
    if (!passwordValid) {
      return NextResponse.json(
        { error: 'Credenciales incorrectas' },
        { status: 401 }
      )
    }

    // Crear sesión
    const sessionData = {
      id: user.id,
      email: user.email,
      nombre: user.nombre,
      tipo
    }

    // Guardar en cookie
    const cookieStore = cookies()
    cookieStore.set('farmafacil_session', JSON.stringify(sessionData), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 días
    })

    return NextResponse.json({
      success: true,
      user: sessionData
    })

  } catch (error) {
    console.error('Error en login:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
```

### Resultado
✅ API de login con verificación de contraseña y creación de sesión

---

## Paso 4: Middleware de protección

### Descripción
Middleware para proteger rutas que requieren autenticación.

### Archivo: `middleware.ts`
```typescript
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Rutas que requieren autenticación de cliente
const clienteRoutes = ['/cliente', '/checkout', '/pedidos']

// Rutas que requieren autenticación de farmacia
const farmaciaRoutes = ['/farmacia', '/dashboard']

export function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get('farmafacil_session')
  const { pathname } = request.nextUrl

  // Verificar rutas protegidas de cliente
  if (clienteRoutes.some(route => pathname.startsWith(route))) {
    if (!sessionCookie) {
      return NextResponse.redirect(new URL('/login-cliente', request.url))
    }

    try {
      const session = JSON.parse(sessionCookie.value)
      if (session.tipo !== 'cliente') {
        return NextResponse.redirect(new URL('/login-cliente', request.url))
      }
    } catch {
      return NextResponse.redirect(new URL('/login-cliente', request.url))
    }
  }

  // Verificar rutas protegidas de farmacia
  if (farmaciaRoutes.some(route => pathname.startsWith(route))) {
    if (!sessionCookie) {
      return NextResponse.redirect(new URL('/login-farmacia', request.url))
    }

    try {
      const session = JSON.parse(sessionCookie.value)
      if (session.tipo !== 'farmacia') {
        return NextResponse.redirect(new URL('/login-farmacia', request.url))
      }
    } catch {
      return NextResponse.redirect(new URL('/login-farmacia', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/cliente/:path*',
    '/farmacia/:path*',
    '/dashboard/:path*',
    '/checkout/:path*',
    '/pedidos/:path*'
  ]
}
```

### Resultado
✅ Middleware protegiendo rutas según tipo de usuario

---

## Paso 5: Gestión de sesiones

### Descripción
Sistema de gestión de sesiones con localStorage y cookies sincronizados.

### Archivo: `lib/sessionManager.ts`
```typescript
// Cliente-side session management
export const sessionManager = {
  // Obtener sesión del localStorage
  getSession() {
    if (typeof window === 'undefined') return null
    const session = localStorage.getItem('farmafacil_session')
    return session ? JSON.parse(session) : null
  },

  // Guardar sesión
  setSession(data: any) {
    if (typeof window === 'undefined') return
    localStorage.setItem('farmafacil_session', JSON.stringify(data))
    // Disparar evento para sincronizar componentes
    window.dispatchEvent(new Event('sessionChange'))
  },

  // Limpiar sesión
  clearSession() {
    if (typeof window === 'undefined') return
    localStorage.removeItem('farmafacil_session')
    window.dispatchEvent(new Event('sessionChange'))
  },

  // Verificar si está autenticado
  isAuthenticated() {
    return !!this.getSession()
  },

  // Obtener tipo de usuario
  getUserType() {
    const session = this.getSession()
    return session?.tipo || null
  },

  // Obtener ID de usuario
  getUserId() {
    const session = this.getSession()
    return session?.id || null
  }
}
```

### Uso en componentes
```typescript
import { sessionManager } from '@/lib/sessionManager'

// En cualquier componente
const session = sessionManager.getSession()
if (session?.tipo === 'cliente') {
  // Usuario es cliente
}

// Logout
const handleLogout = () => {
  sessionManager.clearSession()
  // También limpiar cookie vía API
  fetch('/api/auth/logout', { method: 'POST' })
}
```

### Resultado
✅ Gestión de sesiones sincronizada cliente-servidor

---

## 📁 Archivos Relacionados

| Archivo | Descripción |
|---------|-------------|
| `lib/auth.ts` | Utilidades de hash y validación |
| `lib/authUtils.ts` | Manejo de sesiones servidor |
| `lib/sessionManager.ts` | Manejo de sesiones cliente |
| `app/api/auth/register/route.ts` | API de registro |
| `app/api/auth/login/route.ts` | API de login |
| `middleware.ts` | Protección de rutas |

---

## ✅ Checklist de Completado

- [x] Utilidades de hash implementadas
- [x] API de registro funcionando
- [x] API de login funcionando
- [x] Middleware de protección activo
- [x] Gestión de sesiones sincronizada

---

[← Anterior: 1.2 Supabase](../1.2_Configuracion_Supabase/README.md) | [Siguiente: 1.4 Componentes UI →](../1.4_Componentes_UI_Base/README.md)

