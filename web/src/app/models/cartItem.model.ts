import { Producto } from './producto.model';
export interface CartItem extends Producto {
    cantidad: number;
}
