# 🔗 7.1 Mapeo Código-Farmacia

## 📋 Sistema de Códigos Únicos

### Paso 1: Estructura del código

Cada farmacia tiene un **código único** que la identifica en el sistema:

```typescript
interface Farmacia {
  id: string           // UUID interno
  codigo: string       // Código público único (ej: "FARM001")
  nombre: string
  // ...
}
```

**Reglas del código:**
- Máximo 10 caracteres
- Alfanumérico en mayúsculas
- Único en toda la plataforma
- Usado en URLs públicas

---

### Paso 2: Generación automática de código

```typescript
// lib/generarCodigo.ts

export function generarCodigoFarmacia(nombre: string): string {
  // Tomar primeras letras del nombre
  const prefijo = nombre
    .replace(/[^a-zA-Z]/g, '')
    .substring(0, 4)
    .toUpperCase()
  
  // Añadir números aleatorios
  const sufijo = Math.random()
    .toString(36)
    .substring(2, 5)
    .toUpperCase()
  
  return `${prefijo}${sufijo}`
}

// Ejemplo:
// generarCodigoFarmacia("Farmacia San Miguel") → "FARM7X2"
```

---

### Paso 3: Validación de unicidad

```typescript
// lib/supabase-helpers.ts

export async function verificarCodigoDisponible(codigo: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('farmacias')
    .select('id')
    .eq('codigo', codigo)
    .single()
  
  // Si no hay datos, el código está disponible
  return !data && !error
}

export async function generarCodigoUnico(nombre: string): Promise<string> {
  let intentos = 0
  const maxIntentos = 10
  
  while (intentos < maxIntentos) {
    const codigo = generarCodigoFarmacia(nombre)
    const disponible = await verificarCodigoDisponible(codigo)
    
    if (disponible) {
      return codigo
    }
    
    intentos++
  }
  
  // Fallback con timestamp
  return `F${Date.now().toString(36).toUpperCase()}`
}
```

---

### Paso 4: Mapeo en base de datos

```sql
-- Constraint de unicidad
ALTER TABLE farmacias
ADD CONSTRAINT farmacias_codigo_unique UNIQUE (codigo);

-- Índice para búsquedas rápidas
CREATE INDEX idx_farmacias_codigo ON farmacias(codigo);

-- Función para obtener farmacia por código
CREATE OR REPLACE FUNCTION get_farmacia_by_codigo(p_codigo VARCHAR)
RETURNS SETOF farmacias AS $$
BEGIN
  RETURN QUERY
  SELECT * FROM farmacias
  WHERE codigo = p_codigo AND activa = true;
END;
$$ LANGUAGE plpgsql;
```

---

### Paso 5: URL Builder

**Archivo**: `lib/urlBuilder.ts`

```typescript
const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

/**
 * Genera la URL del catálogo para una farmacia
 */
export function clienteUrl(codigoFarmacia: string): string {
  return `${BASE_URL}/catalogo/${codigoFarmacia}`
}

/**
 * Genera la URL del QR almacenado
 */
export function qrImageUrl(codigoFarmacia: string): string {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  return `${supabaseUrl}/storage/v1/object/public/qr/${codigoFarmacia}.png`
}

/**
 * Genera la URL del panel de farmacia
 */
export function farmaciaUrl(codigoFarmacia: string): string {
  return `${BASE_URL}/farmacia/${codigoFarmacia}/dashboard`
}
```

---

## 📊 Diagrama de Mapeo

```
┌─────────────────────────────────────────────────────────────┐
│                    SISTEMA DE MAPEO                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   FARMACIA                          URL GENERADA            │
│   ┌────────────────────┐            ┌─────────────────────┐│
│   │ codigo: "FARM001"  │────────────│ /catalogo/FARM001   ││
│   │ nombre: "San Miguel"│           └─────────────────────┘│
│   └────────────────────┘                     │             │
│            │                                 │             │
│            │                                 ▼             │
│            │                         ┌─────────────────┐   │
│            │                         │   CÓDIGO QR     │   │
│            │                         │  ┌───────────┐  │   │
│            │                         │  │ █▀▀▀▀▀▀█  │  │   │
│            │                         │  │ █ ▄▄▄ █  │  │   │
│            │                         │  │ █ █▀█ █  │  │   │
│            └────────────────────────▶│  │ ▀▀▀▀▀▀▀  │  │   │
│                                      │  └───────────┘  │   │
│   SUPABASE                           │   FARM001.png   │   │
│   ┌────────────────────┐             └─────────────────┘   │
│   │ farmacias          │                     │             │
│   │ ├─ id: uuid        │                     │             │
│   │ ├─ codigo: FARM001 │◄────────────────────┘             │
│   │ └─ qr_url: ...     │                                   │
│   └────────────────────┘                                   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## ✅ Checklist

- [x] Estructura de código definida
- [x] Generador de códigos implementado
- [x] Validación de unicidad
- [x] Constraint en base de datos
- [x] URL Builder funcional

---

*Paso 1 de Milestone 7 - Sistema QR Farmacias*

