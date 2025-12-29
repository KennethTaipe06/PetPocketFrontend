# 📅 Módulo de Gestión de Citas - PetPocket

## 📖 Descripción del Proyecto

Módulo frontend desarrollado en **Angular 18** (standalone components) para la gestión completa de citas veterinarias. Permite a los clientes agendar, visualizar, modificar y cancelar citas para sus mascotas.

---

## 🚀 Guía Rápida - Ejecutar el Proyecto

```bash
# 1. Instalar dependencias
npm install

# 2. Ejecutar servidor de desarrollo
npm start

# 3. Abrir en el navegador
http://localhost:4200/mis-citas
```

**Requisitos previos:**

- Node.js v18+
- Angular CLI v18+
- Backend corriendo en `http://localhost:3000`

---

## 🏗️ Arquitectura Técnica del Frontend

### 1. **Estructura de Componentes**

```
src/app/
├── interfaces/
│   └── cita.interface.ts          # Tipos TypeScript
├── services/
│   └── citas.service.ts           # Comunicación con API
└── page/citas/
    ├── mis-citas/                 # Ver y gestionar citas
    ├── agendar-cita/              # Crear nuevas citas
    └── calendario-citas/          # Vista de calendario
```

### 2. **Flujo de Datos**

```
Usuario → Componente → Servicio → API Backend
                ↓
         Actualización UI (Angular Change Detection)
```

---

## 🎯 Funcionalidades Implementadas

### 📋 **1. Mis Citas** (`/mis-citas`)

**Descripción:** Panel personal del cliente para gestionar sus citas.

**Características:**

- ✅ Visualización de todas las citas
- ✅ Filtrado por estado (Programada, Confirmada, Cancelada, Completada)
- ✅ Acciones: Confirmar, Reprogramar, Cancelar
- ✅ Modal interactivo para reprogramación

**Tecnologías clave:**

- `HttpClient` para llamadas a la API
- `FormsModule` para formularios reactivos
- `ChangeDetectorRef` para actualización manual de la vista
- Operador `?.` (optional chaining) para objetos anidados

### 📝 **2. Agendar Cita** (`/agendar-cita`)

**Descripción:** Formulario completo para crear nuevas citas.

**Proceso técnico:**

1. **Carga de datos:** Se obtienen mascotas, servicios y veterinarios
2. **Validación:** Campos obligatorios y verificación de disponibilidad
3. **Envío:** POST request con objeto `CrearCitaRequest`
4. **Navegación:** Redirección a `/mis-citas` tras éxito

**Validaciones implementadas:**

```typescript
- Mascota: Requerida
- Servicio: Requerido
- Fecha: Requerida (min: hoy)
- Hora: Requerida
- Disponibilidad: Verificación en tiempo real
```

### 📆 **3. Calendario de Citas** (`/calendario-citas`)

**Descripción:** Vista de calendario para veterinarios.

**Características técnicas:**

- **Dos vistas:** Lista detallada y Calendario mensual
- **Generación dinámica:** Cálculo de días del mes con lógica de calendario
- **Filtros avanzados:** Rango de fechas y por veterinario
- **Dashboard:** Estadísticas en tiempo real

---

## 🔧 Implementación Técnica Detallada

### **Interfaces TypeScript**

```typescript
// Estructura de una cita
interface Cita {
  idCita?: number;
  idCliente: number;
  idMascota: number;
  idServicio: number;
  fecha: string;
  hora: string;
  usuarioIdUser?: number;
  estadoCita?: 'programada' | 'confirmada' | 'cancelada' | 'completada';

  // Objetos anidados del backend
  mascota?: { nombre: string; especie: string };
  servicio?: { nombre: string; precio: number };
  veterinario?: { nombre: string } | null;
  detallesMongo?: { motivo?: string; sintomas?: string };
}
```

### **Servicio de Citas**

El `CitasService` maneja toda la comunicación con el backend:

