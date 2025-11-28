import { Routes } from '@angular/router';
import { ProductoListaComponent } from './components/producto-lista/producto-lista';
import { ProductoDetalleComponent } from './components/producto-detalle/producto-detalle';

export const routes: Routes = [
  { path: 'productos', component: ProductoListaComponent },
  { path: 'productos/:id', component: ProductoDetalleComponent },
  { path: '', redirectTo: '/productos', pathMatch: 'full' }
];