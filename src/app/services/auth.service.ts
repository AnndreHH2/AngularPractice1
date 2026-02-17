import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {

  // servicio para gestionar la autenticación del usuario, incluyendo login, logout y verificación de estado
  private readonly apiUrl = 'https://localhost:7059/api/Auth';

  constructor(private http: HttpClient) {}

  // metodo para iniciar sesión, enviando las credenciales al backend y almacenando el token recibido
  login(username: string, password: string) {
    return this.http
      .post<{ token: string; expiresAt: string }>(`${this.apiUrl}/login`, { username, password })
      .pipe(tap(res => localStorage.setItem('token', res.token)));
  }

  // metodo para cerrar sesión, eliminando el token del localStorage
  logout() {
    localStorage.removeItem('token');
  }

  // metodo para obtener el token almacenado en localStorage
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // metodo para verificar si el usuario está autenticado, basado en la existencia del token
  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
