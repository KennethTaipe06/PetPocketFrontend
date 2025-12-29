// Interfaces para el módulo de Citas

export interface Cita {
  idCita?: number;
  idCliente: number;
  idMascota: number;
  idServicio: number;
  fecha: string;
  hora: string;
  usuarioIdUser?: number;
  motivo?: string;
  sintomas?: string;
  diagnosticoPrevio?: string;
  tratamientosAnteriores?: string[];
  notasAdicionales?: string;
  estadoCita?: 'programada' | 'confirmada' | 'cancelada' | 'completada';
  asistio?: boolean;
  fechaCreacion?: string;
  fechaActualizacion?: string;
}

export interface CitaDetalle extends Cita {
  nombreCliente?: string;
  nombreMascota?: string;
  nombreVeterinario?: string;
  nombreServicio?: string;
  mascota?: {
    nombre: string;
    especie: string;
  };
  servicio?: {
    nombre: string;
    precio: number;
  };
  veterinario?: {
    nombre: string;
    especialidad?: string;
  } | null;
  detallesMongo?: {
    motivo?: string;
    sintomas?: string;
    estado?: string;
    notasAdicionales?: string;
  };
}

export interface CrearCitaRequest {
  idCliente: number;
  idMascota: number;
  idServicio: number;
  fecha: string;
  hora: string;
  usuarioIdUser?: number;
  motivo?: string;
  sintomas?: string;
  diagnosticoPrevio?: string;
  tratamientosAnteriores?: string[];
  notasAdicionales?: string;
}

export interface ReprogramarCitaRequest {
  fecha?: string;
  hora?: string;
  usuarioIdUser?: number;
  motivoReprogramacion?: string;
}

export interface CambiarEstadoCitaRequest {
  estado: 'programada' | 'confirmada' | 'cancelada' | 'completada';
  notas?: string;
  asistio?: boolean;
}

export interface DisponibilidadResponse {
  disponible: boolean;
  mensaje?: string;
}

export interface EstadisticasCitas {
  total: number;
  programadas: number;
  confirmadas: number;
  canceladas: number;
  completadas: number;
}

export interface Mascota {
  idMascota: number;
  nombre: string;
  especie?: string;
  raza?: string;
  edad?: number;
}

export interface Servicio {
  idServicio: number;
  nombre: string;
  descripcion?: string;
  duracion?: number;
  precio?: number;
}

export interface Veterinario {
  idUser: number;
  nombre: string;
  especialidad?: string;
}
