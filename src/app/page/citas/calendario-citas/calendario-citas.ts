import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CitasService } from '../../../services/citas.service';
import { CitaDetalle, Veterinario, EstadisticasCitas } from '../../../interfaces/cita.interface';

@Component({
  selector: 'app-calendario-citas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './calendario-citas.html',
  styleUrls: ['./calendario-citas.css'],
})
export class CalendarioCitas implements OnInit {
  private citasService = inject(CitasService);

  citas: CitaDetalle[] = [];
  citasFiltradas: CitaDetalle[] = [];
  veterinarios: Veterinario[] = [];
  estadisticas: EstadisticasCitas | null = null;

  // Filtros
  fechaInicio: string = '';
  fechaFin: string = '';
  veterinarioSeleccionado?: number;

  // Estados
  cargando: boolean = false;
  error: string = '';
  vistaActual: 'lista' | 'calendario' = 'lista';

  // Calendario
  diasSemana: string[] = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  diasMes: any[] = [];
  mesActual: Date = new Date();

  ngOnInit() {
    this.setFechasPorDefecto();
    this.cargarVeterinarios();
    this.cargarCitas();
    this.cargarEstadisticas();
    this.generarCalendario();
  }

  setFechasPorDefecto() {
    const hoy = new Date();
    this.fechaInicio = hoy.toISOString().split('T')[0];

    const finSemana = new Date(hoy);
    finSemana.setDate(finSemana.getDate() + 7);
    this.fechaFin = finSemana.toISOString().split('T')[0];
  }

  cargarVeterinarios() {
    // Usar datos mock temporalmente
    console.warn('Usando datos mock para veterinarios');
    this.veterinarios = [
      { idUser: 2, nombre: 'Dr. Juan Pérez', especialidad: 'Medicina General' },
      { idUser: 3, nombre: 'Dra. María García', especialidad: 'Cirugía' },
      { idUser: 4, nombre: 'Dr. Carlos López', especialidad: 'Dermatología' },
      { idUser: 5, nombre: 'Dra. Ana Martínez', especialidad: 'Cardiología' },
    ];

    // Descomentar cuando tengas el endpoint correcto:
    /*
    this.citasService.obtenerVeterinarios().subscribe({
      next: (vets) => this.veterinarios = vets,
      error: (error) => console.error('Error al cargar veterinarios:', error)
    });
    */
  }

  cargarCitas() {
    this.cargando = true;
    this.error = '';

    this.citasService
      .obtenerCalendario(this.fechaInicio, this.fechaFin, this.veterinarioSeleccionado)
      .subscribe({
        next: (response) => {
          console.log('Respuesta calendario:', response);
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
          this.citasFiltradas = [...this.citas];
          this.generarCalendario();
          this.cargando = false;
        },
        error: (error) => {
          console.error('Error al cargar citas:', error);
          this.error =
            'No se pudieron cargar las citas. Verifica que el servidor esté funcionando.';
          this.citas = [];
          this.cargando = false;
        },
      });
  }

  cargarEstadisticas() {
    this.citasService.obtenerEstadisticas(this.fechaInicio, this.fechaFin).subscribe({
      next: (stats) => {
        this.estadisticas = stats;
      },
      error: (error) => {
        console.error('Error al cargar estadísticas:', error);
      },
    });
  }

  aplicarFiltros() {
    this.cargarCitas();
    this.cargarEstadisticas();
  }

  limpiarFiltros() {
    this.setFechasPorDefecto();
    this.veterinarioSeleccionado = undefined;
    this.cargarCitas();
    this.cargarEstadisticas();
  }

  cambiarVista(vista: 'lista' | 'calendario') {
    this.vistaActual = vista;
    if (vista === 'calendario') {
      this.generarCalendario();
    }
  }

  generarCalendario() {
    const año = this.mesActual.getFullYear();
    const mes = this.mesActual.getMonth();

    const primerDia = new Date(año, mes, 1);
    const ultimoDia = new Date(año, mes + 1, 0);

    const diasAnteriores = primerDia.getDay();
    const diasDelMes = ultimoDia.getDate();

    this.diasMes = [];

    // Días del mes anterior (grises)
    for (let i = diasAnteriores - 1; i >= 0; i--) {
      const fecha = new Date(año, mes, -i);
      this.diasMes.push({
        numero: fecha.getDate(),
        fecha: fecha,
        mesActual: false,
        citas: [],
      });
    }

    // Días del mes actual
    for (let i = 1; i <= diasDelMes; i++) {
      const fecha = new Date(año, mes, i);
      const fechaStr = fecha.toISOString().split('T')[0];
      const citasDelDia = this.citas.filter((c) => c.fecha === fechaStr);

      this.diasMes.push({
        numero: i,
        fecha: fecha,
        mesActual: true,
        citas: citasDelDia,
      });
    }

    // Completar con días del siguiente mes
    const diasRestantes = 42 - this.diasMes.length; // 6 semanas x 7 días
    for (let i = 1; i <= diasRestantes; i++) {
      const fecha = new Date(año, mes + 1, i);
      this.diasMes.push({
        numero: i,
        fecha: fecha,
        mesActual: false,
        citas: [],
      });
    }
  }

  mesAnterior() {
    this.mesActual = new Date(this.mesActual.getFullYear(), this.mesActual.getMonth() - 1);
    this.generarCalendario();
  }

  mesSiguiente() {
    this.mesActual = new Date(this.mesActual.getFullYear(), this.mesActual.getMonth() + 1);
    this.generarCalendario();
  }

  obtenerNombreMes(): string {
    return this.mesActual.toLocaleDateString('es-ES', {
      month: 'long',
      year: 'numeric',
    });
  }

  esHoy(fecha: Date): boolean {
    const hoy = new Date();
    return fecha.toDateString() === hoy.toDateString();
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
