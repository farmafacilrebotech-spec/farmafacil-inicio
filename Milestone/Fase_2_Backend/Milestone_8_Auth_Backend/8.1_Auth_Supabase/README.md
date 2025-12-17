# 🔐 8.1 Configuración de Supabase Auth

## 📋 Pasos de Implementación

### Paso 1: Habilitar Auth en Supabase

1. Ir a **Authentication** en el dashboard de Supabase
2. Configurar proveedores:
   - ✅ Email/Password (habilitado)
   - ⬜ Google OAuth (opcional)
   - ⬜ Magic Link (opcional)

---

### Paso 2: Configurar políticas de email

```sql
-- En Supabase Dashboard > Authentication > Email Templates

-- Template de confirmación
Subject: Confirma tu cuenta de FarmaFácil
Body:
<h2>Bienvenido a FarmaFácil</h2>
<p>Haz clic en el siguiente enlace para confirmar tu cuenta:</p>
<a href="{{ .ConfirmationURL }}">Confirmar cuenta</a>

-- Template de recuperación
Subject: Recupera tu contraseña de FarmaFácil
Body:
<h2>Recuperación de contraseña</h2>
<p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
<a href="{{ .ConfirmationURL }}">Restablecer contraseña</a>
```

---

### Paso 3: Configurar URL de redirección

```
Authentication > URL Configuration

Site URL: https://farmafacil.app
Redirect URLs:
  - https://farmafacil.app/auth/callback
  - http://localhost:3000/auth/callback
```

---

### Paso 4: Instalar helpers de Next.js

```bash
npm install @supabase/auth-helpers-nextjs @supabase/supabase-js
```

---

### Paso 5: Crear cliente de Auth

**Archivo**: `lib/supabase-auth.ts`

```typescript
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

// Cliente para componentes de cliente
export function createBrowserClient() {
  return createClientComponentClient()
}

// Cliente para componentes de servidor
export function createServerClient() {
  return createServerComponentClient({ cookies })
}

// Tipos
export interface AuthUser {
  id: string
  email: string
  user_metadata: {
    nombre_farmacia?: string
    tipo?: 'farmacia' | 'cliente'
  }
}
```

---

### Paso 6: Callback de autenticación

**Archivo**: `app/auth/callback/route.ts`

```typescript
import { createServerClient } from '@/lib/supabase-auth'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/farmacia/dashboard'

  if (code) {
    const supabase = createServerClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // Error de autenticación
  return NextResponse.redirect(`${origin}/login-farmacia?error=auth_callback_error`)
}
```

---

## 📊 Diagrama de Flujo

```
┌─────────────────────────────────────────────────────────────┐
│                 SUPABASE AUTH FLOW                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   REGISTRO                                                  │
│   ┌─────────────────────────────────────────────────────┐  │
│   │  1. Usuario envía email + password                  │  │
│   │  2. supabase.auth.signUp()                          │  │
│   │  3. Supabase crea usuario en auth.users             │  │
│   │  4. Trigger: crear entrada en public.farmacias      │  │
│   │  5. Email de confirmación enviado                   │  │
│   │  6. Usuario confirma → cuenta activa                │  │
│   └─────────────────────────────────────────────────────┘  │
│                                                             │
│   LOGIN                                                     │
│   ┌─────────────────────────────────────────────────────┐  │
│   │  1. Usuario envía email + password                  │  │
│   │  2. supabase.auth.signInWithPassword()              │  │
│   │  3. Supabase valida credenciales                    │  │
│   │  4. Retorna session { access_token, refresh_token } │  │
│   │  5. Cookie sb-xxx-auth-token establecida            │  │
│   │  6. Redirect a dashboard                            │  │
│   └─────────────────────────────────────────────────────┘  │
│                                                             │
│   VERIFICACIÓN (cada request)                               │
│   ┌─────────────────────────────────────────────────────┐  │
│   │  1. Middleware lee cookie                           │  │
│   │  2. supabase.auth.getSession()                      │  │
│   │  3. Si válida → continúa                            │  │
│   │  4. Si expirada → refresh automático                │  │
│   │  5. Si inválida → redirect a login                  │  │
│   └─────────────────────────────────────────────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## ✅ Checklist

- [ ] Auth habilitado en Supabase
- [ ] Templates de email configurados
- [ ] URLs de redirección configuradas
- [ ] Helpers de Next.js instalados
- [ ] Cliente de Auth creado
- [ ] Callback route implementado

---

*Paso 1 de Milestone 8 - Autenticación Backend*

