import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CitasService } from '../../../services/citas.service';
import {
  CrearCitaRequest,
  Mascota,
  Servicio,
  Veterinario,
} from '../../../interfaces/cita.interface';

@Component({
  selector: 'app-agendar-cita',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './agendar-cita.html',
  styleUrls: ['./agendar-cita.css'],
})
export class AgendarCita implements OnInit {
  private citasService = inject(CitasService);
  private router = inject(Router);

  // Mock de ID del cliente - En producción deberías obtenerlo del AuthService
  idCliente: number = 1;

  // Listas para selects
  mascotas: Mascota[] = [];
  servicios: Servicio[] = [];
  veterinarios: Veterinario[] = [];

  // Datos del formulario
  cita: CrearCitaRequest = {
    idCliente: this.idCliente,
    idMascota: 0,
    idServicio: 0,
    fecha: '',
    hora: '',
    usuarioIdUser: undefined,
    motivo: '',
    sintomas: '',
    diagnosticoPrevio: '',
    tratamientosAnteriores: [],
    notasAdicionales: '',
  };

  tratamiento: string = '';

  // Estados
  cargando: boolean = false;
  verificandoDisponibilidad: boolean = false;
  disponible: boolean = true;
  mensajeDisponibilidad: string = '';
  error: string = '';

  // Fecha mínima (hoy)
  fechaMinima: string = '';

  ngOnInit() {
    this.setFechaMinima();
    this.cargarDatos();
  }

  setFechaMinima() {
    const hoy = new Date();
    this.fechaMinima = hoy.toISOString().split('T')[0];
    this.cita.fecha = this.fechaMinima;
  }

  cargarDatos() {
    this.cargando = true;

    // Usar datos mock temporalmente hasta tener los endpoints correctos
    console.warn('Usando datos mock para mascotas, servicios y veterinarios');

    this.mascotas = [
      { idMascota: 5, nombre: 'Max', especie: 'Perro', raza: 'Labrador' },
      { idMascota: 6, nombre: 'Luna', especie: 'Gato', raza: 'Siamés' },
      { idMascota: 7, nombre: 'Rocky', especie: 'Perro', raza: 'Golden Retriever' },
      { idMascota: 8, nombre: 'Mishi', especie: 'Gato', raza: 'Persa' },
    ];

    this.servicios = [
      { idServicio: 1, nombre: 'Consulta General', duracion: 30, precio: 50 },
      { idServicio: 2, nombre: 'Vacunación', duracion: 15, precio: 30 },
      { idServicio: 3, nombre: 'Cirugía', duracion: 120, precio: 500 },
      { idServicio: 4, nombre: 'Control de Rutina', duracion: 20, precio: 40 },
      { idServicio: 5, nombre: 'Baño y Peluquería', duracion: 60, precio: 35 },
      { idServicio: 6, nombre: 'Desparasitación', duracion: 10, precio: 25 },
    ];

    this.veterinarios = [
      { idUser: 2, nombre: 'Dr. Juan Pérez', especialidad: 'Medicina General' },
      { idUser: 3, nombre: 'Dra. María García', especialidad: 'Cirugía' },
      { idUser: 4, nombre: 'Dr. Carlos López', especialidad: 'Dermatología' },
      { idUser: 5, nombre: 'Dra. Ana Martínez', especialidad: 'Cardiología' },
    ];

    this.cargando = false;

    // Descomentar cuando tengas los endpoints correctos:
    /*
    this.citasService.obtenerMascotasCliente(this.idCliente).subscribe({
      next: (mascotas) => this.mascotas = mascotas,
      error: (error) => console.error('Error al cargar mascotas:', error)
    });

    this.citasService.obtenerServicios().subscribe({
      next: (servicios) => this.servicios = servicios,
      error: (error) => console.error('Error al cargar servicios:', error)
    });

    this.citasService.obtenerVeterinarios().subscribe({
      next: (veterinarios) => {
        this.veterinarios = veterinarios;
        this.cargando = false;
      },
      error: (error) => console.error('Error al cargar veterinarios:', error)
    });
    */
  }

  verificarDisponibilidad() {
    if (!this.cita.fecha || !this.cita.hora) return;

    this.verificandoDisponibilidad = true;
    this.citasService
      .verificarDisponibilidad(this.cita.fecha, this.cita.hora, this.cita.usuarioIdUser)
      .subscribe({
        next: (response) => {
          this.disponible = response.disponible;
          this.mensajeDisponibilidad =
            response.mensaje ||
            (response.disponible ? 'Horario disponible' : 'Horario no disponible');
          this.verificandoDisponibilidad = false;
        },
        error: (error) => {
          console.error('Error al verificar disponibilidad:', error);
          this.disponible = true; // Asumir disponible si falla
          this.verificandoDisponibilidad = false;
        },
      });
  }

  agregarTratamiento() {
    if (this.tratamiento.trim()) {
      if (!this.cita.tratamientosAnteriores) {
        this.cita.tratamientosAnteriores = [];
      }
      this.cita.tratamientosAnteriores.push(this.tratamiento);
      this.tratamiento = '';
    }
  }

  eliminarTratamiento(index: number) {
    this.cita.tratamientosAnteriores?.splice(index, 1);
  }

  validarFormulario(): boolean {
    if (!this.cita.idMascota) {
      this.error = 'Debes seleccionar una mascota';
      return false;
    }
    if (!this.cita.idServicio) {
      this.error = 'Debes seleccionar un servicio';
      return false;
    }
    if (!this.cita.fecha) {
      this.error = 'Debes seleccionar una fecha';
      return false;
    }
    if (!this.cita.hora) {
      this.error = 'Debes seleccionar una hora';
      return false;
    }
    if (!this.disponible) {
      this.error = 'El horario seleccionado no está disponible';
      return false;
    }
    this.error = '';
    return true;
  }

  agendarCita() {
    if (!this.validarFormulario()) {
      return;
    }

    this.cargando = true;
    this.citasService.crearCita(this.cita).subscribe({
      next: (response) => {
        alert('¡Cita agendada exitosamente!');
        this.router.navigate(['/mis-citas']);
      },
      error: (error) => {
        console.error('Error al agendar cita:', error);
        this.error = error.error?.message || 'No se pudo agendar la cita. Intenta nuevamente.';
        this.cargando = false;
      },
    });
  }

  cancelar() {
    if (confirm('¿Estás seguro de cancelar? Se perderán los datos ingresados.')) {
      this.router.navigate(['/mis-citas']);
    }
  }
}
