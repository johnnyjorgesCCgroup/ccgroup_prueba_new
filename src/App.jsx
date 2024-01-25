import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider } from './components/AuthContext';
import Login from './views/Login/login';
import ProtectedRoutes from './components/ProtectedRoutes';


const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/*"
            element={<ProtectedRoutes />}
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;