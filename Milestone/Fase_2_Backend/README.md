# 📦 FASE 2: BACKEND - Supabase, QRs y APIs

## 📋 Índice General

Esta fase documenta la integración con **Supabase**, el sistema de **QRs para farmacias**, la **autenticación backend**, el **sistema de contacto/demo**, y la preparación del **catálogo genérico con carrito inteligente**.

---

## 🗂️ Estructura de Milestones

| Milestone | Descripción | Estado |
|-----------|-------------|--------|
| [6. Configuración Supabase](./Milestone_6_Supabase/) | Conexión, configuración y estructura de base de datos | 🟡 En progreso |
| [7. Sistema QR Farmacias](./Milestone_7_QR_Farmacias/) | Mapeo QR-Farmacia y generación de códigos | 🟡 En progreso |
| [8. Autenticación Backend](./Milestone_8_Auth_Backend/) | Autenticación real de farmacias con Supabase | 🔴 Pendiente |
| [9. Sistema Contacto/Demo](./Milestone_9_Contacto_Demo/) | API de contacto y reserva de citas para farmacias | 🟢 Completado |
| [10. Catálogo Genérico](./Milestone_10_Catalogo_Generico/) | Catálogo público y carrito con farmacia cercana | 🟡 En preparación |

---

## 🎯 Objetivos de la Fase 2

### 1. **Supabase como Backend**
- Conexión segura desde cliente Next.js
- Estructura de tablas optimizada
- Row Level Security (RLS) para protección de datos

### 2. **Sistema QR**
- Mapeo único: `codigo_farmacia` → URL del catálogo
- Generación de QR con `qrcode.react`
- Almacenamiento en tabla `farmacias`

### 3. **Autenticación Real**
- Login/registro de farmacias con Supabase Auth
- Sesiones seguras con cookies HttpOnly
- Middleware de protección de rutas

### 4. **Sistema de Contacto**
- API que envía datos a Google Sheets
- Integración con Calendly para demos
- Formulario con validación RGPD

### 5. **Catálogo Genérico**
- Catálogo sin farmacia específica
- Carrito que asigna farmacia más cercana
- Geolocalización del cliente

---

## 📊 Diagrama de Arquitectura Backend

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENTE (Next.js)                        │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │   Catálogo   │  │  Selección   │  │      Contacto        │  │
│  │   Genérico   │  │   Farmacia   │  │   (Google Sheets)    │  │
│  └──────┬───────┘  └──────┬───────┘  └──────────┬───────────┘  │
│         │                 │                      │              │
│         ▼                 ▼                      ▼              │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    API Routes (Next.js)                   │  │
│  │  /api/products  /api/farmacias  /api/contacto  /api/auth  │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                         SUPABASE                                │
├─────────────────────────────────────────────────────────────────┤
│  ┌────────────────────────────────────────────────────────┐    │
│  │                    TABLAS                               │    │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌────────┐  │    │
│  │  │farmacias │  │productos │  │ pedidos  │  │clientes│  │    │
│  │  │          │  │          │  │          │  │        │  │    │
│  │  │- id      │  │- id      │  │- id      │  │- id    │  │    │
│  │  │- codigo  │  │- nombre  │  │- cliente │  │- email │  │    │
│  │  │- nombre  │  │- precio  │  │- farmacia│  │- nombre│  │    │
│  │  │- qr_url  │  │- stock   │  │- estado  │  │        │  │    │
│  │  └──────────┘  └──────────┘  └──────────┘  └────────┘  │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                 │
│  ┌────────────────────────────────────────────────────────┐    │
│  │                    AUTH                                 │    │
│  │  - Supabase Auth para farmacias                        │    │
│  │  - Row Level Security (RLS)                            │    │
│  │  - JWT tokens                                          │    │
│  └────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🚀 Próximos Pasos

1. Completar configuración de Supabase
2. Crear tablas con migraciones
3. Implementar autenticación real
4. Conectar catálogo con base de datos
5. Sistema de geolocalización para farmacia cercana

---

## 📝 Notas Importantes

- El **asistente virtual** se ha movido exclusivamente al catálogo
- La **página principal** ya no tiene componentes flotantes
- El **carrito inteligente** está preparado para integración con geolocalización
- El sistema de **contacto** ya está operativo con Google Sheets

---

*Documentación generada para FarmaFácil - ReboTech Solutions*
*Última actualización: Diciembre 2024*

