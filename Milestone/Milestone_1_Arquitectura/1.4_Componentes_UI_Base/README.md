# 🎨 Milestone 1.4: Componentes UI Base con ShadCN

## 📑 Índice de Pasos

1. [Paso 1: Instalación de ShadCN](#paso-1-instalación-de-shadcn)
2. [Paso 2: Configuración del tema](#paso-2-configuración-del-tema)
3. [Paso 3: Componentes de formulario](#paso-3-componentes-de-formulario)
4. [Paso 4: Componentes de feedback](#paso-4-componentes-de-feedback)
5. [Paso 5: Componentes de navegación](#paso-5-componentes-de-navegación)

---

## Paso 1: Instalación de ShadCN

### Descripción
Inicialización de ShadCN UI con configuración personalizada para FarmaFácil.

### Comandos ejecutados
```bash
npx shadcn-ui@latest init
```

### Configuración seleccionada
```json
{
  "style": "default",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "app/globals.css",
    "baseColor": "slate",
    "cssVariables": true
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils"
  }
}
```

### Archivo: `components.json`
```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "app/globals.css",
    "baseColor": "slate",
    "cssVariables": true
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils"
  }
}
```

### Resultado
✅ ShadCN inicializado correctamente

---

## Paso 2: Configuración del tema

### Descripción
Personalización del tema de colores para la marca FarmaFácil.

### Archivo: `lib/utils.ts`
```typescript
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

### Archivo: `app/globals.css` (extracto de tema)
```css
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: 174 76% 42%; /* FarmaFácil Turquesa */
    --primary-foreground: 0 0% 100%;
    --secondary: 174 60% 55%;
    --secondary-foreground: 222.2 47.4% 11.2%;
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 174 76% 42%;
    --radius: 0.5rem;
  }
}
```

### Resultado
✅ Tema personalizado con colores de FarmaFácil

---

## Paso 3: Componentes de formulario

### Descripción
Instalación de componentes esenciales para formularios.

### Comandos de instalación
```bash
npx shadcn-ui@latest add button
npx shadcn-ui@latest add input
npx shadcn-ui@latest add label
npx shadcn-ui@latest add select
npx shadcn-ui@latest add textarea
npx shadcn-ui@latest add checkbox
npx shadcn-ui@latest add radio-group
npx shadcn-ui@latest add form
```

### Componentes instalados
| Componente | Archivo | Uso |
|------------|---------|-----|
| Button | `components/ui/button.tsx` | Botones de acción |
| Input | `components/ui/input.tsx` | Campos de texto |
| Label | `components/ui/label.tsx` | Etiquetas |
| Select | `components/ui/select.tsx` | Desplegables |
| Textarea | `components/ui/textarea.tsx` | Áreas de texto |
| Checkbox | `components/ui/checkbox.tsx` | Casillas de verificación |
| RadioGroup | `components/ui/radio-group.tsx` | Opciones únicas |
| Form | `components/ui/form.tsx` | Formularios validados |

### Ejemplo de uso: Button
```typescript
import { Button } from "@/components/ui/button"

// Variantes disponibles
<Button variant="default">Primario</Button>
<Button variant="secondary">Secundario</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="destructive">Destructivo</Button>
```

### Resultado
✅ Componentes de formulario instalados y configurados

---

## Paso 4: Componentes de feedback

### Descripción
Componentes para mostrar feedback al usuario (alertas, toasts, diálogos).

### Comandos de instalación
```bash
npx shadcn-ui@latest add alert
npx shadcn-ui@latest add alert-dialog
npx shadcn-ui@latest add toast
npx shadcn-ui@latest add sonner
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add progress
npx shadcn-ui@latest add skeleton
```

### Componentes instalados
| Componente | Archivo | Uso |
|------------|---------|-----|
| Alert | `components/ui/alert.tsx` | Mensajes informativos |
| AlertDialog | `components/ui/alert-dialog.tsx` | Confirmaciones |
| Toast | `components/ui/toast.tsx` | Notificaciones |
| Sonner | `components/ui/sonner.tsx` | Toasts modernos |
| Dialog | `components/ui/dialog.tsx` | Modales |
| Progress | `components/ui/progress.tsx` | Barras de progreso |
| Skeleton | `components/ui/skeleton.tsx` | Loading states |

### Hook personalizado: `hooks/use-toast.ts`
```typescript
import { toast } from "sonner"

export function useToast() {
  return {
    success: (message: string) => toast.success(message),
    error: (message: string) => toast.error(message),
    info: (message: string) => toast.info(message),
    warning: (message: string) => toast.warning(message),
  }
}
```

### Resultado
✅ Componentes de feedback listos para uso

---

## Paso 5: Componentes de navegación

### Descripción
Componentes para navegación y organización de contenido.

### Comandos de instalación
```bash
npx shadcn-ui@latest add card
npx shadcn-ui@latest add tabs
npx shadcn-ui@latest add dropdown-menu
npx shadcn-ui@latest add navigation-menu
npx shadcn-ui@latest add sheet
npx shadcn-ui@latest add scroll-area
npx shadcn-ui@latest add separator
npx shadcn-ui@latest add badge
npx shadcn-ui@latest add avatar
npx shadcn-ui@latest add table
```

### Componentes instalados
| Componente | Archivo | Uso |
|------------|---------|-----|
| Card | `components/ui/card.tsx` | Contenedores |
| Tabs | `components/ui/tabs.tsx` | Navegación por pestañas |
| DropdownMenu | `components/ui/dropdown-menu.tsx` | Menús desplegables |
| NavigationMenu | `components/ui/navigation-menu.tsx` | Menú principal |
| Sheet | `components/ui/sheet.tsx` | Paneles laterales |
| ScrollArea | `components/ui/scroll-area.tsx` | Áreas scrollables |
| Separator | `components/ui/separator.tsx` | Separadores |
| Badge | `components/ui/badge.tsx` | Etiquetas de estado |
| Avatar | `components/ui/avatar.tsx` | Avatares de usuario |
| Table | `components/ui/table.tsx` | Tablas de datos |

### Ejemplo: Card con Badge
```typescript
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

<Card>
  <CardHeader>
    <CardTitle>
      Pedido #1234
      <Badge variant="secondary">Pendiente</Badge>
    </CardTitle>
  </CardHeader>
  <CardContent>
    Contenido del pedido...
  </CardContent>
</Card>
```

### Resultado
✅ +45 componentes UI instalados y personalizados

---

## 📁 Listado de Componentes Instalados

```
components/ui/
├── accordion.tsx
├── alert-dialog.tsx
├── alert.tsx
├── aspect-ratio.tsx
├── avatar.tsx
├── badge.tsx
├── breadcrumb.tsx
├── button.tsx
├── calendar.tsx
├── card.tsx
├── carousel.tsx
├── chart.tsx
├── checkbox.tsx
├── collapsible.tsx
├── command.tsx
├── context-menu.tsx
├── dialog.tsx
├── drawer.tsx
├── dropdown-menu.tsx
├── form.tsx
├── hover-card.tsx
├── input-otp.tsx
├── input.tsx
├── label.tsx
├── menubar.tsx
├── navigation-menu.tsx
├── pagination.tsx
├── popover.tsx
├── progress.tsx
├── radio-group.tsx
├── resizable.tsx
├── scroll-area.tsx
├── select.tsx
├── separator.tsx
├── sheet.tsx
├── skeleton.tsx
├── slider.tsx
├── sonner.tsx
├── switch.tsx
├── table.tsx
├── tabs.tsx
├── textarea.tsx
├── toast.tsx
├── toaster.tsx
├── toggle-group.tsx
├── toggle.tsx
└── tooltip.tsx
```

---

## ✅ Checklist de Completado

- [x] ShadCN inicializado
- [x] Tema personalizado configurado
- [x] Componentes de formulario instalados
- [x] Componentes de feedback instalados
- [x] Componentes de navegación instalados

---

[← Anterior: 1.3 Autenticación](../1.3_Sistema_Autenticacion/README.md) | [Siguiente: 1.5 Layout →](../1.5_Navegacion_Layout/README.md)

