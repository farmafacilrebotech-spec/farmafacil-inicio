"use client";

import { useState, useEffect } from "react";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import ChatAssistant from "@/components/assistants/ChatAssistant";
import { supabase } from "@/lib/supabaseClient";
import { motion, AnimatePresence } from "framer-motion";

export default function FloatingAssistantButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [clienteId, setClienteId] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    checkClienteAuth();
  }, []);

  // Cerrar con tecla ESC
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    if (isOpen) window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);

  // Comprobar cliente autenticado (Supabase)
  const checkClienteAuth = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { data: cliente } = await supabase
          .from("clientes")
          .select("id")
          .eq("user_id", user.id)
          .single();

        if (cliente?.id) setClienteId(cliente.id as string);
      }
    } catch (error) {
      console.error("Error checking auth:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Detectar si el carrito está abierto (ajustar posición del botón)
  useEffect(() => {
    const observer = new MutationObserver(() => {
      const cart = document.querySelector(".cart-sidebar");
      if (cart && cart.classList.contains("open")) {
        setIsCartOpen(true);
      } else {
        setIsCartOpen(false);
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* Fondo con blur al abrir el chat */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[2px]"
            onClick={() => setIsOpen(false)} // cerrar si toca fuera del chat
          />
        )}
      </AnimatePresence>

      {/* Botón flotante (solo visible si el chat está cerrado) */}
      {!isOpen && (
        <div
          className={`fixed right-6 z-50 transition-all duration-300 ${
            isCartOpen ? "bottom-32" : "bottom-6"
          }`}
        >
          <Button
            onClick={() => setIsOpen(true)}
            className="h-14 w-14 rounded-full bg-gradient-to-r from-[#4ED3C2] to-[#1ABBB3] hover:from-[#1ABBB3] hover:to-[#4ED3C2] shadow-lg hover:shadow-xl transition-all"
            aria-label="Abrir asistente"
          >
            <MessageCircle className="h-6 w-6 text-white" />
          </Button>
        </div>
      )}

      {/* Chat Assistant (animado con Framer Motion) */}
      <AnimatePresence>
        {isOpen && !isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className={`fixed right-6 z-50 transition-all duration-300 ${
              isCartOpen ? "bottom-32" : "bottom-6"
            }`}
          >
            <ChatAssistant
              farmaciaId="general"
              clienteId={clienteId}
              onClose={() => setIsOpen(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
