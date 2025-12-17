# 📅 Milestone 5.4: Sistema de Citas

## 📑 Índice de Pasos

1. [Paso 1: API de disponibilidad](#paso-1-api-de-disponibilidad)
2. [Paso 2: API de reserva](#paso-2-api-de-reserva)
3. [Paso 3: Calendario de selección](#paso-3-calendario-de-selección)
4. [Paso 4: Formulario de cita](#paso-4-formulario-de-cita)
5. [Paso 5: Confirmación y recordatorios](#paso-5-confirmación-y-recordatorios)

---

## Implementación

### APIs implementadas
| Endpoint | Descripción |
|----------|-------------|
| `GET /api/cita/disponibilidad` | Obtener horas disponibles |
| `POST /api/cita/reservar` | Reservar una cita |

### Flujo de reserva
```
1. Usuario selecciona farmacia
2. Selecciona fecha en calendario
3. Ve horas disponibles
4. Selecciona hora
5. Completa datos (nombre, teléfono, motivo)
6. Confirma reserva
7. Recibe confirmación
```

### Estructura de cita
```typescript
interface Cita {
  id: string
  farmacia_id: string
  cliente_id?: string
  fecha: string
  hora: string
  nombre: string
  telefono: string
  motivo: string
  estado: 'pendiente' | 'confirmada' | 'cancelada'
}
```

---

## ✅ Checklist de Completado

- [x] API de disponibilidad
- [x] API de reserva
- [x] Calendario de selección
- [x] Formulario completo
- [x] Sistema de confirmación

---

[← Anterior: 5.3 Detección](../5.3_Deteccion_Cliente/README.md) | [Siguiente: 5.5 Selección →](../5.5_Seleccion_Farmacia/README.md)

