# 📱 Milestone 7: Sistema QR Farmacias

## 📋 Índice de Sub-Milestones

| Sub-Milestone | Descripción | Estado |
|---------------|-------------|--------|
| [7.1 Mapeo Código-Farmacia](./7.1_Mapeo_Codigo/) | Relación entre código único y farmacia | 🟢 Completado |
| [7.2 Generación QR](./7.2_Generacion_QR/) | Creación de códigos QR con qrcode.react | 🟢 Completado |
| [7.3 Almacenamiento QR](./7.3_Almacenamiento/) | Guardar URL del QR en Supabase | 🟡 En progreso |
| [7.4 Visualización QR](./7.4_Visualizacion/) | Modal de QR en selección de farmacia | 🟢 Completado |
| [7.5 Escaneo y Redirección](./7.5_Escaneo/) | Flujo completo del cliente escaneando QR | 🟢 Completado |

---

## 🎯 Objetivo del Milestone

Implementar el sistema de **códigos QR** que permite a los clientes acceder directamente al catálogo de una farmacia específica mediante el escaneo de un código.

---

## 🔄 Flujo del Sistema QR

```
┌─────────────────────────────────────────────────────────────┐
│                    FLUJO DEL SISTEMA QR                     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. FARMACIA SE REGISTRA                                    │
│     ┌─────────────────────────────────────────────────┐    │
│     │  Farmacia crea cuenta                           │    │
│     │  → Se genera código único: "FARM001"            │    │
│     │  → Se crea URL: farmafacil.app/catalogo/FARM001 │    │
│     │  → Se genera QR con esa URL                     │    │
│     │  → QR se guarda en Supabase Storage             │    │
│     └─────────────────────────────────────────────────┘    │
│                              │                              │
│                              ▼                              │
│  2. CLIENTE SELECCIONA FARMACIA                            │
│     ┌─────────────────────────────────────────────────┐    │
│     │  Cliente inicia sesión                          │    │
│     │  → Ve listado de farmacias                      │    │
│     │  → Selecciona una farmacia                      │    │
│     │  → Se muestra modal con QR                      │    │
│     └─────────────────────────────────────────────────┘    │
│                              │                              │
│                              ▼                              │
│  3. CLIENTE ESCANEA O ACCEDE                               │
│     ┌─────────────────────────────────────────────────┐    │
│     │  Opción A: Escanea QR con móvil                 │    │
│     │  Opción B: Click en "Ir al catálogo"            │    │
│     │  → Redirección a /catalogo/[codigo]             │    │
│     │  → Catálogo muestra productos de ESA farmacia   │    │
│     └─────────────────────────────────────────────────┘    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 📊 Estructura de Datos

### Tabla `farmacias` - Campo QR

```sql
-- Campos relevantes para el sistema QR
CREATE TABLE farmacias (
  id UUID PRIMARY KEY,
  codigo VARCHAR(10) UNIQUE NOT NULL,  -- Código único para URL
  nombre VARCHAR(255) NOT NULL,
  qr_url TEXT,                         -- URL del QR almacenado
  -- ... otros campos
);

-- Ejemplo de datos
INSERT INTO farmacias (codigo, nombre, qr_url)
VALUES (
  'FARM001',
  'Farmacia San Miguel',
  'https://storage.supabase.co/farmafacil/qr/FARM001.png'
);
```

---

## 🔗 Mapeo Código → URL

### Archivo: `lib/urlBuilder.ts`

```typescript
// Generar URL del catálogo para una farmacia
export function clienteUrl(codigoFarmacia: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  return `${baseUrl}/catalogo/${codigoFarmacia}`
}

// Generar URL del QR almacenado
export function qrStorageUrl(codigoFarmacia: string): string {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  return `${supabaseUrl}/storage/v1/object/public/qr-codes/${codigoFarmacia}.png`
}
```

---

## 📱 Generación de QR

### Componente con `qrcode.react`

```tsx
import { QRCodeSVG } from 'qrcode.react'
import { clienteUrl } from '@/lib/urlBuilder'

interface FarmaciaQRProps {
  codigo: string
  nombre: string
  size?: number
}

export function FarmaciaQR({ codigo, nombre, size = 200 }: FarmaciaQRProps) {
  const url = clienteUrl(codigo)
  
  return (
    <div className="flex flex-col items-center">
      <QRCodeSVG
        value={url}
        size={size}
        level="H"           // Alta corrección de errores
        includeMargin={true}
        fgColor="#1A1A1A"   // Color del QR
      />
      <p className="mt-4 text-center text-gray-600">
        Escanea para acceder al catálogo de <strong>{nombre}</strong>
      </p>
    </div>
  )
}
```

---

## 🖼️ Modal de Visualización

### Implementación actual en `seleccion-farmacia/page.tsx`

```tsx
<Dialog open={showQRModal} onOpenChange={setShowQRModal}>
  <DialogContent className="sm:max-w-md">
    <DialogHeader>
      <DialogTitle className="text-center text-2xl">
        {selectedFarmacia?.nombre}
      </DialogTitle>
    </DialogHeader>

    {selectedFarmacia && (
      <div className="flex flex-col items-center py-6">
        {/* QR Code */}
        <div className="bg-white p-4 rounded-xl shadow-lg mb-6">
          <QRCodeSVG
            value={clienteUrl(selectedFarmacia.codigo)}
            size={200}
            level="H"
            includeMargin={true}
            fgColor="#1A1A1A"
          />
        </div>

        {/* Instrucciones */}
        <p className="text-center text-gray-600 mb-6">
          Escanea este código QR con tu móvil para acceder al catálogo
        </p>

        {/* Botones de acción */}
        <div className="flex flex-col w-full gap-3">
          <Button onClick={handleGoToCatalogo}>
            Ir al catálogo ahora
          </Button>
          <Button variant="outline" onClick={() => setShowQRModal(false)}>
            Elegir otra farmacia
          </Button>
        </div>
      </div>
    )}
  </DialogContent>
</Dialog>
```

---

## ✅ Checklist del Milestone

- [x] Campo `codigo` en tabla farmacias
- [x] Librería `qrcode.react` instalada
- [x] Función `clienteUrl()` implementada
- [x] Modal de QR en selección de farmacia
- [x] Redirección a catálogo funcional
- [ ] Almacenamiento de QR en Supabase Storage
- [ ] Descarga de QR para imprimir

---

*Milestone 7 de Fase 2 Backend*

