import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID, inject } from '@angular/core';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CartItem } from '../models/cartItem.model';
import { Producto } from '../models/producto.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  // Usamos BehaviorSubject para que los componentes siempre reciban el último estado del carrito al suscribirse.
  private itemsSubject = new BehaviorSubject<CartItem[]>([]);
  // Hacemos el Observable público para que los componentes puedan suscribirse a los cambios.
  public items$: Observable<CartItem[]> = this.itemsSubject.asObservable();

  private platformId = inject(PLATFORM_ID);


  // Key para guardar el carrito en el localStorage del navegador.
  private readonly storageKey = 'papeleria_cart';
  constructor() {
  // Al iniciar el servicio, cargamos el carrito guardado en localStorage.
    this.cargarCarritoDesdeStorage();
  }

  /**
    * Añade un producto al carrito.
    * Si ya existe, incrementa su cantidad.
  */
  agregarProducto(producto: Producto): void {
    const itemsActuales = this.itemsSubject.getValue();
    const itemExistente = itemsActuales.find(item => item.nid === producto.nid);
    
    if (itemExistente) {
      // Si el producto ya está, solo aumentamos la cantidad.
      itemExistente.cantidad++;
    } else {
      // Si es un producto nuevo, lo añadimos al array con cantidad 1.
      const nuevoItem: CartItem = { ...producto, cantidad: 1 };
      itemsActuales.push(nuevoItem);
    }
  
    // Emitimos el nuevo estado del carrito y lo guardamos.
    this.actualizarCarrito(itemsActuales);
  }
  
  /**
    * Actualiza la cantidad de un producto específico.
    */
  actualizarCantidad(productoId: number, cantidad: number): void {
    const itemsActuales = this.itemsSubject.getValue();
    const itemIndex = itemsActuales.findIndex(item => item.nid === productoId);

    if (itemIndex > -1) {
      if (cantidad > 0) {
        itemsActuales[itemIndex].cantidad = cantidad;
      } else {
        // Si la cantidad es 0 o menos, eliminamos el producto.
        itemsActuales.splice(itemIndex, 1);
      }
    }

    this.actualizarCarrito(itemsActuales);
  }
  
  /**
    * Elimina un producto del carrito por completo.
    */
  eliminarProducto(productoId: number): void {
    const itemsActuales = this.itemsSubject.getValue();
    const nuevosItems = itemsActuales.filter(item => item.nid !== productoId);
    this.actualizarCarrito(nuevosItems);
  }
  
  /**
    * Vacía todo el carrito de compras.
  */
  limpiarCarrito(): void {
    this.actualizarCarrito([]);
  }
    
  /**
    * Carga el carrito desde el localStorage.
  */
  private cargarCarritoDesdeStorage(): void {
    if (isPlatformBrowser(this.platformId)) {
      try {
        const carritoGuardado = localStorage.getItem(this.storageKey);
        if (carritoGuardado) {
          this.itemsSubject.next(JSON.parse(carritoGuardado));
        }
      } catch (e) {
        console.error('No se pudo acceder al localStorage para cargar el carrito.', e);
      }
    }
  }
  
  /**
    * Guarda el estado actual del carrito en localStorage y notifica a los suscriptores.
  */
  private actualizarCarrito(items: CartItem[]): void {
    this.itemsSubject.next(items);
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(items));
    } catch (e) {
      console.error('No se pudo acceder al localStorage para guardar el carrito.', e);
    }
  }
}

