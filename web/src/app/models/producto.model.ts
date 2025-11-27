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

export interface ProductosPaginados {
  productos: Producto[];
  paginacion: {
    totalRows: number;
    paginaActual: number;
    rowsPorPagina: number;
    totalPaginas: number;
  };
}