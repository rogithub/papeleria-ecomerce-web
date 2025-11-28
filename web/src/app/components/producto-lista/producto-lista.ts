import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductoService } from '../../services/producto.service';
import { Producto } from '../../models/producto.model';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-producto-lista',
  imports: [CommonModule, RouterModule],
  templateUrl: './producto-lista.html',
  styleUrl: './producto-lista.scss'
})
export class ProductoListaComponent implements OnInit {
  private productoService = inject(ProductoService);
  
  constructor(private router: Router, private route: ActivatedRoute) {}



  productos: Producto[] = [];
  cargando = true;
  error = '';

  // Variables para la paginación
  paginaActual = 1;
  totalPaginas = 0;
  totalProductos = 0;

  // Variable para búsqueda
  terminoBusqueda = '';

  ngOnInit(): void {
    // Leer parámetros de la URL
    this.route.queryParams.subscribe(params => {
      const pagina = params['pagina'] ? parseInt(params['pagina']) : 1;
      const busqueda = params['busqueda'] || '';
      
      this.terminoBusqueda = busqueda;
      this.cargarProductos(pagina, busqueda);
    });
  }

  cargarProductos(pagina: number, busqueda?: string): void {
    this.cargando = true;

    // Guardar estado en el servicio
    this.productoService.guardarEstado(pagina, busqueda || this.terminoBusqueda);
  
    // Actualizar la URL con los parámetros
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { 
        pagina: pagina,
        busqueda: busqueda || this.terminoBusqueda || null
      },
      queryParamsHandling: 'merge'
    });
    
    this.productoService.obtenerProductos(pagina, 9, busqueda || this.terminoBusqueda).subscribe({
      next: (data) => {
        this.productos = data.productos;
        this.paginaActual = data.paginacion.paginaActual;
        this.totalPaginas = data.paginacion.totalPaginas;
        this.totalProductos = data.paginacion.totalRows;
        this.cargando = false;
      },
      error: (err) => {
        this.error = 'Error al cargar los productos';
        this.cargando = false;
        console.error('Error:', err);
      }
    });
  }

  buscar(termino: string): void {
    this.terminoBusqueda = termino.trim();
    this.cargarProductos(1, this.terminoBusqueda);
  }

  limpiarBusqueda(inputRef: HTMLInputElement): void {
    this.terminoBusqueda = '';
    inputRef.value = '';
    
    // Limpiar parámetros de búsqueda de la URL
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { busqueda: null },
      queryParamsHandling: 'merge'
    });
    
    this.cargarProductos(1);
  }

  cambiarPagina(nuevaPagina: number | string): void {
    const pagina = typeof nuevaPagina === 'string' ? parseInt(nuevaPagina) : nuevaPagina;
    
    // Validar que la página esté dentro del rango
    if (pagina < 1 || pagina > this.totalPaginas || pagina === this.paginaActual) {
      return;
    }
    
    this.cargarProductos(pagina);
    
    // Scroll suave al inicio
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  generarArrayPaginas(): number[] {
    return Array.from({ length: this.totalPaginas }, (_, i) => i + 1);
  }

  obtenerUrlFoto(foto: string | null): string {
    if (!foto) {
      return 'https://via.placeholder.com/300x225?text=Sin+Imagen';
    }
    return `https://cntnt.xplaya.com/papeleria-fotos-productos/${foto}`;
  }

  formatearPrecio(precio: number): string {
    return precio.toFixed(2);
  }

  verDetalle(productoId: number): void {
    this.router.navigate(['/productos', productoId]);
  }
}