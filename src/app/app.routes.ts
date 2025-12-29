import { Routes } from '@angular/router';
import { Pets } from './page/pets/pets';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./page/login/login').then((m) => m.Login),
  },
  {
    path: 'register',
    loadComponent: () => import('./page/register/register').then((m) => m.Register),
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },

  {
    path: 'mascotas',
    component: Pets,
  },

  // Rutas del módulo de Citas
  {
    path: 'mis-citas',
    loadComponent: () => import('./page/citas/mis-citas/mis-citas').then((m) => m.MisCitas),
  },
  {
    path: 'agendar-cita',
    loadComponent: () =>
      import('./page/citas/agendar-cita/agendar-cita').then((m) => m.AgendarCita),
  },
  {
    path: 'calendario-citas',
    loadComponent: () =>
      import('./page/citas/calendario-citas/calendario-citas').then((m) => m.CalendarioCitas),
  },
];
