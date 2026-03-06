import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject } from 'rxjs';

const KEY_NOMBRE = 'user_nombre';
const KEY_TELEFONO = 'user_telefono';

export interface UserData {
  nombre: string;
  telefono: string;
}

@Injectable({ providedIn: 'root' })
export class UserService {
  private platformId = inject(PLATFORM_ID);
  private _usuario = new BehaviorSubject<UserData | null>(this._cargarDesdeStorage());

  readonly usuario$ = this._usuario.asObservable();

  private _cargarDesdeStorage(): UserData | null {
    if (!isPlatformBrowser(this.platformId)) return null;
    const nombre = localStorage.getItem(KEY_NOMBRE);
    const telefono = localStorage.getItem(KEY_TELEFONO);
    return nombre && telefono ? { nombre, telefono } : null;
  }

  get usuario(): UserData | null {
    return this._usuario.value;
  }

  guardar(nombre: string, telefono: string): void {
    if (!isPlatformBrowser(this.platformId)) return;
    localStorage.setItem(KEY_NOMBRE, nombre);
    localStorage.setItem(KEY_TELEFONO, telefono);
    this._usuario.next({ nombre, telefono });
  }

  limpiar(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    localStorage.removeItem(KEY_NOMBRE);
    localStorage.removeItem(KEY_TELEFONO);
    this._usuario.next(null);
  }
}
