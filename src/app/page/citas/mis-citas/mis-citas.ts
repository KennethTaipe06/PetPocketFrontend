import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CitasService } from '../../../services/citas.service';
import { CitaDetalle } from '../../../interfaces/cita.interface';

@Component({
  selector: 'app-mis-citas',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './mis-citas.html',
  styleUrls: ['./mis-citas.css'],
})
export class MisCitas implements OnInit {
  private citasService = inject(CitasService);
  private cdr = inject(ChangeDetectorRef);

  citas: CitaDetalle[] = [];
  citasFiltradas: CitaDetalle[] = [];
  cargando: boolean = false;
  error: string = '';
  filtroEstado: string = 'todas';

  // Mock de ID del cliente - En producción deberías obtenerlo del AuthService
  idCliente: number = 1;

  // Variables para reprogramar
  citaSeleccionada: CitaDetalle | null = null;
  mostrarModalReprogramar: boolean = false;
  nuevaFecha: string = '';
  nuevaHora: string = '';
  motivoReprogramacion: string = '';

  ngOnInit() {
    this.cargarCitas();
  }

  cargarCitas() {
    this.cargando = true;
    this.error = '';

    this.citasService.obtenerCitasCliente(this.idCliente).subscribe({
      next: (response) => {
        console.log('Respuesta citas:', response);
        this.error = ''; // Limpiar cualquier error previo
        // Manejar diferentes estructuras de respuesta
        if (Array.isArray(response)) {
          this.citas = response;
        } else if (response?.data && Array.isArray(response.data)) {
          this.citas = response.data;
        } else if (response?.citas && Array.isArray(response.citas)) {
          this.citas = response.citas;
        } else {
          this.citas = [];
        }
        console.log('Citas asignadas:', this.citas);
        console.log('Total citas:', this.citas.length);
        console.log('Error actual:', this.error);
        this.aplicarFiltro();
        console.log('Citas filtradas:', this.citasFiltradas);
        this.cargando = false;
        this.cdr.detectChanges(); // Forzar detección de cambios
        console.log('Estado final - Cargando:', this.cargando, 'Error:', this.error);
      },
      error: (error) => {
        console.error('Error al cargar citas:', error);
        this.error = 'No se pudieron cargar las citas. Verifica que el servidor esté funcionando.';

        // Usar datos mock temporalmente para desarrollo
        console.warn('Usando datos mock de citas');
        this.citas = [
          {
            idCita: 1,
            idCliente: 1,
            idMascota: 5,
            idServicio: 1,
            fecha: '2025-12-30',
            hora: '10:00',
            estadoCita: 'programada',
            motivo: 'Consulta general',
            sintomas: 'Revisión rutinaria',
            nombreCliente: 'Juan Pérez',
            nombreMascota: 'Max',
            nombreVeterinario: 'Dr. García',
            nombreServicio: 'Consulta General',
          },
          {
            idCita: 2,
            idCliente: 1,
            idMascota: 6,
            idServicio: 2,
            fecha: '2025-12-28',
            hora: '15:00',
            estadoCita: 'confirmada',
            motivo: 'Vacunación',
            sintomas: 'Ninguno',
            nombreCliente: 'Juan Pérez',
            nombreMascota: 'Luna',
            nombreVeterinario: 'Dra. Martínez',
            nombreServicio: 'Vacunación',
          },
          {
            idCita: 3,
            idCliente: 1,
            idMascota: 5,
            idServicio: 3,
            fecha: '2025-12-25',
            hora: '11:30',
            estadoCita: 'completada',
            motivo: 'Cirugía menor',
            sintomas: 'Herida en pata',
            nombreCliente: 'Juan Pérez',
            nombreMascota: 'Max',
            nombreVeterinario: 'Dr. García',
            nombreServicio: 'Cirugía',
          },
        ];
        this.aplicarFiltro();
        this.cargando = false;
        this.cdr.detectChanges(); // Forzar detección de cambios
      },
    });
  }

  aplicarFiltro() {
    if (this.filtroEstado === 'todas') {
      this.citasFiltradas = this.citas;
    } else {
      this.citasFiltradas = this.citas.filter((c) => c.estadoCita === this.filtroEstado);
    }
  }

  cambiarFiltro(estado: string) {
    this.filtroEstado = estado;
    this.aplicarFiltro();
  }

  abrirModalReprogramar(cita: CitaDetalle) {
    this.citaSeleccionada = cita;
    this.nuevaFecha = cita.fecha;
    this.nuevaHora = cita.hora;
    this.motivoReprogramacion = '';
    this.mostrarModalReprogramar = true;
  }

  cerrarModalReprogramar() {
    this.mostrarModalReprogramar = false;
    this.citaSeleccionada = null;
  }

  reprogramarCita() {
    if (!this.citaSeleccionada || !this.citaSeleccionada.idCita) return;

    this.cargando = true;
    const datos = {
      fecha: this.nuevaFecha,
      hora: this.nuevaHora,
      motivoReprogramacion: this.motivoReprogramacion,
    };

    this.citasService.reprogramarCita(this.citaSeleccionada.idCita, datos).subscribe({
      next: (response) => {
        alert('Cita reprogramada exitosamente');
        this.cerrarModalReprogramar();
        this.cargarCitas();
      },
      error: (error) => {
        console.error('Error al reprogramar cita:', error);
        alert('No se pudo reprogramar la cita. Intenta nuevamente.');
        this.cargando = false;
      },
    });
  }

  cancelarCita(idCita: number) {
    if (!confirm('¿Estás seguro de que deseas cancelar esta cita?')) return;

    this.cargando = true;
    this.citasService.cancelarCita(idCita).subscribe({
      next: (response) => {
        alert('Cita cancelada exitosamente');
        this.cargarCitas();
      },
      error: (error) => {
        console.error('Error al cancelar cita:', error);
        alert('No se pudo cancelar la cita. Intenta nuevamente.');
        this.cargando = false;
      },
    });
  }

  confirmarCita(idCita: number) {
    this.cargando = true;
    const datos = {
      estado: 'confirmada' as const,
      notas: 'Confirmada por el cliente',
    };

    console.log('Enviando datos para confirmar:', datos);
    this.citasService.cambiarEstadoCita(idCita, datos).subscribe({
      next: (response) => {
        alert('Cita confirmada exitosamente');
        this.cargarCitas();
      },
      error: (error) => {
        console.error('Error al confirmar cita:', error);
        console.error('Detalle del error:', error.error);
        alert(`No se pudo confirmar la cita. Error: ${error.error?.message || error.message}`);
        this.cargando = false;
      },
    });
  }

  obtenerClaseEstado(estadoCita?: string): string {
    switch (estadoCita) {
      case 'programada':
        return 'estado-programada';
      case 'confirmada':
        return 'estado-confirmada';
      case 'cancelada':
        return 'estado-cancelada';
      case 'completada':
        return 'estado-completada';
      default:
        return '';
    }
  }

  formatearFecha(fecha: string): string {
    const date = new Date(fecha);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }
}
