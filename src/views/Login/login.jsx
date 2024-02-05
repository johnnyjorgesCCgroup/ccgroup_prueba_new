import React, { useState } from 'react';
import { useAuth } from '../../components/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

 
  const handleLogin = async () => {
    try {
   

  const loginResponse = await fetch('https://api.cvimport.com/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: username,
          password: password,
        }),
      });


      if (!loginResponse.ok) {
        throw new Error(`Error al iniciar sesión. Status: ${loginResponse.status}`);
      }

      const loginData = await loginResponse.json();
      console.log('Respuesta de la API:', loginData);

      // Verificar si la respuesta de la API indica una autenticación exitosa
      if (loginData.error) {
        setError('Nombre de usuario o contraseña incorrectos');
      } else {
        // Si la autenticación es exitosa, realiza el login

        login();
        // Almacena el token en localStorage
        localStorage.setItem('token', loginData.access_token);

        // Muestra el token en la consola
        console.log('Token almacenado en LocalStorage:', loginData.token);


        navigate('/');
      }

    } catch (error) {
      // Mostrar el mensaje de error en la pantalla
      setError('Usuario o Contraseña Incorrecta');
      console.error(error);
    }
  };


  const styles = {
    mainLogin: {
      width: '100vw',
      height: '100vh',
      background: '#201b2c',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    leftLogin: {
      width: '50vw',
      height: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
    },
    leftLoginH1: {
      fontSize: '3vw',
      color: '#77ffc0',
    },
    leftLoginImage: {
      width: '35vw',
    },
    rightLogin: {
      width: '50vw',
      height: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    cardLogin: {
      width: '60%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
      padding: '30px 35px',
      background: '#2f2841',
      borderRadius: '20px',
      boxShadow: '0px 10px 40px #00000056',
    },
    cardLoginH1: {
      color: '#0f8',
      fontWeight: 800,
      margin: 0,
    },
    textField: {
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      justifyContent: 'center',
      margin: '10px 0px',
    },
    textFieldInput: {
      width: '100%',
      border: 'none',
      borderRadius: '10px',
      padding: '15px',
      background: '#514869',
      color: '#f0ffffde',
      fontSize: '12pt',
      boxShadow: '0px 10px 40px #00000056',
      outline: 'none',
      boxSizing: 'border-box',
    },
    textFieldLabel: {
      color: '#f0ffffde',
      marginBottom: '10px',
    },
    textFieldPlaceholder: {
      color: '#f0ffff94',
    },
    btnLogin: {
      width: '100%',
      padding: '16px 0px',
      margin: '25px',
      border: 'none',
      borderRadius: '8px',
      outline: 'none',
      textTransform: 'uppercase',
      fontWeight: 800,
      letterSpacing: '3px',
      color: '#2b134b',
      background: '#0f8',
      cursor: 'pointer',
      boxShadow: '0px 10px 40px -12px #00ff8052',
    },
    btnCadastrarSe: {
      fontFamily: 'Noto Sans, sans-serif',
      textTransform: 'uppercase',
      textDecoration: 'none',
      letterSpacing: '2px',
      color: 'white',
    },
    spanCadastrarSe: {
      color: '#0f8',
    },
    btnPlus: {
      width: '100%',
    },
  };

  return (
    <div style={styles.mainLogin}>
      <div style={styles.leftLogin}>
        <h1 style={styles.leftLoginH1}>
          Bienvenidos
          <br />CC GROUP SYSTEM
          <br />
          <br />
        </h1>
        <img
          src="/logoblanco.png"
          style={styles.leftLoginImage}
          alt="Imagem animada"
        />
      </div>
      <div style={styles.rightLogin}>
        <div style={styles.cardLogin}>
          <h1 style={styles.cardLoginH1}>LOGIN</h1>
          <div style={styles.textField}>
            <label htmlFor="usuario" style={styles.textFieldLabel}>
              Usuario
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={styles.textFieldInput}
            />
          </div>
          <div style={styles.textField}>
            <label htmlFor="senha" style={styles.textFieldLabel}>
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.textFieldInput}
            />
          </div>
          <button onClick={handleLogin} style={styles.btnLogin}>
            ENTRAR
          </button>
          <div style={styles.btnPlus}>
            <Link to="/create" style={styles.btnCadastrarSe}>
              No tienes una cuenta? <span style={styles.spanCadastrarSe}>Regístrate</span>
            </Link>
          </div>
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default Login;