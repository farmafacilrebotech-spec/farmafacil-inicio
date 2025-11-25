# Carpeta de Imágenes

Esta carpeta contiene todas las imágenes utilizadas en la aplicación FarmaFácil.

## Estructura de carpetas:

- **logo/**: Logo de FarmaFácil
  - Coloca aquí `farmafacil-logo.png` o cualquier variante del logo
  
- **productos/**: Imágenes de productos de farmacia
  - Imágenes de medicamentos, productos de cuidado personal, etc.
  
- **banners/**: Banners promocionales y de marketing
  - Imágenes para la página de inicio, promociones especiales, etc.
  
- **general/**: Otras imágenes generales
  - Iconos, ilustraciones, imágenes de fondo, etc.

## Formato recomendado:

- **Logo**: PNG con fondo transparente, tamaño recomendado 200x200px o similar
- **Productos**: JPG o PNG, tamaño recomendado 400x400px o 600x600px
- **Banners**: JPG o WebP, tamaño según diseño (ej. 1920x600px)

## Uso en Next.js:

Para usar las imágenes en tu aplicación:

```jsx
import Image from "next/image";

<Image
  src="/images/logo/farmafacil-logo.png"
  alt="FarmaFácil Logo"
  width={200}
  height={200}
/>
```

