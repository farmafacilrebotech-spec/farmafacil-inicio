# 🔐 Milestone 4.1: Login y Registro de Farmacia

## 📑 Índice de Pasos

1. [Paso 1: Página de registro](#paso-1-página-de-registro)
2. [Paso 2: Campos específicos](#paso-2-campos-específicos)
3. [Paso 3: Página de login](#paso-3-página-de-login)
4. [Paso 4: Validaciones](#paso-4-validaciones)
5. [Paso 5: Redirección post-login](#paso-5-redirección-post-login)

---

## Implementación

### Campos del registro de farmacia
| Campo | Tipo | Obligatorio |
|-------|------|-------------|
| Nombre de farmacia | text | ✅ |
| Email | email | ✅ |
| Contraseña | password | ✅ |
| Teléfono | tel | ✅ |
| WhatsApp | tel | ❌ |
| Dirección | text | ✅ |
| Ciudad | text | ✅ |
| Código postal | text | ✅ |
| CIF | text | ✅ |

### Login de farmacia
Similar al login de cliente pero con redirección a `/dashboard` (panel de farmacia).

---

## ✅ Checklist de Completado

- [x] Formulario de registro con campos específicos
- [x] Validación de CIF
- [x] Página de login separada
- [x] Validaciones completas
- [x] Redirección a dashboard de farmacia

---

[← Volver a Milestone 4](../README.md) | [Siguiente: 4.2 Dashboard →](../4.2_Dashboard_Farmacia/README.md)

