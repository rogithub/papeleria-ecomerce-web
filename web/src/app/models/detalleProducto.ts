// En product-card.ts o en un archivo de modelos compartido
export interface DetalleProducto {
  id: string;
  nid: number,
  nombre: string;
  precioVenta: number;
  unidadMedida: string;
  categoria: string;
  stock: number;
  fotos: string[];
  videos: string[];
}