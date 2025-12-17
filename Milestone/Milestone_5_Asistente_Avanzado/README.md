# 🤖 Milestone 5: Asistente Virtual y Funcionalidades Avanzadas

## 📑 Índice

| Sub-Milestone | Descripción | Archivos Clave |
|---------------|-------------|----------------|
| [5.1](./5.1_Componente_Asistente/README.md) | Componente del asistente | `components/assistants/` |
| [5.2](./5.2_Integracion_Chat/README.md) | Integración del chat con IA | `app/api/assistant/chat/` |
| [5.3](./5.3_Deteccion_Cliente/README.md) | Detección de cliente logueado | `FloatingAssistantButton.tsx` |
| [5.4](./5.4_Sistema_Citas/README.md) | Sistema de citas | `app/api/cita/` |
| [5.5](./5.5_Seleccion_Farmacia/README.md) | Selección de farmacia con QR | `app/seleccion-farmacia/`, `qrcode.react` |

---

## 🎯 Objetivo del Milestone

Implementar el asistente virtual y funcionalidades avanzadas:
- Botón flotante de asistente
- Chat con IA (OpenAI GPT-4)
- Detección automática de cliente logueado
- Sistema de reserva de citas
- Selección de farmacia preferida

---

## 📊 Métricas

| Métrica | Valor |
|---------|-------|
| Componentes | 4 |
| APIs | 3 |
| Integraciones | OpenAI |
| Tiempo estimado | 2 días |
| Prioridad | Media |

---

## 🔄 Flujo del Asistente

```
Usuario abre asistente
         │
         ▼
┌─────────────────┐
│ ¿Está logueado? │
└────────┬────────┘
    Sí   │   No
    ▼    │    ▼
┌───────┐│┌──────────┐
│Asociar││ │Conversación│
│cliente││ │anónima   │
└───────┘│└──────────┘
         │
         ▼
┌─────────────────┐
│  Enviar mensaje │
│     a OpenAI    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Guardar en BD  │
│ (si hay cliente)│
└─────────────────┘
```

---

## ✅ Criterios de Aceptación

- [ ] Botón flotante visible en todas las páginas
- [ ] Chat funcional con respuestas de IA
- [ ] Conversaciones guardadas para clientes
- [ ] Sistema de citas operativo
- [ ] Selección de farmacia funcional

---

[← Volver al índice](../README.md) | [Anterior: Milestone 4 ←](../Milestone_4_Sistema_Farmacia/README.md)

