import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { CartItem } from '../../models/cartItem.model';
 
@Component({
  selector: 'app-cart-view',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cart-view.html',
  styleUrls: ['./cart-view.scss']
})
export class CartView implements OnInit {
  private cartService = inject(CartService);

  cartItems: CartItem[] = [];
  totalPrice = 0;
  totalItems = 0;
  
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
    // Generamos el texto del pedido
    let mensaje = '¡Hola! Quisiera hacer el siguiente pedido:\n\n';
    this.cartItems.forEach(item => {
      mensaje += `- ${item.nombre} (ID: ${item.nid}) - Cantidad: ${item.cantidad}\n`;
    });
    mensaje += `\n*Total de artículos: ${this.totalItems}*`;
    mensaje += `\n*Precio total aproximado: $${this.totalPrice.toFixed(2)}*`;

    // Codificamos el mensaje para la URL
    const mensajeCodificado = encodeURIComponent(mensaje);
    const numeroWhatsApp = '524522018336'; // <- Tu número de WhatsApp

    // Creamos la URL y redirigimos
    const urlWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${mensajeCodificado}`;

    // Abrimos en una nueva pestaña
    window.open(urlWhatsApp, '_blank');

    // Opcional: limpiar el carrito después de enviar el pedido
    // this.cartService.limpiarCarrito();
  }

  formatearPrecio(precio: number): string {
    return precio.toFixed(2);
  }

  obtenerUrlFoto(foto: string | null): string {
    if (!foto) {
      return 'https://via.placeholder.com/300x225?text=Sin+Imagen';
    }
    return `https://cntnt.xplaya.com/papeleria-fotos-productos/${foto}`;
  }
}
