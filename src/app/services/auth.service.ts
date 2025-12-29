import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RegistroUsuario, AuthResponse, LoginCredentials } from '../interfaces/usuario.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  
  // Ajusta esta URL si tu ruta en el backend es diferente
  private apiUrl = 'http://localhost:3000/auth'; 

  constructor() { }


  // --- REGISTRAR USUARIO ---
  registrarUsuario(datos: RegistroUsuario): Observable<AuthResponse> {
    
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, datos);
  }
  // --- LOGIN ---
  login(credenciales: LoginCredentials): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credenciales, {
      withCredentials: true 
    });
  }
}
  

