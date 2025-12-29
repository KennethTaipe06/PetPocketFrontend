import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  // Inyecciones
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  // Definición del Formulario
  registerForm: FormGroup = this.fb.group({
    nameUsers: ['', [Validators.required, Validators.minLength(3)]],
    userName: ['', [Validators.required]],
    emailUser: ['', [Validators.required, Validators.email]],
    phoneUser: [''], // Opcional
    passwordUser: ['', [Validators.required, Validators.minLength(6)]]
  });

  mensajeError: string = '';

  onSubmit() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched(); // Marca los campos en rojo si están vacíos
      return;
    }

    // Preparar los datos tal cual los pide el backend
    const datosRegistro = this.registerForm.value;

    this.authService.registrarUsuario(datosRegistro).subscribe({
      next: (response) => {
        console.log('Registro exitoso:', response);
        alert('¡Cuenta creada con éxito! Ahora puedes iniciar sesión.');
        this.router.navigate(['/login']); // Redirigir al login
      },
      error: (err) => {
        console.error('Error en el registro:', err);
        // Mostrar el mensaje que viene del backend (ej: "Usuario ya existe")
        this.mensajeError = err.error.message || 'Ocurrió un error al registrarse';
      }
    });
  }
}


