// En product-card.ts o en un archivo de modelos compartido
export interface DetalleProducto {
  id: number;
  nombre: string;
  precio: number;
  unidadMedida: string;
  categoria: string;
  stock: number;
  fotos: string[];
  videos: string[];
}