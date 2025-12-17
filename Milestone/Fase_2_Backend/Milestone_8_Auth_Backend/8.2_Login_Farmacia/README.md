# 🔑 8.2 Login de Farmacia

## 📋 Implementación del Login

### Código Actual (Mock)

**Archivo**: `app/login-farmacia/page.tsx`

```tsx
const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault()
  setIsLoading(true)

  try {
    const response = await fetch("/api/auth/login-farmacia", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })

    const data = await response.json()

    if (data.success && data.farmacia) {
      // ⚠️ Guardar en localStorage (inseguro)
      localStorage.setItem("farmacia_session", JSON.stringify({
        id: data.farmacia.id,
        nombre: data.farmacia.nombre,
        email: data.farmacia.email,
      }))
      
      router.push("/farmacia/dashboard")
    } else {
      setError("Credenciales inválidas")
    }
  } catch (error) {
    setError("Error de conexión")
  }

  setIsLoading(false)
}
```

---

### Código Objetivo (Supabase)

```tsx
'use client'

import { createBrowserClient } from '@/lib/supabase-auth'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginFarmaciaPage() {
  const router = useRouter()
  const supabase = createBrowserClient()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      // Login con Supabase Auth
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (authError) {
        if (authError.message === 'Invalid login credentials') {
          setError('Email o contraseña incorrectos')
        } else if (authError.message === 'Email not confirmed') {
          setError('Por favor, confirma tu email antes de iniciar sesión')
        } else {
          setError('Error al iniciar sesión')
        }
        return
      }

      if (data.session) {
        // Verificar que es una farmacia
        const { data: farmacia } = await supabase
          .from('farmacias')
          .select('id, nombre, codigo')
          .eq('id', data.user.id)
          .single()

        if (!farmacia) {
          setError('Esta cuenta no es una farmacia registrada')
          await supabase.auth.signOut()
          return
        }

        // Éxito - redirigir a dashboard
        router.push('/farmacia/dashboard')
        router.refresh() // Refrescar para que middleware detecte sesión
      }
    } catch (error) {
      setError('Error de conexión')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    // ... JSX del formulario
  )
}
```

---

### API Route de Login (actual)

**Archivo**: `app/api/auth/login-farmacia/route.ts`

```typescript
import { NextResponse } from 'next/server'

// ⚠️ DATOS MOCK - Reemplazar por Supabase
const FARMACIAS_MOCK = [
  {
    id: "farm_1",
    nombre: "Farmacia San Miguel",
    email: "sanmiguel@farmacia.com",
    password: "demo123",
    codigo: "FARM001"
  },
  // ...
]

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()

    const farmacia = FARMACIAS_MOCK.find(
      f => f.email === email && f.password === password
    )

    if (!farmacia) {
      return NextResponse.json({
        success: false,
        error: "Credenciales inválidas"
      }, { status: 401 })
    }

    // No devolver password
    const { password: _, ...farmaciaData } = farmacia

    return NextResponse.json({
      success: true,
      farmacia: farmaciaData
    })

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: "Error del servidor"
    }, { status: 500 })
  }
}
```

---

## 📊 Comparación Mock vs Supabase

| Aspecto | Mock Actual | Supabase Auth |
|---------|-------------|---------------|
| Almacenamiento | localStorage | Cookies HttpOnly |
| Validación | Array en memoria | Base de datos real |
| Tokens | No hay | JWT + Refresh |
| Seguridad | ❌ Muy baja | ✅ Alta |
| Persistencia | ❌ Volátil | ✅ Permanente |
| Multi-dispositivo | ❌ No | ✅ Sí |

---

## 🔄 Flujo Visual

```
┌─────────────────────────────────────────────────────────────┐
│                    LOGIN FLOW                               │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   USUARIO                                                   │
│   ┌─────────────────────────────────────────────────────┐  │
│   │  📧 Email: sanmiguel@farmacia.com                   │  │
│   │  🔐 Password: ********                              │  │
│   │  [Iniciar sesión]                                   │  │
│   └─────────────────────────────────────────────────────┘  │
│                           │                                 │
│                           ▼                                 │
│   VALIDACIÓN                                                │
│   ┌─────────────────────────────────────────────────────┐  │
│   │  MOCK: Buscar en array                              │  │
│   │  SUPABASE: signInWithPassword()                     │  │
│   └─────────────────────────────────────────────────────┘  │
│                           │                                 │
│           ┌───────────────┴───────────────┐                │
│           ▼                               ▼                │
│   ❌ ERROR                         ✅ ÉXITO                │
│   ┌───────────────────┐          ┌───────────────────┐    │
│   │ Mostrar mensaje   │          │ Crear sesión      │    │
│   │ de error          │          │ Redirect a        │    │
│   └───────────────────┘          │ /farmacia/dashboard│    │
│                                  └───────────────────┘    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## ✅ Checklist

- [x] Formulario de login creado
- [x] API de login (mock)
- [x] Manejo de errores
- [x] Redirección a dashboard
- [ ] Migrar a Supabase Auth
- [ ] Validación de tipo de usuario

---

*Paso 2 de Milestone 8 - Autenticación Backend*

