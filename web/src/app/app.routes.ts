import { Routes } from '@angular/router';
import { ProductoListaComponent } from './components/producto-lista/producto-lista';
import { ProductoDetalleComponent } from './components/producto-detalle/producto-detalle';
import { LayoutComponent } from './components/layout/layout';
import { CartView } from './components/cart-view/cart-view';

export const routes: Routes = [
{
  path: '',
  component: LayoutComponent, // El layout envuelve a las demás rutas
  children: [
    { path: 'productos', component: ProductoListaComponent },
    { path: 'productos/:id', component: ProductoDetalleComponent },
    { path: 'carrito', component: CartView },
    { path: '', redirectTo: '/productos', pathMatch: 'full' }
  ]
}];
