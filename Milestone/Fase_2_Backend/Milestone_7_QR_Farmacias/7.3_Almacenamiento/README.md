# 💾 7.3 Almacenamiento de QR en Supabase

## 📋 Configuración de Storage

### Paso 1: Crear bucket en Supabase

```sql
-- En Supabase SQL Editor
INSERT INTO storage.buckets (id, name, public)
VALUES ('qr-codes', 'qr-codes', true);

-- Política de acceso público para lectura
CREATE POLICY "QR codes son públicos"
ON storage.objects FOR SELECT
USING (bucket_id = 'qr-codes');

-- Solo el servidor puede subir
CREATE POLICY "Solo servidor sube QR"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'qr-codes' 
  AND auth.role() = 'service_role'
);
```

---

### Paso 2: Función para subir QR

```typescript
// lib/qr-storage.ts
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Solo en servidor
)

export async function uploadQRToStorage(
  codigo: string,
  qrBlob: Blob
): Promise<string | null> {
  const fileName = `${codigo}.png`
  
  const { data, error } = await supabaseAdmin.storage
    .from('qr-codes')
    .upload(fileName, qrBlob, {
      contentType: 'image/png',
      upsert: true // Sobrescribir si existe
    })
  
  if (error) {
    console.error('Error subiendo QR:', error)
    return null
  }
  
  // Obtener URL pública
  const { data: urlData } = supabaseAdmin.storage
    .from('qr-codes')
    .getPublicUrl(fileName)
  
  return urlData.publicUrl
}
```

---

### Paso 3: Generar QR en servidor y subir

```typescript
// app/api/farmacias/generar-qr/route.ts
import { NextResponse } from 'next/server'
import QRCode from 'qrcode'
import { uploadQRToStorage } from '@/lib/qr-storage'
import { clienteUrl } from '@/lib/urlBuilder'
import { supabase } from '@/lib/supabase'

export async function POST(req: Request) {
  try {
    const { codigo, farmaciaId } = await req.json()
    
    // Generar URL del catálogo
    const url = clienteUrl(codigo)
    
    // Generar QR como buffer PNG
    const qrBuffer = await QRCode.toBuffer(url, {
      type: 'png',
      width: 400,
      margin: 2,
      errorCorrectionLevel: 'H'
    })
    
    // Convertir a Blob
    const qrBlob = new Blob([qrBuffer], { type: 'image/png' })
    
    // Subir a Storage
    const qrUrl = await uploadQRToStorage(codigo, qrBlob)
    
    if (!qrUrl) {
      return NextResponse.json(
        { success: false, error: 'Error al subir QR' },
        { status: 500 }
      )
    }
    
    // Actualizar farmacia con URL del QR
    const { error } = await supabase
      .from('farmacias')
      .update({ qr_url: qrUrl })
      .eq('id', farmaciaId)
    
    if (error) {
      return NextResponse.json(
        { success: false, error: 'Error al actualizar farmacia' },
        { status: 500 }
      )
    }
    
    return NextResponse.json({ success: true, qrUrl })
    
  } catch (error) {
    console.error('Error generando QR:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno' },
      { status: 500 }
    )
  }
}
```

---

### Paso 4: Estructura en Supabase Storage

```
storage/
└── qr-codes/
    ├── FARM001.png
    ├── FARM002.png
    ├── SALU123.png
    └── ...
```

---

### Paso 5: Obtener URL del QR

```typescript
// Desde la base de datos
const { data: farmacia } = await supabase
  .from('farmacias')
  .select('qr_url')
  .eq('codigo', 'FARM001')
  .single()

console.log(farmacia.qr_url)
// → "https://xxxxx.supabase.co/storage/v1/object/public/qr-codes/FARM001.png"

// O construir directamente
function getQRUrl(codigo: string): string {
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/qr-codes/${codigo}.png`
}
```

---

## 📊 Diagrama de Almacenamiento

```
┌─────────────────────────────────────────────────────────────┐
│                ALMACENAMIENTO DE QR                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   1. REGISTRO DE FARMACIA                                   │
│      ┌─────────────────────────────────────────────────┐   │
│      │  POST /api/farmacias/register                   │   │
│      │  → Crear farmacia con código único              │   │
│      │  → Llamar a generar-qr                          │   │
│      └─────────────────────────────────────────────────┘   │
│                           │                                 │
│                           ▼                                 │
│   2. GENERACIÓN EN SERVIDOR                                 │
│      ┌─────────────────────────────────────────────────┐   │
│      │  POST /api/farmacias/generar-qr                 │   │
│      │  → QRCode.toBuffer(url)                         │   │
│      │  → Blob de imagen PNG                           │   │
│      └─────────────────────────────────────────────────┘   │
│                           │                                 │
│                           ▼                                 │
│   3. SUBIDA A STORAGE                                       │
│      ┌─────────────────────────────────────────────────┐   │
│      │  supabase.storage.from('qr-codes').upload()     │   │
│      │  → FARM001.png subido                           │   │
│      │  → URL pública generada                         │   │
│      └─────────────────────────────────────────────────┘   │
│                           │                                 │
│                           ▼                                 │
│   4. ACTUALIZACIÓN EN BD                                    │
│      ┌─────────────────────────────────────────────────┐   │
│      │  UPDATE farmacias                               │   │
│      │  SET qr_url = 'https://...qr-codes/FARM001.png' │   │
│      │  WHERE codigo = 'FARM001'                       │   │
│      └─────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## ✅ Checklist

- [ ] Bucket 'qr-codes' creado
- [ ] Políticas de acceso configuradas
- [ ] Función de subida implementada
- [ ] API de generación creada
- [ ] Campo qr_url en tabla farmacias
- [ ] Integración con registro de farmacia

---

*Paso 3 de Milestone 7 - Sistema QR Farmacias*

