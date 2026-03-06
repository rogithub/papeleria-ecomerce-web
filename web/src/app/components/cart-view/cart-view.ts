import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CartService } from '../../services/cart.service';
import { CartItem } from '../../models/cartItem.model';
import { ProductoService } from '../../services/producto.service';
import { UserService } from '../../services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-cart-view',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './cart-view.html',
  styleUrls: ['./cart-view.scss']
})
export class CartView implements OnInit {
  private cartService = inject(CartService);
  private productoService = inject(ProductoService);
  private userService = inject(UserService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private http = inject(HttpClient);

  cartItems: CartItem[] = [];
  totalPrice = 0;
  totalItems = 0;

  // Formulario de datos de contacto
  mostrarFormulario = false;
  nombre = '';
  telefono = '';
  confirmarTelefono = '';
  enviando = false;
  errorMsg = '';

  ngOnInit(): void {
    this.cartService.items$.subscribe(items => {
      this.cartItems = items;
      this.recalculateTotals();
    });
  }

  recalculateTotals(): void {
    this.totalPrice = this.cartItems.reduce((total, item) => total + (item.precioVenta * item.cantidad), 0);
    this.totalItems = this.cartItems.reduce((total, item) => total + item.cantidad, 0);
  }

  updateQuantity(item: CartItem, quantityStr: string): void {
    const quantity = parseInt(quantityStr, 10);
    if (!isNaN(quantity) && quantity >= 0) {
      this.cartService.actualizarCantidad(item.nid, quantity);
    }
  }

  removeItem(item: CartItem): void {
    if (confirm(`¿Estás seguro de que quieres eliminar "${item.nombre}" del carrito?`)) {
      this.cartService.eliminarProducto(item.nid);
    }
  }

  clearCart(): void {
    if (confirm('¿Estás seguro de que quieres vaciar todo el carrito?')) {
      this.cartService.limpiarCarrito();
    }
  }

  checkout(): void {
    const guardado = this.userService.usuario;
    if (guardado) {
      this.nombre = guardado.nombre;
      this.telefono = guardado.telefono;
      this.confirmarTelefono = guardado.telefono;
    }
    this.mostrarFormulario = true;
    this.errorMsg = '';
  }

  cancelarFormulario(): void {
    this.mostrarFormulario = false;
    this.nombre = '';
    this.telefono = '';
    this.confirmarTelefono = '';
    this.errorMsg = '';
  }

  get telefonoValido(): boolean {
    return /^\d{10}$/.test(this.telefono);
  }

  get telefonosCoinciden(): boolean {
    return this.telefono === this.confirmarTelefono;
  }

  async enviarPedido(): Promise<void> {
    this.errorMsg = '';

    if (!this.nombre.trim()) {
      this.errorMsg = 'El nombre es requerido.';
      return;
    }
    if (!this.telefonoValido) {
      this.errorMsg = 'El teléfono debe tener exactamente 10 dígitos numéricos.';
      return;
    }
    if (!this.telefonosCoinciden) {
      this.errorMsg = 'Los números de teléfono no coinciden.';
      return;
    }

    this.enviando = true;
    try {
      const body = {
        nombre: this.nombre.trim(),
        telefono: this.telefono,
        items: this.cartItems.map(item => ({
          productoId: item.id,
          cantidad: item.cantidad
        }))
      };

      const res: any = await this.http.post(`${environment.apiUrl}/pedidos`, body).toPromise();
      this.userService.guardar(this.nombre.trim(), this.telefono);
      this.abrirWhatsApp(res.pedidoId, res.pedidoUid);
    } catch (err) {
      this.errorMsg = 'Ocurrió un error al registrar tu pedido. Intenta de nuevo.';
    } finally {
      this.enviando = false;
    }
  }

  private abrirWhatsApp(pedidoId: number, pedidoUid: string): void {
    let mensaje = `¡Hola! Acabo de hacer un pedido en línea.\n\n`;
    mensaje += `*Pedido #${pedidoId}*\n`;
    mensaje += `*Total de artículos: ${this.totalItems}*\n`;
    mensaje += `*Precio total: $${this.totalPrice.toFixed(2)}*\n\n`;
    mensaje += `*Nombre: ${this.nombre.trim()}*\n`;
    mensaje += `*Tel: ${this.telefono}*\n\n`;
    mensaje += `Ver detalle: https://papeleria.xplaya.com/Cotizacion/${pedidoUid}`;

    const urlWhatsApp = `https://wa.me/524522018336?text=${encodeURIComponent(mensaje)}`;
    window.open(urlWhatsApp, '_blank');
    this.cartService.limpiarCarrito();
    this.cancelarFormulario();
  }

  formatearPrecio(precio: number): string {
    return precio.toFixed(2);
  }

  obtenerUrlFoto(foto: string): string {
    return `https://cntnt.xplaya.com/papeleria-fotos-productos/${foto}`;
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
}
