# 👤 Milestone 3: Sistema de Cliente

## 📑 Índice

| Sub-Milestone | Descripción | Archivos Clave |
|---------------|-------------|----------------|
| [3.1](./3.1_Login_Registro_Cliente/README.md) | Login y registro de cliente | `app/login-cliente/`, `app/register/` |
| [3.2](./3.2_Dashboard_Cliente/README.md) | Dashboard del cliente | `app/cliente/dashboard/page.tsx` |
| [3.3](./3.3_Sistema_Carrito/README.md) | Sistema de carrito | `lib/cart.ts`, `components/cart/` |
| [3.4](./3.4_Proceso_Checkout/README.md) | Proceso de checkout | `app/checkout/page.tsx` |
| [3.5](./3.5_Historial_Pedidos/README.md) | Historial de pedidos | `app/pedidos/[id]/page.tsx` |

---

## 🎯 Objetivo del Milestone

Implementar toda la experiencia del cliente:
- Autenticación segura (registro y login)
- Dashboard personalizado con estadísticas
- Carrito de compras funcional
- Proceso de checkout completo
- Historial de pedidos con funcionalidad de repetir

---

## 📊 Métricas

| Métrica | Valor |
|---------|-------|
| Páginas creadas | 6 |
| Componentes | 8 |
| Hooks | 1 |
| APIs | 3 |
| Tiempo estimado | 3 días |
| Prioridad | Crítica |

---

## 🔄 Flujo de Usuario

```
                    ┌─────────────┐
                    │   Inicio    │
                    └──────┬──────┘
                           │
              ┌────────────┼────────────┐
              ▼            ▼            ▼
        ┌──────────┐ ┌──────────┐ ┌──────────┐
        │ Registro │ │  Login   │ │ Catálogo │
        └────┬─────┘ └────┬─────┘ └────┬─────┘
             │            │            │
             └────────────┼────────────┘
                          ▼
                   ┌──────────────┐
                   │   Carrito    │
                   └──────┬───────┘
                          │
                          ▼
                   ┌──────────────┐
                   │   Checkout   │
                   └──────┬───────┘
                          │
                          ▼
                   ┌──────────────┐
                   │  Dashboard   │
                   │  (Pedidos)   │
                   └──────────────┘
```

---

## ✅ Criterios de Aceptación

- [ ] Cliente puede registrarse
- [ ] Cliente puede iniciar sesión
- [ ] Carrito persiste en localStorage
- [ ] Checkout procesa pedidos correctamente
- [ ] Pedidos se muestran en dashboard
- [ ] Funcionalidad "Repetir Pedido" operativa

---

[← Volver al índice principal](../README.md) | [Anterior: Milestone 2 ←](../Milestone_2_Interfaces_Publicas/README.md) | [Siguiente: Milestone 4 →](../Milestone_4_Sistema_Farmacia/README.md)

