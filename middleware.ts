import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Obtener sesiones desde cookies (si existen)
  // Nota: localStorage no está disponible en middleware, 
  // por lo que verificamos las rutas protegidas en el lado del cliente
  
  // Solo aplicamos middleware a rutas específicas
  const isFarmaciaRoute = pathname.startsWith('/farmacia/');
  const isClienteRoute = pathname.startsWith('/cliente/');

  // Para rutas de farmacia y cliente, permitimos el acceso
  // La verificación real de sesión se hace en cada página con useEffect
  // porque localStorage solo está disponible en el cliente
  
  if (isFarmaciaRoute || isClienteRoute) {
    // Permitir acceso - la verificación se hace en el componente
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|images|demo|public).*)',
  ],
};

