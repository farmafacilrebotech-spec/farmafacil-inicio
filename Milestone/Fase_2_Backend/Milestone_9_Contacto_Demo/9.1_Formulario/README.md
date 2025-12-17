# 📝 9.1 Formulario de Contacto

## 📋 Implementación

### Estructura del Formulario

```tsx
// app/contacto/page.tsx

const [formData, setFormData] = useState({
  nombre: "",
  email: "",
  telefono: "",
  tipoUsuario: "",   // "farmacia" | "cliente"
  mensaje: "",
  aceptarRGPD: false,
});
```

### Campos del Formulario

| Campo | Tipo | Requerido | Validación |
|-------|------|-----------|------------|
| nombre | text | ✅ | Min 2 caracteres |
| email | email | ✅ | Formato válido |
| telefono | tel | ❌ | Formato +34 |
| tipoUsuario | select | ✅ | farmacia/cliente |
| mensaje | textarea | ✅ | Min 10 caracteres |
| aceptarRGPD | checkbox | ✅ | Debe ser true |

---

### Código del Formulario

```tsx
<form onSubmit={handleSubmit} className="space-y-4">
  {/* Nombre */}
  <div>
    <label className="text-sm font-medium text-gray-700 mb-2 block">
      Nombre
    </label>
    <Input
      placeholder="Tu nombre"
      value={formData.nombre}
      onChange={(e) =>
        setFormData({ ...formData, nombre: e.target.value })
      }
      required
    />
  </div>

  {/* Email */}
  <div>
    <label className="text-sm font-medium text-gray-700 mb-2 block">
      Email
    </label>
    <Input
      type="email"
      placeholder="tu@email.com"
      value={formData.email}
      onChange={(e) =>
        setFormData({ ...formData, email: e.target.value })
      }
      required
    />
  </div>

  {/* Teléfono */}
  <div>
    <label className="text-sm font-medium text-gray-700 mb-2 block">
      Teléfono
    </label>
    <Input
      type="tel"
      placeholder="+34 600 000 000"
      value={formData.telefono}
      onChange={(e) =>
        setFormData({ ...formData, telefono: e.target.value })
      }
    />
  </div>

  {/* Tipo de usuario */}
  <div>
    <label className="text-sm font-medium text-gray-700 mb-2 block">
      Soy...
    </label>
    <select
      value={formData.tipoUsuario}
      onChange={(e) =>
        setFormData({ ...formData, tipoUsuario: e.target.value })
      }
      required
      className="w-full border border-gray-300 rounded-lg p-2"
    >
      <option value="">Selecciona una opción</option>
      <option value="farmacia">Una farmacia</option>
      <option value="cliente">Un cliente</option>
    </select>
  </div>

  {/* Mensaje */}
  <div>
    <label className="text-sm font-medium text-gray-700 mb-2 block">
      Mensaje
    </label>
    <Textarea
      placeholder="¿En qué podemos ayudarte?"
      rows={5}
      value={formData.mensaje}
      onChange={(e) =>
        setFormData({ ...formData, mensaje: e.target.value })
      }
      required
    />
  </div>

  {/* RGPD */}
  <div className="flex items-start space-x-2 mt-4">
    <input
      type="checkbox"
      checked={formData.aceptarRGPD}
      onChange={(e) =>
        setFormData({ ...formData, aceptarRGPD: e.target.checked })
      }
      className="mt-1"
      required
    />
    <label className="text-sm text-gray-600">
      He leído y acepto la{" "}
      <a href="/politica-privacidad" className="text-[#1ABBB3] hover:underline">
        política de protección de datos
      </a>.
    </label>
  </div>

  {/* Info RGPD */}
  <p className="text-xs text-gray-500">
    Tus datos serán tratados por <b>ReboTech Solutions</b> con la finalidad
    de gestionar tu solicitud. Puedes ejercer tus derechos escribiendo a{" "}
    <a href="mailto:rgpd@rebotech.solutions" className="text-[#1ABBB3]">
      rgpd@rebotech.solutions
    </a>.
  </p>

  {/* Botón enviar */}
  <Button
    type="submit"
    className="w-full bg-[#1ABBB3] hover:bg-[#4ED3C2] text-white mt-4"
  >
    Enviar mensaje
  </Button>
</form>
```

---

## 🎨 Diseño Visual

```
┌─────────────────────────────────────────────────────────────┐
│                    PÁGINA DE CONTACTO                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌───────────────────────┐   ┌───────────────────────────┐ │
│  │     FORMULARIO        │   │     INFORMACIÓN           │ │
│  │                       │   │                           │ │
│  │  Nombre              │   │  📧 Email                 │ │
│  │  ┌─────────────────┐ │   │     farmafacil@...        │ │
│  │  │                 │ │   │                           │ │
│  │  └─────────────────┘ │   │  📞 Teléfono              │ │
│  │                       │   │     +34 647 734 564       │ │
│  │  Email               │   │                           │ │
│  │  ┌─────────────────┐ │   │  📍 Oficina               │ │
│  │  │                 │ │   │     Marina de Empresas    │ │
│  │  └─────────────────┘ │   │                           │ │
│  │                       │   ├───────────────────────────┤ │
│  │  Teléfono            │   │  💬 WhatsApp Business     │ │
│  │  ┌─────────────────┐ │   │     [Abrir WhatsApp]      │ │
│  │  │                 │ │   │                           │ │
│  │  └─────────────────┘ │   ├───────────────────────────┤ │
│  │                       │   │  📅 Calendly (farmacias) │ │
│  │  Soy...              │   │     [Ver calendario]      │ │
│  │  ┌─────────────────┐ │   │                           │ │
│  │  │ Selecciona...   │ │   └───────────────────────────┘ │
│  │  └─────────────────┘ │                                 │
│  │                       │                                 │
│  │  Mensaje             │                                 │
│  │  ┌─────────────────┐ │                                 │
│  │  │                 │ │                                 │
│  │  │                 │ │                                 │
│  │  └─────────────────┘ │                                 │
│  │                       │                                 │
│  │  ☐ Acepto RGPD       │                                 │
│  │                       │                                 │
│  │  [  Enviar mensaje ] │                                 │
│  │                       │                                 │
│  └───────────────────────┘                                 │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## ✅ Checklist

- [x] Campos de formulario
- [x] Validación HTML5
- [x] Checkbox RGPD
- [x] Estilos Tailwind
- [x] Responsive design
- [x] Información lateral

---

*Paso 1 de Milestone 9 - Sistema de Contacto*