```typescript
@Injectable({ providedIn: 'root' })
export class CitasService {
  private apiUrl = 'http://localhost:3000/cita';

  // GET: Obtener citas del cliente
  obtenerCitasCliente(idCliente: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/cliente/${idCliente}`);
  }

  // POST: Crear nueva cita
  crearCita(datos: CrearCitaRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/crear`, datos);
  }

  // PUT: Cambiar estado de cita
  cambiarEstadoCita(idCita: number, datos: CambiarEstadoCitaRequest) {
    return this.http.put(`${this.apiUrl}/cambiar-estado/${idCita}`, datos);
  }

  // DELETE: Cancelar cita
  cancelarCita(idCita: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/cancelar/${idCita}`);
  }
}
```

### **Ciclo de Vida de una Cita**

```
1. CREAR (agendar-cita)
   └─> POST /cita/crear
       └─> Validaciones frontend
           └─> Verificar disponibilidad
               └─> Enviar datos
                   └─> Redirección a mis-citas

2. VISUALIZAR (mis-citas)
   └─> GET /cita/cliente/:id
       └─> Procesar respuesta
           └─> Aplicar filtros
               └─> Renderizar lista

3. MODIFICAR
   ├─> Confirmar: PUT /cita/cambiar-estado/:id
   ├─> Reprogramar: PUT /cita/reprogramar/:id
   └─> Cancelar: DELETE /cita/cancelar/:id

4. ACTUALIZAR UI
   └─> this.cdr.detectChanges()
       └─> Angular re-renderiza
```

---

## 🎨 Características de UI/UX

### **Sistema de Estados con Colores**

```css
Programada  → Azul   (#2196F3)
Confirmada  → Verde  (#4CAF50)
Cancelada   → Rojo   (#f44336)
Completada  → Morado (#9C27B0)
```

### **Responsive Design**

- Breakpoints: 768px (móvil) y 1024px (tablet)
- Grid adaptable con `grid-template-columns: repeat(auto-fit, minmax(...))`
- Flexbox para componentes dinámicos

---

## 🔄 Gestión de Estado

**Problema resuelto:** Angular no detectaba cambios automáticamente

**Solución implementada:**

```typescript
import { ChangeDetectorRef } from '@angular/core';

private cdr = inject(ChangeDetectorRef);

cargarCitas() {
  this.citasService.obtenerCitasCliente(id).subscribe({
    next: (response) => {
      this.citas = response;
      this.cargando = false;
      this.cdr.detectChanges(); // ← Forzar actualización
    }
  });
}
```

---

## 📡 Endpoints Utilizados

| Método | Endpoint                         | Descripción         |
| ------ | -------------------------------- | ------------------- |
| GET    | `/cita/lista`                    | Todas las citas     |
| GET    | `/cita/cliente/:id`              | Citas de un cliente |
| GET    | `/cita/calendario`               | Calendario de citas |
| GET    | `/cita/verificar-disponibilidad` | Verificar horario   |
| POST   | `/cita/crear`                    | Crear nueva cita    |
| PUT    | `/cita/cambiar-estado/:id`       | Cambiar estado      |
| PUT    | `/cita/reprogramar/:id`          | Reprogramar         |
| DELETE | `/cita/cancelar/:id`             | Cancelar cita       |

---

## 🛠️ Tecnologías y Herramientas

- **Framework:** Angular 18 (Standalone Components)
- **Lenguaje:** TypeScript 5.5+
- **HTTP:** HttpClient con RxJS Observables
- **Formularios:** FormsModule (Template-driven)
- **Routing:** Angular Router con Lazy Loading
- **Estilos:** CSS3 con Flexbox y Grid
- **Detección de cambios:** ChangeDetectorRef

---

## 📝 Decisiones Técnicas Clave

1. **Standalone Components:** Mejor rendimiento y menos boilerplate
2. **Lazy Loading:** Carga bajo demanda de componentes
3. **Optional Chaining (`?.`):** Manejo seguro de objetos anidados
4. **ChangeDetectorRef:** Control manual para respuestas lentas del backend
5. **Datos mock:** Fallback cuando el backend no está disponible

---

## 🎓 Conceptos Aprendidos

- Arquitectura de aplicaciones Angular modernas
- Comunicación HTTP con APIs RESTful
- Gestión de formularios y validaciones
- Manejo de estados y ciclo de vida de componentes
- Responsive design con CSS Grid y Flexbox
- TypeScript strict mode y type safety

---

**¿Preguntas?** Revisa el código en `src/app/page/citas/` 🐾
