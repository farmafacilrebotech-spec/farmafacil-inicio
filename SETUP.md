# FarmaFácil - Guía de Configuración

## Descripción
FarmaFácil es una plataforma SaaS completa para digitalizar farmacias, desarrollada con Next.js 14, TypeScript, Tailwind CSS y Supabase.

## Características Principales

### Frontend
- Landing page profesional con propuesta de valor
- Sistema de autenticación (farmacias y clientes)
- Catálogo de productos con búsqueda y filtros
- Panel de administración para farmacias
- Asistente virtual con IA
- Sistema de pedidos
- Diseño responsive con colores de marca

### Backend
- API Routes completas en Next.js
- Integración con Supabase (base de datos PostgreSQL)
- Autenticación segura
- CRUD completo de productos
- Sistema de pedidos
- Chat con IA (OpenAI GPT-4o-mini)

## Configuración Inicial

### 1. Variables de Entorno

Renombra `.env.local` y configura las siguientes variables con tus credenciales reales:

```bash
NEXT_PUBLIC_SUPABASE_URL=tu_supabase_url_aqui
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_supabase_anon_key_aqui
OPENAI_API_KEY=tu_openai_api_key_aqui
```

### 2. Configurar Supabase

1. Crea una cuenta en [Supabase](https://supabase.com)
2. Crea un nuevo proyecto
3. La base de datos ya tiene el esquema aplicado con las migraciones
4. Obtén tus credenciales:
   - URL del proyecto
   - Anon/Public Key
5. Actualiza las variables en `.env.local`

### 3. Configurar OpenAI (Opcional)

1. Crea una cuenta en [OpenAI](https://platform.openai.com)
2. Genera una API Key
3. Actualiza `OPENAI_API_KEY` en `.env.local`
4. Si no configuras OpenAI, el asistente funcionará en modo demo

### 4. Instalar y Ejecutar

```bash
# Instalar dependencias
npm install

# Modo desarrollo
npm run dev

# Compilar para producción
npm run build

# Iniciar producción
npm run start
```

## Estructura de la Base de Datos

### Tablas Principales

- **farmacias**: Información de las farmacias registradas
- **clientes**: Datos de los clientes
- **productos**: Catálogo de productos de cada farmacia
- **pedidos**: Órdenes realizadas
- **detalles_pedido**: Items de cada pedido
- **conversaciones**: Historial del chat con IA

## Rutas de la Aplicación

### Públicas
- `/` - Landing page
- `/catalogo` - Catálogo de productos
- `/contacto` - Página de contacto
- `/login` - Inicio de sesión
- `/register` - Registro de usuarios

### Protegidas
- `/dashboard` - Panel de control (solo farmacias)
- `/asistente` - Chat con asistente IA
- `/pedidos` - Historial de pedidos (solo clientes)

### API Routes
- `/api/auth/login` - Autenticación
- `/api/auth/register` - Registro
- `/api/products/*` - CRUD de productos
- `/api/orders/*` - Gestión de pedidos
- `/api/assistant/chat` - Chat con IA

## Colores de Marca

- **Aguamarina**: `#4ED3C2`
- **Turquesa**: `#1ABBB3`
- **Blanco**: `#FFFFFF`
- **Gris claro**: `#F7F9FA`
- **Texto oscuro**: `#1A1A1A`

## Credenciales de Demo

Para pruebas, puedes crear usuarios de prueba:

**Farmacia:**
- Email: farmacia@demo.com
- Password: demo123456

**Cliente:**
- Email: cliente@demo.com
- Password: demo123456

## Próximos Pasos

1. Configurar variables de entorno reales
2. Agregar datos de prueba en Supabase
3. Personalizar el logo y colores (opcional)
4. Configurar dominio personalizado
5. Implementar pasarela de pagos (Stripe)
6. Añadir más categorías de productos
7. Implementar notificaciones por email

## Soporte

Para más información o soporte técnico:
- Email: farmafacil.rebotech@gmail.com
- Website: www.farmafacil.es

## Tecnologías Utilizadas

- **Framework**: Next.js 14 (App Router)
- **Lenguaje**: TypeScript
- **Estilos**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Base de datos**: Supabase (PostgreSQL)
- **Autenticación**: Supabase Auth
- **IA**: OpenAI GPT-4o-mini
- **Iconos**: Lucide React

---

Desarrollado por ReBoTech Solutions para la demo de Lanzadera.
