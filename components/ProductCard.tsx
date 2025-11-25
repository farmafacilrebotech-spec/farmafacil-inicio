import Image from "next/image";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, AlertCircle } from "lucide-react";
import { addToCart } from "@/lib/cart";
import { useToast } from "@/hooks/use-toast";

interface ProductCardProps {
  id: string;
  nombre: string;
  descripcion?: string;
  precio: number;
  stock: number;
  imagen_url?: string;
  categoria: string;
  farmacia_id?: string;
  farmacia_nombre?: string;
  onAddToCart?: (productId: string) => void;
}

export default function ProductCard({
  id,
  nombre,
  descripcion,
  precio,
  stock,
  imagen_url,
  categoria,
  farmacia_id,
  farmacia_nombre,
  onAddToCart,
}: ProductCardProps) {
  const { toast } = useToast();
  const isOutOfStock = stock <= 0;

  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart(id);
    } else {
      // Añadir al carrito directamente
      addToCart({
        producto_id: id,
        nombre,
        precio,
        cantidad: 1,
        imagen_url,
        farmacia_id: farmacia_id || "",
        farmacia_nombre,
        stock,
      });
      
      toast({
        title: "¡Producto añadido!",
        description: `${nombre} se ha añadido al carrito`,
      });
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative h-48 w-full bg-gray-100">
        <Image
          src={imagen_url || "https://images.pexels.com/photos/3683041/pexels-photo-3683041.jpeg"}
          alt={nombre}
          fill
          className="object-cover"
          unoptimized
        />
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-red-500 text-white px-4 py-2 rounded-full font-semibold">
              Fuera de stock
            </div>
          </div>
        )}
      </div>
      <CardContent className="p-4">
        <div className="mb-2">
          <span className="text-xs text-[#1ABBB3] font-semibold uppercase">
            {categoria}
          </span>
        </div>
        <h3 className="font-bold text-lg text-[#1A1A1A] mb-2">{nombre}</h3>
        {descripcion && (
          <p className="text-sm text-gray-600 line-clamp-2 mb-3">
            {descripcion}
          </p>
        )}
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-[#1ABBB3]">
            {precio.toFixed(2)}€
          </span>
          <span className="text-sm text-gray-500">
            Stock: <span className="font-semibold">{stock}</span>
          </span>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        {isOutOfStock ? (
          <Button
            disabled
            className="w-full bg-gray-300 text-gray-500 cursor-not-allowed"
          >
            <AlertCircle className="h-4 w-4 mr-2" />
            No disponible
          </Button>
        ) : (
          <Button
            onClick={handleAddToCart}
            className="w-full bg-[#1ABBB3] hover:bg-[#4ED3C2] text-white rounded-full"
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Añadir al carrito
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
