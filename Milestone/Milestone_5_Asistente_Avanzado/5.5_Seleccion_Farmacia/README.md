# 🏪 Milestone 5.5: Selección de Farmacia con QR

## 📑 Índice de Pasos

1. [Paso 1: Página de selección](#paso-1-página-de-selección)
2. [Paso 2: Lista de farmacias](#paso-2-lista-de-farmacias)
3. [Paso 3: Modal con código QR](#paso-3-modal-con-código-qr)
4. [Paso 4: Generación de QR dinámico](#paso-4-generación-de-qr-dinámico)
5. [Paso 5: Navegación al catálogo](#paso-5-navegación-al-catálogo)

---

## Paso 1: Página de selección

### Descripción
Página donde el cliente autenticado elige su farmacia preferida.

### Archivo: `app/seleccion-farmacia/page.tsx`
```typescript
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";
import { supabase } from "@/lib/supabaseClient";
import { getClienteSession } from "@/lib/sessionManager";
import { clienteUrl } from "@/lib/urlBuilder";

export default function SeleccionFarmaciaPage() {
  const router = useRouter();
  const [farmacias, setFarmacias] = useState([]);
  const [selectedFarmacia, setSelectedFarmacia] = useState(null);
  const [showQRModal, setShowQRModal] = useState(false);

  useEffect(() => {
    // Verificar autenticación
    const session = getClienteSession();
    if (!session) {
      router.push("/login-cliente");
      return;
    }
    fetchFarmacias();
  }, [router]);

  // ... resto del código
}
```

### Verificación de sesión
- El cliente debe estar autenticado para ver esta página
- Si no hay sesión, redirige a `/login-cliente`

### Resultado
✅ Página protegida con verificación de sesión

---

## Paso 2: Lista de farmacias

### Descripción
Carga y muestra todas las farmacias registradas en FarmaFácil.

### Consulta a Supabase
```typescript
const fetchFarmacias = async () => {
  const { data, error } = await supabase
    .from("farmacias")
    .select("id, codigo, nombre, direccion, telefono, logo_url, color_principal")
    .order("nombre", { ascending: true });

  if (error) throw error;
  setFarmacias(data || []);
};
```

### Información mostrada por farmacia
| Campo | Descripción |
|-------|-------------|
| `logo_url` | Logo de la farmacia |
| `nombre` | Nombre de la farmacia |
| `direccion` | Dirección física |
| `telefono` | Teléfono de contacto |
| `codigo` | Código único para generar URL |

### Grid responsive
```typescript
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {farmacias.map((farmacia) => (
    <Card onClick={() => handleSelectFarmacia(farmacia)}>
      {/* Contenido de la tarjeta */}
    </Card>
  ))}
</div>
```

### Resultado
✅ Lista de farmacias con diseño responsive

---

## Paso 3: Modal con código QR

### Descripción
Al seleccionar una farmacia, se muestra un modal con el código QR correspondiente.

### Implementación del modal
```typescript
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { QRCodeSVG } from "qrcode.react";

<Dialog open={showQRModal} onOpenChange={setShowQRModal}>
  <DialogContent className="sm:max-w-md">
    <DialogHeader>
      <DialogTitle className="text-center text-2xl">
        {selectedFarmacia?.nombre}
      </DialogTitle>
    </DialogHeader>

    {selectedFarmacia && (
      <div className="flex flex-col items-center py-6">
        {/* Logo de la farmacia */}
        {selectedFarmacia.logo_url && (
          <Image src={selectedFarmacia.logo_url} ... />
        )}

        {/* Código QR */}
        <div className="bg-white p-4 rounded-xl shadow-lg">
          <QRCodeSVG
            value={clienteUrl(selectedFarmacia.codigo)}
            size={200}
            level="H"
            includeMargin={true}
            fgColor="#1A1A1A"
          />
        </div>

        {/* Instrucciones */}
        <p className="text-center text-gray-600">
          Escanea este código QR con tu móvil para acceder al catálogo
        </p>

        {/* Botones de acción */}
        <Button onClick={handleGoToCatalogo}>
          Ir al catálogo ahora
        </Button>
      </div>
    )}
  </DialogContent>
</Dialog>
```

### Resultado
✅ Modal con QR funcional

---

## Paso 4: Generación de QR dinámico

### Descripción
El código QR se genera dinámicamente usando la librería `qrcode.react`.

### Instalación
```bash
npm install qrcode.react
```

### Configuración del QR
```typescript
import { QRCodeSVG } from "qrcode.react";

<QRCodeSVG
  value={clienteUrl(selectedFarmacia.codigo)}  // URL de destino
  size={200}                                     // Tamaño en píxeles
  level="H"                                      // Nivel de corrección (High)
  includeMargin={true}                           // Margen blanco
  fgColor="#1A1A1A"                              // Color del QR
/>
```

### Parámetros del QRCodeSVG
| Parámetro | Valor | Descripción |
|-----------|-------|-------------|
| `value` | URL | La URL que codifica el QR |
| `size` | 200 | Tamaño en píxeles |
| `level` | "H" | Nivel de corrección de errores (L, M, Q, H) |
| `includeMargin` | true | Incluir margen blanco |
| `fgColor` | "#1A1A1A" | Color del código |

### URL generada
```typescript
// lib/urlBuilder.ts
export function clienteUrl(codigo: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_CLIENTES_URL || 'https://farmafacil-clientes.vercel.app';
  return `${baseUrl}/farmacia/${codigo}`;
}

// Ejemplo: https://farmafacil-clientes.vercel.app/farmacia/mediterraneo
```

### Resultado
✅ QR dinámico generado correctamente

---

## Paso 5: Navegación al catálogo

### Descripción
El cliente puede acceder al catálogo de dos formas: escaneando el QR o haciendo clic en el botón.

### Opciones de acceso
1. **Escanear QR** - Desde el móvil, escanear el código
2. **Clic en botón** - "Ir al catálogo ahora"

### Implementación
```typescript
const handleGoToCatalogo = () => {
  if (selectedFarmacia) {
    const url = clienteUrl(selectedFarmacia.codigo);
    window.location.href = url;
  }
};

// Botones del modal
<Button onClick={handleGoToCatalogo} className="bg-[#1ABBB3]">
  <ArrowRight className="mr-2 h-4 w-4" />
  Ir al catálogo ahora
</Button>

<Button variant="outline" onClick={() => setShowQRModal(false)}>
  Elegir otra farmacia
</Button>
```

### Flujo completo
```
┌─────────────────┐
│  Login Cliente  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Selección     │
│   de Farmacia   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Modal con QR  │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
    ▼         ▼
┌───────┐ ┌────────┐
│Escanear│ │  Clic  │
│  QR   │ │ Botón  │
└───┬───┘ └───┬────┘
    │         │
    └────┬────┘
         │
         ▼
┌─────────────────┐
│   Catálogo de   │
│   la Farmacia   │
└─────────────────┘
```

### Resultado
✅ Navegación al catálogo funcional

---

## 📁 Archivos Relacionados

| Archivo | Descripción |
|---------|-------------|
| `app/seleccion-farmacia/page.tsx` | Página de selección con QR |
| `lib/urlBuilder.ts` | Generador de URLs |
| `lib/sessionManager.ts` | Gestión de sesiones |
| `package.json` | Dependencia `qrcode.react` |

---

## 🔧 Dependencias

```json
{
  "dependencies": {
    "qrcode.react": "^3.x"
  }
}
```

---

## ✅ Checklist de Completado

- [x] Página de selección creada
- [x] Lista de farmacias con datos
- [x] Modal con código QR implementado
- [x] Generación de QR dinámico
- [x] Navegación al catálogo funcional

---

[← Anterior: 5.4 Citas](../5.4_Sistema_Citas/README.md) | [Volver al índice →](../../README.md)
