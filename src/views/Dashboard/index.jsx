import React, { useState } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Menu from '../../components/Menu';
import ContentProducts from '../../components/dashboard/dashboardProducts';
import ContentEntradas from '../../components/dashboard/dashboardEntradas';
import ContentSalidas from '../../components/dashboard/dashboardSalidas';
import ContentCortes from '../../components/dashboard/dashboardCortes';
import ContentVentas from '../../components/dashboard/dashboardVentas';
import ContentVtex from '../../components/dashboard/dashboardVtex';
import ContentFalabella from '../../components/dashboard/dashboardFalabella';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

const IndexUser = () => {
  const [activeContent, setActiveContent] = useState('Productos');

  const handleButtonClick = (content) => {
    setActiveContent(content);
  };

  const renderContent = () => {
    switch (activeContent) {
      case 'Productos':
        return <ContentProducts />;
      case 'Entradas':
        return <ContentEntradas />;
      case 'Salidas':
        return <ContentSalidas />;
      case 'Cortes':
        return <ContentCortes />;
      case 'Ventas':
        return <ContentVentas />;
      case 'Vtex':
        return <ContentVtex />;
      case 'Falabella':
        return <ContentFalabella />;
      default:
        return null;
    }
  };

  return (
    <>
      <Header />
      <Menu />
      <div className='content-wrapper d-flex justify-content-center align-items-center' style={{ backgroundColor: "white" }}>
        <Stack direction="row" spacing={2} style={{ margin: 20 }}>
          <Button variant={activeContent === 'Productos' ? 'contained' : 'outlined'} onClick={() => handleButtonClick('Productos')}>Productos</Button>
          <Button variant={activeContent === 'Entradas' ? 'contained' : 'outlined'} onClick={() => handleButtonClick('Entradas')}>Entradas</Button>
          <Button variant={activeContent === 'Salidas' ? 'contained' : 'outlined'} onClick={() => handleButtonClick('Salidas')}>Salidas</Button>
          <Button variant={activeContent === 'Cortes' ? 'contained' : 'outlined'} onClick={() => handleButtonClick('Cortes')}>Cortes</Button>
          <Button variant={activeContent === 'Ventas' ? 'contained' : 'outlined'} onClick={() => handleButtonClick('Ventas')}>Ventas</Button>
          <Button variant={activeContent === 'Vtex' ? 'contained' : 'outlined'} onClick={() => handleButtonClick('Vtex')} color="secondary">Vtex</Button>
          <Button variant={activeContent === 'Falabella' ? 'contained' : 'outlined'} onClick={() => handleButtonClick('Falabella')} color="success">Falabella</Button>
        </Stack>
      </div>
      {renderContent()}
      <Footer />
    </>
  );
};

export default IndexUser;
