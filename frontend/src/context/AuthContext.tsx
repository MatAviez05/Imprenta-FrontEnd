import { createContext, useContext, useState, useEffect} from 'react';
import type { ReactNode } from 'react';

// Estructura de usuario
interface User {
  id: string; 
  nombre: string;
  email: string;
  rol: string; 
}

// Contexto
interface AuthContextType {
  user: User | null;         
  token: string | null;      
  isAuthenticated: boolean;  
  login: (email: string, password: string) => Promise<void>; 
  logout: () => void;       
  isLoading: boolean;        
}

// Claves 
const TOKEN_KEY = 'authToken';
const USER_KEY = 'authUser';


const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Helper 
  const decodeToken = (tokenReceived: string): User | null => {
    try {
        const payloadBase64 = tokenReceived.split('.')[1];
        const payloadDecoded = JSON.parse(atob(payloadBase64));
        const userData: User = {
            id: payloadDecoded.userId || 'mock-id',
            nombre: payloadDecoded.userName || 'Usuario Mock',
            email: payloadDecoded.userEmail,
            rol: payloadDecoded.userRole || 'Administrador', 
        };
        return userData;

    } catch (e) {
        console.error("Error al decodificar token:", e);
        return null;
    }
  };


  // Al cargar la app, verifica si hay token guardado
  useEffect(() => {
    const storedToken = localStorage.getItem(TOKEN_KEY);
    
    if (storedToken) {
      const userData = decodeToken(storedToken);
      
      if (userData) {
          setToken(storedToken);
          setUser(userData);
      } else {
          localStorage.removeItem(TOKEN_KEY);
      }
    }

    setIsLoading(false);
  }, []);

  // LogIn SIM 
  const login = async (email: string, password: string) => {

    // Simulacion al Back
    await new Promise(resolve => setTimeout(resolve, 500)); 

    if (email !== 'admin@imprenta.com' || password !== '123456') {
      throw new Error('Datos de inicio incorrectos (Sim)');
    }

    // Sim Respuesta
    const mockPayload = {
      userId: '101',
      userName: 'Admin Principal',
      userEmail: email,
      userRole: 'Administrador',
    };

    // JWT
    const mockToken = 
      `header.${btoa(JSON.stringify(mockPayload)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')}.signature`;

    // Decodificacion de token
    const userData = decodeToken(mockToken);

    if (!userData) {
        throw new Error('Error al procesar el token.');
    }

    // Save
    localStorage.setItem(TOKEN_KEY, mockToken);
    
    // Actualiza estado
    setToken(mockToken);
    setUser(userData);
  };

  // LogOut
  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
  };

  const isAuthenticated = user !== null;
  
  // Valores
  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }

  return context;
}