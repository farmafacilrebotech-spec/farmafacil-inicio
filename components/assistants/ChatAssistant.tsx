"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Loader2, Bot, User, X } from "lucide-react"; // 👈 añadimos X
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface ChatAssistantProps {
  farmaciaId: string;
  clienteId?: string;
  onClose?: () => void; // 👈 nueva prop para cerrar
}

export default function ChatAssistant({
  farmaciaId,
  clienteId,
  onClose,
}: ChatAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hola! Soy tu asistente virtual. ¿En qué puedo ayudarte hoy?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/assistant/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          farmacia_id: farmaciaId,
          cliente_id: clienteId,
          mensaje: input,
        }),
      });

      const data = await response.json();

      if (data.success) {
        const assistantMessage: Message = {
          role: "assistant",
          content: data.respuesta,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, assistantMessage]);
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage: Message = {
        role: "assistant",
        content:
          "Lo siento, hubo un error al procesar tu mensaje. Por favor, intenta de nuevo.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div
      className="
        fixed bottom-4 right-6 z-50
        flex flex-col
        bg-white rounded-lg shadow-2xl
        w-[90vw] max-w-[420px]
        sm:w-[380px]
        border border-gray-200
        overflow-hidden
        transition-all duration-300 ease-in-out
      "
      style={{
        maxHeight: "calc(100vh - 100px)",
      }}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-[#4ED3C2] to-[#1ABBB3] p-4 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center space-x-2">
          <Bot className="h-6 w-6 text-white" />
          <h3 className="text-white font-semibold">Asistente Virtual</h3>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-full hover:bg-white/20 transition"
          aria-label="Cerrar asistente"
        >
          <X className="h-5 w-5 text-white" />
        </button>
      </div>

      {/* Messages Area */}
      <ScrollArea
        className="flex-1 p-4 overflow-y-auto scroll-smooth"
        ref={scrollRef}
      >
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`flex items-start space-x-2 max-w-[80%] ${
                  message.role === "user"
                    ? "flex-row-reverse space-x-reverse"
                    : ""
                }`}
              >
                <div
                  className={`p-2 rounded-full ${
                    message.role === "user"
                      ? "bg-[#1ABBB3]"
                      : "bg-gray-200"
                  }`}
                >
                  {message.role === "user" ? (
                    <User className="h-4 w-4 text-white" />
                  ) : (
                    <Bot className="h-4 w-4 text-[#1ABBB3]" />
                  )}
                </div>
                <div>
                  <div
                    className={`p-3 rounded-lg ${
                      message.role === "user"
                        ? "bg-[#1ABBB3] text-white"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{message.content}</p>
                  </div>
                  <span className="text-xs text-gray-400 mt-1 block">
                    {message.timestamp.toLocaleTimeString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex items-center space-x-2 bg-gray-100 p-3 rounded-lg">
                <Loader2 className="h-4 w-4 animate-spin text-[#1ABBB3]" />
                <span className="text-sm text-gray-600">Escribiendo...</span>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="p-3 border-t bg-white sticky bottom-0 flex-shrink-0">
        <div className="flex space-x-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Escribe tu mensaje..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="bg-[#1ABBB3] hover:bg-[#4ED3C2] text-white"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
