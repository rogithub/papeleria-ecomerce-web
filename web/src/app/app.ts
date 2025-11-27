import { Component } from '@angular/core';
import { ProductoListaComponent } from './components/producto-lista/producto-lista.component';

@Component({
  selector: 'app-root',
  imports: [ProductoListaComponent],
  template: `<app-producto-lista></app-producto-lista>`,
  styles: []
})
export class App { }