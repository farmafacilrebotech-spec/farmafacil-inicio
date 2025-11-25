export async function cargarFarmaciaDemo() {
    const res = await fetch("/demo/farmacia.json");
    return res.json();
  }
  
  export async function cargarCatalogoDemo() {
    const res = await fetch("/demo/catalogo.json");
    return res.json();
  }
  
  export async function cargarPedidosDemo() {
    const res = await fetch("/demo/pedidos.json");
    return res.json();
  }
  