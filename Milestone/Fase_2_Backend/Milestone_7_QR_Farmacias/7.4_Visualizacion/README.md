# 🖼️ 7.4 Visualización del QR

## 📋 Modal de QR en Selección de Farmacia

### Implementación Actual

**Archivo**: `app/seleccion-farmacia/page.tsx`

El cliente, tras autenticarse, ve un listado de farmacias. Al seleccionar una, aparece un **modal con el código QR** que puede escanear desde otro dispositivo o hacer clic para ir directamente al catálogo.

---

### Código del Modal

```tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { QRCodeSVG } from "qrcode.react"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

// Estados
const [selectedFarmacia, setSelectedFarmacia] = useState<Farmacia | null>(null)
const [showQRModal, setShowQRModal] = useState(false)

// Función al seleccionar farmacia
const handleSelectFarmacia = (farmacia: Farmacia) => {
  setSelectedFarmacia(farmacia)
  setShowQRModal(true)
}

// Función para ir al catálogo
const handleGoToCatalogo = () => {
  if (selectedFarmacia) {
    const url = clienteUrl(selectedFarmacia.codigo)
    window.location.href = url
  }
}

// JSX del Modal
<Dialog open={showQRModal} onOpenChange={setShowQRModal}>
  <DialogContent className="sm:max-w-md">
    <DialogHeader>
      <DialogTitle className="text-center text-2xl">
        {selectedFarmacia?.nombre}
      </DialogTitle>
    </DialogHeader>

    {selectedFarmacia && (
      <div className="flex flex-col items-center py-6">
        {/* Código QR */}
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
          Escanea este código QR con tu móvil para acceder al catálogo de{" "}
          <strong>{selectedFarmacia.nombre}</strong>
        </p>

        {/* Botones de acción */}
        <div className="flex flex-col w-full gap-3">
          <Button
            onClick={handleGoToCatalogo}
            className="w-full bg-[#1ABBB3] hover:bg-[#4ED3C2]"
          >
            <ArrowRight className="mr-2 h-4 w-4" />
            Ir al catálogo ahora
          </Button>
          <Button
            variant="outline"
            onClick={() => setShowQRModal(false)}
            className="w-full"
          >
            Elegir otra farmacia
          </Button>
        </div>
      </div>
    )}
  </DialogContent>
</Dialog>
```

---

### Diseño Visual

```
┌─────────────────────────────────────────┐
│         FARMACIA SAN MIGUEL             │
│                                         │
│         ┌─────────────────┐             │
│         │  ███████████████ │            │
│         │  █ ▄▄▄ █▀█ █▄█ █ │            │
│         │  █ █▄█ ███ ▄▄▄ █ │  ← QR     │
│         │  █ ▄▄▄ █▀█ █▀▀ █ │            │
│         │  ███████████████ │            │
│         └─────────────────┘             │
│                                         │
│  Escanea este código QR con tu móvil   │
│  para acceder al catálogo              │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │  → Ir al catálogo ahora         │   │
│  └─────────────────────────────────┘   │
│  ┌─────────────────────────────────┐   │
│  │    Elegir otra farmacia         │   │
│  └─────────────────────────────────┘   │
│                                         │
└─────────────────────────────────────────┘
```

---

### Flujo de Usuario

```
┌─────────────────────────────────────────────────────────────┐
│                    FLUJO DE VISUALIZACIÓN                   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. Cliente en /seleccion-farmacia                          │
│     ┌─────────────────────────────────────────────────┐    │
│     │  📋 Lista de farmacias                          │    │
│     │  ├─ Farmacia San Miguel          [Seleccionar] │    │
│     │  ├─ Farmacia Central             [Seleccionar] │    │
│     │  └─ Farmacia Plus                [Seleccionar] │    │
│     └─────────────────────────────────────────────────┘    │
│                           │                                 │
│            Click en "Seleccionar"                          │
│                           │                                 │
│                           ▼                                 │
│  2. Modal con QR aparece                                    │
│     ┌─────────────────────────────────────────────────┐    │
│     │  🏥 Farmacia San Miguel                         │    │
│     │                                                 │    │
│     │        [QR CODE]                                │    │
│     │                                                 │    │
│     │  [Ir al catálogo] [Elegir otra]                 │    │
│     └─────────────────────────────────────────────────┘    │
│                           │                                 │
│         ┌─────────────────┴─────────────────┐              │
│         ▼                                   ▼              │
│  3a. Escanea QR                    3b. Click "Ir al..."    │
│      (desde móvil)                     (mismo dispositivo) │
│         │                                   │              │
│         └─────────────────┬─────────────────┘              │
│                           ▼                                 │
│  4. Redirección a /catalogo/FARM001                        │
│     ┌─────────────────────────────────────────────────┐    │
│     │  Catálogo de Farmacia San Miguel               │    │
│     │  con todos sus productos                       │    │
│     └─────────────────────────────────────────────────┘    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## ✅ Checklist

- [x] Dialog/Modal implementado
- [x] QRCodeSVG integrado
- [x] Botón "Ir al catálogo"
- [x] Botón "Elegir otra farmacia"
- [x] Estilos con Tailwind
- [x] Responsive design

---

*Paso 4 de Milestone 7 - Sistema QR Farmacias*

