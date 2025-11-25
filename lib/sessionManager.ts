/**
 * Gestión de sesiones personalizadas para FarmaFácil
 * Usa localStorage para mantener sesiones de farmacia y cliente
 */

export interface FarmaciaSession {
  farmacia_id: string;
  email: string;
  nombre?: string;
}

export interface ClienteSession {
  cliente_id: string;
  email: string;
  nombre?: string;
}

// ========== SESIONES DE FARMACIA ==========

export function setFarmaciaSession(session: FarmaciaSession): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('farmacia_session', JSON.stringify(session));
  }
}

export function getFarmaciaSession(): FarmaciaSession | null {
  if (typeof window !== 'undefined') {
    const session = localStorage.getItem('farmacia_session');
    if (session) {
      try {
        return JSON.parse(session);
      } catch (error) {
        console.error('Error parsing farmacia session:', error);
        return null;
      }
    }
  }
  return null;
}

// ========== SESIONES DE CLIENTE ==========

export function setClienteSession(session: ClienteSession): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('cliente_session', JSON.stringify(session));
  }
}

export function getClienteSession(): ClienteSession | null {
  if (typeof window !== 'undefined') {
    const session = localStorage.getItem('cliente_session');
    if (session) {
      try {
        return JSON.parse(session);
      } catch (error) {
        console.error('Error parsing cliente session:', error);
        return null;
      }
    }
  }
  return null;
}

// ========== LIMPIEZA ==========

export function clearSession(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('farmacia_session');
    localStorage.removeItem('cliente_session');
  }
}

export function clearFarmaciaSession(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('farmacia_session');
  }
}

export function clearClienteSession(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('cliente_session');
  }
}

