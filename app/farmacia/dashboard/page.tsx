"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, Package, ShoppingBag, MessageSquare, Loader2, ExternalLink, Monitor, Upload, FileSpreadsheet, CheckCircle2, XCircle } from "lucide-react";
import { getFarmaciaSession, clearFarmaciaSession } from "@/lib/sessionManager";
import { supabase } from "@/lib/supabaseClient";
import { clienteUrl, kioskoUrl } from "@/lib/urlBuilder";

export default function FarmaciaDashboardPage() {
  const router = useRouter();
  const [farmaciaSession, setFarmaciaSession] = useState<any>(null);
  const [farmaciaCodigo, setFarmaciaCodigo] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  
  // Estados para carga de Excel
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<{
    success: boolean;
    inserted?: number;
    updated?: number;
    total?: number;
    error?: string;
    errors?: string[];
  } | null>(null);

  useEffect(() => {
    // Verificar sesión de farmacia
    const session = getFarmaciaSession();
    
    if (!session) {
      router.push("/login-farmacia");
      return;
    }

    setFarmaciaSession(session);
    fetchFarmaciaCodigo(session.farmacia_id);
  }, [router]);

  const fetchFarmaciaCodigo = async (farmaciaId: string) => {
    try {
      const { data, error } = await supabase
        .from("farmacias")
        .select("codigo")
        .eq("id", farmaciaId)
        .single();

      if (error) throw error;

      if (data?.codigo) {
        setFarmaciaCodigo(data.codigo);
      }
    } catch (error) {
      console.error("Error obteniendo código de farmacia:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const openKiosko = () => {
    if (farmaciaCodigo) {
      window.open(kioskoUrl(farmaciaCodigo), "_blank");
    }
  };

  const openCatalogoCliente = () => {
    if (farmaciaCodigo) {
      window.open(clienteUrl(farmaciaCodigo), "_blank");
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setUploadResult(null); // Limpiar resultado anterior
    }
  };

  const handleUploadExcel = async () => {
    if (!selectedFile || !farmaciaSession?.farmacia_id) {
      return;
    }

    setIsUploading(true);
    setUploadResult(null);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('farmacia_id', farmaciaSession.farmacia_id);

      const response = await fetch('/api/catalogo/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setUploadResult({
          success: true,
          inserted: data.inserted,
          updated: data.updated,
          total: data.total,
          errors: data.errors,
        });
        // Limpiar archivo seleccionado
        setSelectedFile(null);
        // Limpiar input
        const input = document.getElementById('excel-input') as HTMLInputElement;
        if (input) input.value = '';
      } else {
        setUploadResult({
          success: false,
          error: data.error || 'Error al procesar el archivo',
          errors: data.errors,
        });
      }
    } catch (error: any) {
      setUploadResult({
        success: false,
        error: error.message || 'Error al subir el archivo',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleLogout = () => {
    clearFarmaciaSession();
    router.push("/login-farmacia");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F7F9FA] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-[#1ABBB3] animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F9FA]">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-[#4ED3C2] to-[#1ABBB3] p-2 rounded-lg">
                <Building2 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-[#1A1A1A]">
                  {farmaciaSession?.nombre || "Farmacia"}
                </h1>
                <p className="text-sm text-gray-600">{farmaciaSession?.email}</p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={handleLogout}
              className="border-red-300 text-red-600 hover:bg-red-50"
            >
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Message */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-[#1A1A1A] mb-2">
            Bienvenido al Panel de Farmacia
          </h2>
          <p className="text-gray-600">
            Gestiona tu catálogo, pedidos y conversaciones desde aquí
          </p>
        </div>

        {/* Botones de acceso rápido a aplicaciones */}
        {farmaciaCodigo && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <Card className="cursor-pointer hover:shadow-lg transition-all border-2 border-[#1ABBB3]" onClick={openKiosko}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-[#1A1A1A] mb-2">
                      Abrir Kiosko
                    </h3>
                    <p className="text-sm text-gray-600">
                      Accede al modo kiosko para tu farmacia
                    </p>
                  </div>
                  <Monitor className="h-12 w-12 text-[#1ABBB3]" />
                </div>
                <Button 
                  className="w-full mt-4 bg-[#1ABBB3] hover:bg-[#4ED3C2]"
                  onClick={(e) => {
                    e.stopPropagation();
                    openKiosko();
                  }}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Abrir en nueva pestaña
                </Button>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-lg transition-all border-2 border-[#1ABBB3]" onClick={openCatalogoCliente}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-[#1A1A1A] mb-2">
                      Catálogo Cliente
                    </h3>
                    <p className="text-sm text-gray-600">
                      Vista previa del catálogo de tu farmacia
                    </p>
                  </div>
                  <ShoppingBag className="h-12 w-12 text-[#1ABBB3]" />
                </div>
                <Button 
                  className="w-full mt-4 bg-[#1ABBB3] hover:bg-[#4ED3C2]"
                  onClick={(e) => {
                    e.stopPropagation();
                    openCatalogoCliente();
                  }}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Abrir en nueva pestaña
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-2 border-[#1ABBB3] bg-gradient-to-br from-[#4ED3C2]/10 to-[#1ABBB3]/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-1">Productos</p>
                  <p className="text-3xl font-bold text-[#1A1A1A]">-</p>
                  <p className="text-xs text-gray-500 mt-1">Próximamente</p>
                </div>
                <Package className="h-12 w-12 text-[#1ABBB3]" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-[#1ABBB3] bg-gradient-to-br from-[#4ED3C2]/10 to-[#1ABBB3]/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-1">Pedidos</p>
                  <p className="text-3xl font-bold text-[#1A1A1A]">-</p>
                  <p className="text-xs text-gray-500 mt-1">Próximamente</p>
                </div>
                <ShoppingBag className="h-12 w-12 text-[#1ABBB3]" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-[#1ABBB3] bg-gradient-to-br from-[#4ED3C2]/10 to-[#1ABBB3]/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-1">Conversaciones</p>
                  <p className="text-3xl font-bold text-[#1A1A1A]">-</p>
                  <p className="text-xs text-gray-500 mt-1">Próximamente</p>
                </div>
                <MessageSquare className="h-12 w-12 text-[#1ABBB3]" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Subir Catálogo Excel */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileSpreadsheet className="h-6 w-6 mr-2 text-[#1ABBB3]" />
              Subir Catálogo desde Excel
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-gray-600 text-sm">
                Sube un archivo Excel (.xlsx o .xls) con tu catálogo de productos. 
                El sistema detectará automáticamente las columnas.
              </p>

              {/* Input de archivo */}
              <div className="flex items-center space-x-4">
                <label htmlFor="excel-input" className="cursor-pointer">
                  <div className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors border-2 border-dashed border-gray-300">
                    <Upload className="h-5 w-5 text-gray-600" />
                    <span className="text-gray-700 font-medium">
                      {selectedFile ? selectedFile.name : 'Seleccionar archivo'}
                    </span>
                  </div>
                  <input
                    id="excel-input"
                    type="file"
                    accept=".xlsx,.xls"
                    onChange={handleFileSelect}
                    className="hidden"
                    disabled={isUploading}
                  />
                </label>

                {selectedFile && (
                  <Button
                    onClick={handleUploadExcel}
                    disabled={isUploading}
                    className="bg-[#1ABBB3] hover:bg-[#4ED3C2]"
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Procesando...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4 mr-2" />
                        Importar
                      </>
                    )}
                  </Button>
                )}
              </div>

              {/* Resultado de la carga */}
              {uploadResult && (
                <div
                  className={`p-4 rounded-lg border-2 ${
                    uploadResult.success
                      ? 'bg-green-50 border-green-200'
                      : 'bg-red-50 border-red-200'
                  }`}
                >
                  {uploadResult.success ? (
                    <div className="flex items-start space-x-3">
                      <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <h4 className="font-semibold text-green-900 mb-1">
                          ¡Catálogo importado exitosamente!
                        </h4>
                        <p className="text-green-800 text-sm">
                          {uploadResult.inserted} productos insertados,{' '}
                          {uploadResult.updated} productos actualizados.
                          <br />
                          <strong>Total: {uploadResult.total} productos procesados</strong>
                        </p>
                        {uploadResult.errors && uploadResult.errors.length > 0 && (
                          <details className="mt-2">
                            <summary className="text-yellow-700 text-sm cursor-pointer">
                              Ver advertencias ({uploadResult.errors.length})
                            </summary>
                            <ul className="mt-2 text-xs text-yellow-800 space-y-1">
                              {uploadResult.errors.slice(0, 5).map((err, idx) => (
                                <li key={idx}>• {err}</li>
                              ))}
                              {uploadResult.errors.length > 5 && (
                                <li>... y {uploadResult.errors.length - 5} más</li>
                              )}
                            </ul>
                          </details>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start space-x-3">
                      <XCircle className="h-6 w-6 text-red-600 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <h4 className="font-semibold text-red-900 mb-1">
                          Error al importar catálogo
                        </h4>
                        <p className="text-red-800 text-sm">{uploadResult.error}</p>
                        {uploadResult.errors && uploadResult.errors.length > 0 && (
                          <details className="mt-2">
                            <summary className="text-red-700 text-sm cursor-pointer">
                              Ver detalles ({uploadResult.errors.length})
                            </summary>
                            <ul className="mt-2 text-xs text-red-800 space-y-1">
                              {uploadResult.errors.map((err, idx) => (
                                <li key={idx}>• {err}</li>
                              ))}
                            </ul>
                          </details>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Info adicional */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 text-sm mb-2">
                  📋 Formato del Excel
                </h4>
                <p className="text-blue-800 text-xs mb-2">
                  Tu archivo Excel debe contener al menos una columna con el <strong>nombre del producto</strong>.
                  El sistema detectará automáticamente columnas como:
                </p>
                <ul className="text-blue-800 text-xs space-y-1">
                  <li>• Nombre / Producto / Artículo</li>
                  <li>• Categoría / Familia</li>
                  <li>• Precio / PVP</li>
                  <li>• Stock / Inventario</li>
                  <li>• Código de Barras / EAN</li>
                  <li>• Laboratorio / Marca</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Status Message */}
        <Card>
          <CardHeader>
            <CardTitle>🚧 Panel en Construcción</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="font-semibold text-blue-900 mb-2">
                Este dashboard está en desarrollo
              </h3>
              <p className="text-blue-800 mb-4">
                Pronto podrás acceder a todas las funcionalidades de gestión de tu farmacia:
              </p>
              <ul className="space-y-2 text-blue-800">
                <li className="flex items-center">
                  <span className="mr-2">✓</span>
                  Gestión completa de catálogo de productos
                </li>
                <li className="flex items-center">
                  <span className="mr-2">✓</span>
                  Administración de pedidos online
                </li>
                <li className="flex items-center">
                  <span className="mr-2">✓</span>
                  Historial de conversaciones con IA
                </li>
                <li className="flex items-center">
                  <span className="mr-2">✓</span>
                  Estadísticas y reportes de ventas
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

