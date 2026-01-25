import { createContext, useContext, useState, useEffect} from 'react';
import type { ReactNode } from 'react';

// Estructura de usuario
interface User {
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
    const storedToken = localStorage.getItem('token');
    
    if (storedToken) {
      const userData = decodeToken(storedToken);
      
      if (userData) {
          setToken(storedToken);
          setUser(userData);
      } else {
          localStorage.removeItem('token');
      }
    }

    setIsLoading(false);
  }, []);

  // Login
  const login = async (email: string, password: string) => {
    try{

      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/clientes/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: email,
          contraseña: password
        })
      })

      const tokenReceived = await response.json()

      const userData = decodeToken(tokenReceived);

      if (!userData) {
          throw new Error('Error al procesar el token.');
      }

      // Save
      localStorage.setItem('token', tokenReceived);
      
      // Actualiza estado
      setToken(tokenReceived);
      setUser(userData);

    }catch(error:any){

      console.error('Error en login:', error);
      throw new Error(error.response?.data?.message || 'Error al iniciar sesión');
    }
    
  };

  // LogOut
  const logout = () => {
    localStorage.removeItem('token');
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