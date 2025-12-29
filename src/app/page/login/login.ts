import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router'; // Importante para poder navegar
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-login',standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  // Inyecciones de dependencias
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  mensajeError: string = '';

  // Formulario reactivo
  loginForm: FormGroup = this.fb.group({
    username: ['', [Validators.required]], // Tu backend pide 'username'
    password: ['', [Validators.required]]
  });

  onSubmit() {
    // 1. Validar si el formulario está bien lleno
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    // 2. Preparar credenciales
    const credenciales = this.loginForm.value;

    // 3. Llamar al servicio
    this.authService.login(credenciales).subscribe({
      next: (response) => {
        console.log('¡Bienvenido!', response);
        // Redirigir al usuario al Dashboard o Inicio
        this.router.navigate(['/mascotas']); // ruta para ver al entrar
      },
      error: (err) => {
        console.error('Error:', err);
        // Mostrar mensaje del backend o uno genérico
        this.mensajeError = err.error?.message || 'Usuario o contraseña incorrectos';
      }
    });
  }
}


