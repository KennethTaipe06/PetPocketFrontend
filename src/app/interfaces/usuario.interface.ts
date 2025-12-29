export interface RegistroUsuario {
  nameUsers: string;    // Nombre completo
  phoneUser?: string;   // Teléfono (Opcional)
  emailUser: string;    // Correo
  userName: string;     // Nombre de usuario (Login)
  passwordUser: string; // Contraseña
  // No enviamos 'roles' ni 'stateUser' porque el backend los pone por defecto
}
export interface LoginCredentials {
  username: string; 
  password: string;
}
export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    user: {
      id: number;
      name: string;
      email: string;
      username: string;
    };
    token: string;
  };
}