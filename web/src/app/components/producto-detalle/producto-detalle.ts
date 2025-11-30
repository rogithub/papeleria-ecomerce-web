import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProductoService } from '../../services/producto.service';
import { CartService } from '../../services/cart.service';
import { DetalleProducto } from '../../models/detalleProducto'; 
import { MetaService } from '../../services/meta.service';
import { Producto } from '../../models/producto.model';

@Component({
  selector: 'app-producto-detalle',
  imports: [CommonModule],
  templateUrl: './producto-detalle.html',
  styleUrl: './producto-detalle.scss'
})
export class ProductoDetalleComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private productoService = inject(ProductoService);
  private metaService = inject(MetaService);
  private cartService = inject(CartService);

  producto?: DetalleProducto;
  cargando = true;
  error = '';
  fotoPrincipal = '';

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.cargarProducto(Number(id));
    }
  }

  cargarProducto(id: number): void {
    this.cargando = true;
    this.productoService.obtenerProductoPorId(id).subscribe({
      next: (data) => {
        this.producto = data;

        // Actualizar meta tags con la información del producto
        this.metaService.updateProductTags({
          nombre: data.nombre,
          precio: data.precioVenta,
          categoria: data.categoria,
          fotos: data.fotos,
          id: data.nid
        });
        
        // Si no hay fotos, usar placeholder inmediatamente
        if (!data.fotos || data.fotos.length === 0) {
          this.fotoPrincipal = this.obtenerUrlFotoPlaceholder();
        } else {
          this.fotoPrincipal = data.fotos[0];
        }
        
        this.cargando = false;
      },
      error: (err) => {
        this.error = 'Error al cargar el producto';
        this.cargando = false;
        console.error('Error:', err);
      }
    });
  }

  // Método mejorado para manejar errores de carga de imagen
  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = this.obtenerUrlFotoPlaceholder();
  }

  cambiarFotoPrincipal(foto: string): void {
    this.fotoPrincipal = foto;
  }

  obtenerUrlFotoPlaceholder(): string {
    return 'https://via.placeholder.com/600x400?text=Sin+Imagen';
  }

  agregarAlCarrito(producto: DetalleProducto): void {
    let p: Producto = {
      nid: producto.nid,
      id: producto.id,
      nombre: producto.nombre,
      categoria: producto.categoria,
      stock: producto.stock,
      unidadMedida: producto.unidadMedida,      
      precioVenta: producto.precioVenta,
      foto: producto.fotos && producto.fotos.length > 0 ? producto.fotos[0] : null,
      video: producto.videos && producto.videos.length > 0 ? producto.videos[0] : null,
      prioridad: 0
    }

    this.cartService.agregarProducto(p);
    // Redireccionar al carrito
    this.router.navigate(['/carrito']);
  }

  obtenerUrlFoto(foto: string): string {
    return foto; // Ya viene la URL completa de MinIO
  }

  formatearPrecio(precio: number): string {
    return precio.toFixed(2);
  }

  volverALista(): void {
    const estado = this.productoService.obtenerEstado();
    this.router.navigate(['/productos'], {
      queryParams: {
        pagina: estado.pagina,
        busqueda: estado.busqueda || null
      }
    });
  }

  ngOnDestroy(): void {
    this.metaService.resetTags();
  }
}