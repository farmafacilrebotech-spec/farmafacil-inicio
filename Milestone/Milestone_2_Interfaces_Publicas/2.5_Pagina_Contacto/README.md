# 📞 Milestone 2.5: Página de Contacto

## 📑 Índice de Pasos

1. [Paso 1: Estructura de la página](#paso-1-estructura-de-la-página)
2. [Paso 2: Formulario de contacto](#paso-2-formulario-de-contacto)
3. [Paso 3: API de contacto](#paso-3-api-de-contacto)
4. [Paso 4: Información de contacto](#paso-4-información-de-contacto)
5. [Paso 5: Validación y feedback](#paso-5-validación-y-feedback)

---

## Paso 1: Estructura de la página

### Descripción
Diseño de la estructura de la página de contacto con formulario e información.

### Archivo: `app/contacto/page.tsx`
```typescript
import { Metadata } from 'next'
import { ContactForm } from '@/components/contact/ContactForm'
import { ContactInfo } from '@/components/contact/ContactInfo'
import { Mail, Phone, MapPin, Clock } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Contacto',
  description: 'Contacta con FarmaFácil. Estamos aquí para ayudarte.'
}

export default function ContactoPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            ¿Cómo podemos ayudarte?
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Estamos aquí para resolver tus dudas. Rellena el formulario 
            y te responderemos lo antes posible.
          </p>
        </div>

        {/* Grid: Formulario + Info */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Formulario (2/3) */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm p-8">
              <h2 className="text-xl font-semibold mb-6">
                Envíanos un mensaje
              </h2>
              <ContactForm />
            </div>
          </div>

          {/* Info (1/3) */}
          <div className="space-y-6">
            <ContactInfo />
          </div>
        </div>
      </div>
    </div>
  )
}
```

### Layout
- Grid de 3 columnas en desktop
- 2 columnas para formulario
- 1 columna para información de contacto

### Resultado
✅ Estructura de página definida

---

## Paso 2: Formulario de contacto

### Descripción
Formulario funcional para envío de consultas.

### Implementación
```typescript
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import { Loader2, Send, CheckCircle } from 'lucide-react'
import { toast } from 'sonner'

export function ContactForm() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    asunto: '',
    mensaje: ''
  })

  const asuntos = [
    { value: 'consulta', label: 'Consulta general' },
    { value: 'pedido', label: 'Problema con un pedido' },
    { value: 'farmacia', label: 'Soy una farmacia' },
    { value: 'tecnico', label: 'Problema técnico' },
    { value: 'sugerencia', label: 'Sugerencia' },
    { value: 'otro', label: 'Otro' },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/contacto', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (!response.ok) throw new Error('Error al enviar')

      setSuccess(true)
      toast.success('Mensaje enviado correctamente')
      
      // Reset form
      setFormData({
        nombre: '',
        email: '',
        telefono: '',
        asunto: '',
        mensaje: ''
      })

    } catch (error) {
      toast.error('Error al enviar el mensaje. Inténtalo de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="text-center py-12">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          ¡Mensaje enviado!
        </h3>
        <p className="text-gray-600 mb-6">
          Te responderemos en las próximas 24-48 horas.
        </p>
        <Button onClick={() => setSuccess(false)}>
          Enviar otro mensaje
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Campos del formulario */}
    </form>
  )
}
```

### Campos del formulario
```typescript
{/* Grid nombre + email */}
<div className="grid sm:grid-cols-2 gap-4">
  <div className="space-y-2">
    <Label htmlFor="nombre">Nombre completo *</Label>
    <Input
      id="nombre"
      value={formData.nombre}
      onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
      placeholder="Tu nombre"
      required
    />
  </div>
  <div className="space-y-2">
    <Label htmlFor="email">Email *</Label>
    <Input
      id="email"
      type="email"
      value={formData.email}
      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
      placeholder="tu@email.com"
      required
    />
  </div>
</div>

{/* Grid teléfono + asunto */}
<div className="grid sm:grid-cols-2 gap-4">
  <div className="space-y-2">
    <Label htmlFor="telefono">Teléfono</Label>
    <Input
      id="telefono"
      type="tel"
      value={formData.telefono}
      onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
      placeholder="600 000 000"
    />
  </div>
  <div className="space-y-2">
    <Label>Asunto *</Label>
    <Select 
      value={formData.asunto} 
      onValueChange={(value) => setFormData({ ...formData, asunto: value })}
    >
      <SelectTrigger>
        <SelectValue placeholder="Selecciona un asunto" />
      </SelectTrigger>
      <SelectContent>
        {asuntos.map((asunto) => (
          <SelectItem key={asunto.value} value={asunto.value}>
            {asunto.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
</div>

{/* Mensaje */}
<div className="space-y-2">
  <Label htmlFor="mensaje">Mensaje *</Label>
  <Textarea
    id="mensaje"
    value={formData.mensaje}
    onChange={(e) => setFormData({ ...formData, mensaje: e.target.value })}
    placeholder="¿En qué podemos ayudarte?"
    rows={5}
    required
  />
</div>

{/* Botón */}
<Button 
  type="submit" 
  disabled={loading}
  className="w-full bg-[#1ABBB3] hover:bg-[#158f89]"
>
  {loading ? (
    <>
      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
      Enviando...
    </>
  ) : (
    <>
      <Send className="h-4 w-4 mr-2" />
      Enviar mensaje
    </>
  )}
</Button>
```

### Resultado
✅ Formulario de contacto funcional

---

## Paso 3: API de contacto

### Descripción
Endpoint para procesar el formulario de contacto.

### Archivo: `app/api/contacto/route.ts`
```typescript
import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { nombre, email, telefono, asunto, mensaje } = body

    // Validaciones
    if (!nombre || !email || !asunto || !mensaje) {
      return NextResponse.json(
        { error: 'Todos los campos obligatorios deben estar completos' },
        { status: 400 }
      )
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'El email no es válido' },
        { status: 400 }
      )
    }

    // Guardar en base de datos
    const { data, error } = await supabase
      .from('contactos')
      .insert({
        nombre,
        email,
        telefono: telefono || null,
        asunto,
        mensaje,
        estado: 'pendiente',
        created_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) throw error

    // Opcional: Enviar email de notificación
    // await sendNotificationEmail(data)

    // Opcional: Enviar email de confirmación al usuario
    // await sendConfirmationEmail(email, nombre)

    return NextResponse.json({
      success: true,
      message: 'Mensaje recibido correctamente',
      id: data.id
    })

  } catch (error) {
    console.error('Error en contacto:', error)
    return NextResponse.json(
      { error: 'Error al procesar el mensaje' },
      { status: 500 }
    )
  }
}
```

### Tabla de contactos
```sql
CREATE TABLE contactos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  telefono VARCHAR(20),
  asunto VARCHAR(100) NOT NULL,
  mensaje TEXT NOT NULL,
  estado VARCHAR(50) DEFAULT 'pendiente',
  respuesta TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  responded_at TIMESTAMP WITH TIME ZONE
);
```

### Resultado
✅ API de contacto implementada

---

## Paso 4: Información de contacto

### Descripción
Componente con información de contacto y horarios.

### Implementación
```typescript
import { Mail, Phone, MapPin, Clock, MessageCircle } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export function ContactInfo() {
  const info = [
    {
      icon: Mail,
      title: 'Email',
      content: 'hola@farmafacil.com',
      link: 'mailto:hola@farmafacil.com'
    },
    {
      icon: Phone,
      title: 'Teléfono',
      content: '900 123 456',
      link: 'tel:+34900123456',
      subtitle: 'Llamada gratuita'
    },
    {
      icon: MessageCircle,
      title: 'WhatsApp',
      content: '600 123 456',
      link: 'https://wa.me/34600123456'
    },
    {
      icon: Clock,
      title: 'Horario de atención',
      content: 'Lun - Vie: 9:00 - 20:00',
      subtitle: 'Sáb: 10:00 - 14:00'
    },
    {
      icon: MapPin,
      title: 'Oficina central',
      content: 'Calle Ejemplo, 123',
      subtitle: '28001 Madrid, España'
    }
  ]

  return (
    <>
      {/* Tarjetas de información */}
      {info.map((item, index) => (
        <Card key={index}>
          <CardContent className="p-4 flex items-start gap-4">
            <div className="p-2 rounded-lg bg-[#1ABBB3]/10 text-[#1ABBB3]">
              <item.icon className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">
                {item.title}
              </h3>
              {item.link ? (
                <a 
                  href={item.link}
                  className="text-[#1ABBB3] hover:underline"
                >
                  {item.content}
                </a>
              ) : (
                <p className="text-gray-600">{item.content}</p>
              )}
              {item.subtitle && (
                <p className="text-sm text-gray-500">{item.subtitle}</p>
              )}
            </div>
          </CardContent>
        </Card>
      ))}

      {/* FAQ Link */}
      <Card className="bg-gray-50">
        <CardContent className="p-6 text-center">
          <h3 className="font-semibold text-gray-900 mb-2">
            ¿Tienes preguntas frecuentes?
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Consulta nuestra sección de ayuda antes de contactar.
          </p>
          <Button variant="outline" asChild>
            <a href="/ayuda">Ver FAQ</a>
          </Button>
        </CardContent>
      </Card>
    </>
  )
}
```

### Resultado
✅ Información de contacto visible y accesible

---

## Paso 5: Validación y feedback

### Descripción
Sistema de validación de formulario y feedback visual.

### Validación en cliente
```typescript
const [errors, setErrors] = useState<Record<string, string>>({})

const validateForm = () => {
  const newErrors: Record<string, string> = {}

  if (!formData.nombre.trim()) {
    newErrors.nombre = 'El nombre es obligatorio'
  }

  if (!formData.email.trim()) {
    newErrors.email = 'El email es obligatorio'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    newErrors.email = 'El email no es válido'
  }

  if (!formData.asunto) {
    newErrors.asunto = 'Selecciona un asunto'
  }

  if (!formData.mensaje.trim()) {
    newErrors.mensaje = 'El mensaje es obligatorio'
  } else if (formData.mensaje.length < 10) {
    newErrors.mensaje = 'El mensaje debe tener al menos 10 caracteres'
  }

  setErrors(newErrors)
  return Object.keys(newErrors).length === 0
}

// En el submit
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  
  if (!validateForm()) {
    toast.error('Por favor, corrige los errores del formulario')
    return
  }
  
  // ... resto del submit
}
```

### Feedback visual de errores
```typescript
<div className="space-y-2">
  <Label htmlFor="email" className={errors.email ? 'text-red-500' : ''}>
    Email *
  </Label>
  <Input
    id="email"
    type="email"
    value={formData.email}
    onChange={(e) => {
      setFormData({ ...formData, email: e.target.value })
      if (errors.email) {
        setErrors({ ...errors, email: '' })
      }
    }}
    className={errors.email ? 'border-red-500 focus:ring-red-500' : ''}
    placeholder="tu@email.com"
  />
  {errors.email && (
    <p className="text-sm text-red-500">{errors.email}</p>
  )}
</div>
```

### Estados de feedback
| Estado | Visual | Mensaje |
|--------|--------|---------|
| Inicial | Formulario vacío | - |
| Error campo | Borde rojo + texto | "El campo es obligatorio" |
| Enviando | Spinner + disabled | "Enviando..." |
| Éxito | Checkmark verde | "Mensaje enviado" |
| Error servidor | Toast rojo | "Error al enviar" |

### Resultado
✅ Validación completa con feedback visual

---

## 📁 Archivos Relacionados

| Archivo | Descripción |
|---------|-------------|
| `app/contacto/page.tsx` | Página de contacto |
| `app/api/contacto/route.ts` | API de contacto |
| `components/contact/ContactForm.tsx` | Formulario |
| `components/contact/ContactInfo.tsx` | Info de contacto |

---

## ✅ Checklist de Completado

- [x] Estructura de página definida
- [x] Formulario funcional implementado
- [x] API de contacto creada
- [x] Información de contacto visible
- [x] Validación y feedback implementados

---

[← Anterior: 2.4 Páginas Info](../2.4_Paginas_Informacion/README.md) | [Siguiente: Milestone 3 →](../../Milestone_3_Sistema_Cliente/README.md)

