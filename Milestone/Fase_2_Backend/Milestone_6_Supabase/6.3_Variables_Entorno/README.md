# 🔐 6.3 Variables de Entorno

## 📋 Configuración de Credenciales

### Archivo `.env.local`

```env
# ================================================
# SUPABASE CONFIGURATION
# ================================================

# URL del proyecto Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co

# Clave anónima pública (safe for browser)
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Clave de servicio (SOLO SERVIDOR - NUNCA exponer al cliente)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# ================================================
# GOOGLE SHEETS WEBHOOK (para contacto)
# ================================================
NEXT_PUBLIC_GOOGLE_SHEET_WEBHOOK_URL=https://script.google.com/macros/s/xxxxx/exec

# ================================================
# APP CONFIGURATION
# ================================================
NEXT_PUBLIC_APP_URL=https://farmafacil.app
NEXT_PUBLIC_APP_NAME=FarmaFácil
```

---

## 🔒 Seguridad de Variables

### Variables Públicas (`NEXT_PUBLIC_*`)

```typescript
// ✅ Seguro - Expuestas al navegador
NEXT_PUBLIC_SUPABASE_URL        // URL del proyecto
NEXT_PUBLIC_SUPABASE_ANON_KEY   // Clave con permisos limitados por RLS
NEXT_PUBLIC_APP_URL             // URL de la aplicación
```

### Variables Privadas (sin `NEXT_PUBLIC_`)

```typescript
// 🔐 Privado - Solo disponibles en el servidor
SUPABASE_SERVICE_ROLE_KEY       // Bypass de RLS - muy peligrosa
DATABASE_URL                    // Conexión directa a PostgreSQL
```

---

## 📂 Estructura de Archivos

```
FarmaFacil_general/
├── .env.local          # Variables reales (NO en git)
├── .env.example        # Plantilla para desarrolladores
├── .gitignore          # Incluye .env*
└── lib/
    └── supabase.ts     # Usa las variables
```

### `.env.example`

```env
# Copia este archivo a .env.local y completa los valores

# Supabase
NEXT_PUBLIC_SUPABASE_URL=tu_url_aqui
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key_aqui
SUPABASE_SERVICE_ROLE_KEY=tu_service_key_aqui

# Google Sheets
NEXT_PUBLIC_GOOGLE_SHEET_WEBHOOK_URL=tu_webhook_aqui

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 🛡️ Validación de Variables

**Archivo**: `lib/env.ts`

```typescript
// Validación de variables de entorno requeridas
export function validateEnv() {
  const required = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  ]

  const missing = required.filter(
    (key) => !process.env[key]
  )

  if (missing.length > 0) {
    throw new Error(
      `Variables de entorno faltantes: ${missing.join(', ')}`
    )
  }
}

// Tipos para TypeScript
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_SUPABASE_URL: string
      NEXT_PUBLIC_SUPABASE_ANON_KEY: string
      SUPABASE_SERVICE_ROLE_KEY?: string
      NEXT_PUBLIC_GOOGLE_SHEET_WEBHOOK_URL?: string
      NEXT_PUBLIC_APP_URL?: string
    }
  }
}
```

---

## 🔄 Uso en el Código

### Cliente de Supabase

```typescript
// lib/supabase.ts
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)
```

### API Route con Service Key

```typescript
// app/api/admin/route.ts
import { createClient } from '@supabase/supabase-js'

// Cliente con permisos de admin (bypass RLS)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)
```

---

## ✅ Checklist

- [x] `.env.local` configurado
- [x] `.env.example` creado
- [x] `.gitignore` incluye `.env*`
- [x] Variables públicas identificadas
- [x] Variables privadas protegidas
- [x] Validación de variables implementada

---

*Paso 3 de Milestone 6 - Configuración Supabase*

