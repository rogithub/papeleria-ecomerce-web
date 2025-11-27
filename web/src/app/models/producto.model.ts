export interface Producto {
  nid: number;
  id: string;
  nombre: string;
  categoria: string;
  stock: number;
  unidadMedida: string;
  precioVenta: number;
  foto: string | null;
  video: string | null;
  prioridad: number | null;
}