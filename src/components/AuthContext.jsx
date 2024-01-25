import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    // Verificar si hay un token almacenado en localStorage al iniciar la aplicación
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setLoggedIn(true);
    }
  }, []);

  const login = () => {
    setLoggedIn(true);
  };

  const logout = () => {
    // Eliminar el token de localStorage al cerrar sesión
    localStorage.removeItem('token');
    setLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
