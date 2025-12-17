# 🧠 Milestone 5.2: Integración del Chat con IA

## 📑 Índice de Pasos

1. [Paso 1: API de chat](#paso-1-api-de-chat)
2. [Paso 2: Configuración de OpenAI](#paso-2-configuración-de-openai)
3. [Paso 3: Prompt del sistema](#paso-3-prompt-del-sistema)
4. [Paso 4: Manejo de respuestas](#paso-4-manejo-de-respuestas)
5. [Paso 5: Guardado de conversaciones](#paso-5-guardado-de-conversaciones)

---

## Implementación

### API de chat
```typescript
// app/api/assistant/chat/route.ts
export async function POST(request: NextRequest) {
  const { mensaje, farmacia_id, cliente_id } = await request.json()

  // Llamar a OpenAI
  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: mensaje }
    ]
  })

  // Guardar conversación si hay cliente
  if (cliente_id && farmacia_id !== 'general') {
    await supabase.from('conversaciones_asistente').insert({
      farmacia_id,
      cliente_id,
      mensaje_usuario: mensaje,
      respuesta_ia: response.choices[0].message.content
    })
  }

  return NextResponse.json({ respuesta: response.choices[0].message.content })
}
```

### Prompt del sistema
```
Eres un asistente virtual de FarmaFácil, una plataforma de farmacias 
online. Tu objetivo es ayudar a los usuarios con:
- Información sobre productos
- Estado de pedidos
- Horarios de farmacias
- Consultas generales de salud (sin diagnósticos)

Responde de forma amable, clara y profesional. Si no conoces la 
respuesta, sugiere contactar directamente con la farmacia.
```

---

## ✅ Checklist de Completado

- [x] API de chat implementada
- [x] OpenAI configurado
- [x] Prompt del sistema definido
- [x] Respuestas manejadas correctamente
- [x] Conversaciones guardadas en BD

---

[← Anterior: 5.1 Componente](../5.1_Componente_Asistente/README.md) | [Siguiente: 5.3 Detección →](../5.3_Deteccion_Cliente/README.md)

