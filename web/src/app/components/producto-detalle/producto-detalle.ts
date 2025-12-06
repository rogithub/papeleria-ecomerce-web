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
          id: data.nid,
          stock: data.stock
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

  compartirProducto(): void {
    if (!this.producto) return;

    // Construir la URL
    const urlParaCompartir = `https://xplaya.com/productos/${this.producto.nid}`;
    const textoCompartir = `${this.producto.nombre} - $${this.formatearPrecio(this.producto.precioVenta)}`;

    // Verificar si el navegador soporta la API de compartir nativa
    if (navigator.share) {
      navigator.share({
        title: this.producto.nombre,
        text: textoCompartir,
        url: urlParaCompartir
      })
      .then(() => console.log('Compartido exitosamente'))
      .catch((error) => console.log('Error al compartir:', error));
    } else {
      // Fallback: copiar al portapapeles
      navigator.clipboard.writeText(urlParaCompartir)
        .then(() => {
          alert('¡Enlace copiado al portapapeles!\n' + urlParaCompartir);
        })
        .catch(() => {
          // Si falla el clipboard, mostrar la URL para copiar manualmente
          prompt('Copia este enlace para compartir:', urlParaCompartir);
        });
    }
  }

  agregarAlCarrito(producto: DetalleProducto): void {
    var foto = producto.fotos && producto.fotos.length > 0 ? producto.fotos[0] : null;
    var video = producto.videos && producto.videos.length > 0 ? producto.videos[0] : null
    if (foto && foto.startsWith('https://cntnt.xplaya.com/papeleria-fotos-productos/')) {
      foto = foto.replace('https://cntnt.xplaya.com/papeleria-fotos-productos/', '');
    }
    if (foto && foto.startsWith('https://via.placeholder.com')) {
      foto = null;
    }

    let p: Producto = {
      nid: producto.nid,
      id: producto.id,
      nombre: producto.nombre,
      categoria: producto.categoria,
      stock: producto.stock,
      unidadMedida: producto.unidadMedida,      
      precioVenta: producto.precioVenta,
      foto: foto,
      video: video,
      prioridad: 0
    }

    this.cartService.agregarProducto(p);
    // Redireccionar al carrito
    const estado = this.productoService.obtenerEstado();
    this.router.navigate(['/carrito'], {
      queryParams: {
        pagina: estado.pagina,
        busqueda: estado.busqueda || null
      }
    });
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