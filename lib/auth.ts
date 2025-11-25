import { supabase } from "./supabaseClient";
import { 
  getFarmaciaSession, 
  getClienteSession, 
  clearSession,
  FarmaciaSession,
  ClienteSession
} from "./sessionManager";

export type UserType = "farmacia" | "cliente";

export interface AuthUser {
  id: string;
  email: string;
  userType: UserType;
  profileId: string;
  profile: any;
}

// ========== FUNCIONES DE AUTENTICACIÓN PERSONALIZADA ==========

/**
 * Verifica si hay una farmacia logueada
 */
export function isFarmaciaLogged(): boolean {
  return getFarmaciaSession() !== null;
}

/**
 * Verifica si hay un cliente logueado
 */
export function isClienteLogged(): boolean {
  return getClienteSession() !== null;
}

/**
 * Obtiene datos de la farmacia actual
 */
export function getFarmacia(): FarmaciaSession | null {
  return getFarmaciaSession();
}

/**
 * Obtiene datos del cliente actual
 */
export function getCliente(): ClienteSession | null {
  return getClienteSession();
}

/**
 * Cierra sesión (farmacia o cliente)
 */
export function logout(): void {
  clearSession();
}

export async function signUp(
  email: string,
  password: string,
  userType: UserType,
  additionalData: {
    nombre: string;
    telefono?: string;
    whatsapp?: string;
    direccion?: string;
  }
) {
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (authError || !authData.user) {
    throw authError || new Error("Failed to create user");
  }

  const tableName = userType === "farmacia" ? "farmacias" : "clientes";
  const { data: profileData, error: profileError } = await supabase
    .from(tableName)
    .insert({
      user_id: authData.user.id,
      email,
      ...additionalData,
    })
    .select()
    .single();

  if (profileError) {
    throw profileError;
  }

  return {
    user: authData.user,
    profile: profileData,
    userType,
  };
}

export async function signIn(email: string, password: string) {
  const { data: authData, error: authError } =
    await supabase.auth.signInWithPassword({
      email,
      password,
    });

  if (authError || !authData.user) {
    throw authError || new Error("Failed to sign in");
  }

  const { data: farmaciaData } = await supabase
    .from("farmacias")
    .select("*")
    .eq("user_id", authData.user.id)
    .single();

  if (farmaciaData) {
    return {
      user: authData.user,
      userType: "farmacia" as UserType,
      profile: farmaciaData,
    };
  }

  const { data: clienteData } = await supabase
    .from("clientes")
    .select("*")
    .eq("user_id", authData.user.id)
    .single();

  if (clienteData) {
    return {
      user: authData.user,
      userType: "cliente" as UserType,
      profile: clienteData,
    };
  }

  throw new Error("User profile not found");
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: farmaciaData } = await supabase
    .from("farmacias")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (farmaciaData) {
    return {
      id: user.id,
      email: user.email!,
      userType: "farmacia",
      profileId: farmaciaData.id,
      profile: farmaciaData,
    };
  }

  const { data: clienteData } = await supabase
    .from("clientes")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (clienteData) {
    return {
      id: user.id,
      email: user.email!,
      userType: "cliente",
      profileId: clienteData.id,
      profile: clienteData,
    };
  }

  return null;
}
