# 🔒 9.5 Validación RGPD

## 📋 Cumplimiento de Protección de Datos

### Requisitos RGPD Implementados

| Requisito | Estado | Implementación |
|-----------|--------|----------------|
| Consentimiento explícito | ✅ | Checkbox obligatorio |
| Información clara | ✅ | Texto descriptivo |
| Derecho de acceso | ✅ | Email de contacto |
| Finalidad específica | ✅ | Texto informativo |
| Responsable identificado | ✅ | ReboTech Solutions |

---

## 📝 Implementación en Formulario

### Checkbox de Consentimiento

```tsx
<div className="flex items-start space-x-2 mt-4">
  <input
    type="checkbox"
    checked={formData.aceptarRGPD}
    onChange={(e) =>
      setFormData({ ...formData, aceptarRGPD: e.target.checked })
    }
    className="mt-1"
    required  // Obligatorio
  />
  <label className="text-sm text-gray-600">
    He leído y acepto la{" "}
    <a
      href="/politica-privacidad"
      className="text-[#1ABBB3] hover:underline"
      target="_blank"
    >
      política de protección de datos
    </a>.
  </label>
</div>
```

### Texto Informativo

```tsx
<p className="text-xs text-gray-500">
  Tus datos serán tratados por <b>ReboTech Solutions</b> con la finalidad
  de gestionar tu solicitud e informarte sobre productos o futuros programas de
  aceleración. Puedes ejercer tus derechos escribiendo a{" "}
  <a
    href="mailto:rgpd@rebotech.solutions"
    className="text-[#1ABBB3] hover:underline"
  >
    rgpd@rebotech.solutions
  </a>.
</p>
```

---

## 🔐 Validación en Cliente

```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  // Verificar consentimiento RGPD
  if (!formData.aceptarRGPD) {
    toast({
      title: "Debes aceptar la política de datos",
      description: "Por favor, marca la casilla antes de enviar.",
      variant: "destructive",
    });
    return;
  }

  // Continuar con envío...
};
```

---

## 📄 Información Requerida

### En el Formulario

```
┌─────────────────────────────────────────────────────────────┐
│                    INFORMACIÓN RGPD                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. CONSENTIMIENTO                                          │
│     ☐ He leído y acepto la política de protección de datos │
│                                                             │
│  2. INFORMACIÓN DEL RESPONSABLE                             │
│     "Tus datos serán tratados por ReboTech Solutions..."   │
│                                                             │
│  3. FINALIDAD                                               │
│     "...con la finalidad de gestionar tu solicitud e       │
│      informarte sobre productos..."                         │
│                                                             │
│  4. DERECHOS                                                │
│     "Puedes ejercer tus derechos escribiendo a             │
│      rgpd@rebotech.solutions"                               │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 📋 Página de Política de Privacidad

### Estructura Recomendada

```markdown
# Política de Privacidad

## 1. Responsable del Tratamiento
- Nombre: ReboTech Solutions S.L.
- CIF: B-XXXXXXXX
- Dirección: Calle Marina de Empresas, 46024 Valencia
- Email: rgpd@rebotech.solutions

## 2. Datos que Recopilamos
- Nombre y apellidos
- Email
- Teléfono (opcional)
- Tipo de usuario
- Mensaje

## 3. Finalidad del Tratamiento
- Gestionar solicitudes de contacto
- Enviar información sobre servicios
- Agendar demos (farmacias)

## 4. Base Legal
- Consentimiento explícito del interesado (Art. 6.1.a RGPD)

## 5. Destinatarios
- Los datos se almacenan en Google Sheets (Google LLC)
- No se ceden a terceros sin consentimiento

## 6. Conservación
- Los datos se conservan mientras dure la relación comercial
- Máximo 2 años desde el último contacto

## 7. Derechos del Usuario
- Acceso a sus datos
- Rectificación
- Supresión
- Portabilidad
- Oposición
- Limitación del tratamiento

## 8. Cómo Ejercer tus Derechos
Escribiendo a: rgpd@rebotech.solutions
Adjuntando copia del DNI

## 9. Reclamaciones
Puedes presentar reclamación ante la AEPD:
www.aepd.es
```

---

## 🔄 Flujo de Cumplimiento

```
┌─────────────────────────────────────────────────────────────┐
│                FLUJO RGPD                                   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. ANTES DEL ENVÍO                                         │
│     ┌─────────────────────────────────────────────────┐    │
│     │  ✅ Información clara visible                   │    │
│     │  ✅ Link a política de privacidad               │    │
│     │  ☐ Checkbox de consentimiento (sin marcar)      │    │
│     └─────────────────────────────────────────────────┘    │
│                           │                                 │
│                           ▼                                 │
│  2. VALIDACIÓN                                              │
│     ┌─────────────────────────────────────────────────┐    │
│     │  if (!aceptarRGPD) {                            │    │
│     │    mostrarError("Debes aceptar...")             │    │
│     │    return;                                      │    │
│     │  }                                              │    │
│     └─────────────────────────────────────────────────┘    │
│                           │                                 │
│                           ▼                                 │
│  3. ALMACENAMIENTO                                          │
│     ┌─────────────────────────────────────────────────┐    │
│     │  Datos guardados en Google Sheets               │    │
│     │  (procesador de datos: Google LLC)              │    │
│     └─────────────────────────────────────────────────┘    │
│                           │                                 │
│                           ▼                                 │
│  4. GESTIÓN DE DERECHOS                                     │
│     ┌─────────────────────────────────────────────────┐    │
│     │  Usuario escribe a rgpd@rebotech.solutions      │    │
│     │  → Acceso / Rectificación / Supresión           │    │
│     └─────────────────────────────────────────────────┘    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## ✅ Checklist RGPD

- [x] Checkbox de consentimiento obligatorio
- [x] Link a política de privacidad
- [x] Texto informativo claro
- [x] Responsable identificado (ReboTech)
- [x] Finalidad especificada
- [x] Email para ejercer derechos
- [x] Validación en cliente
- [ ] Página de política de privacidad
- [ ] Registro de consentimientos

---

*Paso 5 de Milestone 9 - Sistema de Contacto*

