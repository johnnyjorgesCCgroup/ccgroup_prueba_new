import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    // Verificar si hay un token almacenado en localStorage al iniciar la aplicación
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setLoggedIn(true);
      const storedUsername = localStorage.getItem('username');
      setUser({ username: storedUsername });
    }
  }, []);

  const login = () => {
    setLoggedIn(true);
    setUser({ username });
    localStorage.setItem('username', username.value);
   

  };

  const logout = () => {
    // Eliminar el token de localStorage al cerrar sesión
    localStorage.removeItem('token');
    setLoggedIn(false);
    localStorage.removeItem('username');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user , isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
