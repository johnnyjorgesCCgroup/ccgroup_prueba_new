import React, { useState, useEffect } from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { faTrash } from '@fortawesome/free-solid-svg-icons/faTrash';
import { faEdit } from '@fortawesome/free-solid-svg-icons/faEdit';

import {
  Container,
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Select,
  MenuItem,
} from '@mui/material';
import InputLabel from '@mui/material/InputLabel';
    import Autocomplete from '@mui/material/Autocomplete';
    import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
    import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
    import { DatePicker } from '@mui/x-date-pickers';
    import dayjs from 'dayjs';

const ContentPurchase = () => {
  const [userId, setUserId] = useState('');
  const [date, setDate] = useState(dayjs().format('DD/MM/YYYY'));
  const [proveedor, setProveedor] = useState('');
  const [productos, setProductos] = useState([]);
  const [total, setTotal] = useState(0);  
  const [productoList, setProductoList] = useState(null);
  const [providerList, setProviderList] = useState(null);
  const [selProd, setSelProd] = useState([]);
  const [selProv, setSelProv] = useState([]);
  const [updateCount, setUpdateCount] = useState(0);
  const [nuevoTotal, setNuevoTotal] = useState(0);
  const [newPurchase, setNewPurchase] = useState({ 
    id:'' , 
    provider_id: '',
    purchase_date : '',
    total : ''
  }); 

  const [newPurchaseLine, setNewPurchaseLine] = useState({ 
    id:'' , 
    product_id: '',
    name: '',
    quantity: '',
    sku: '',
    price : ''
  }); 

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    
    // Calcular el nuevo total basándose en los productos actuales
    const nuevoTotalCalculado = productos.reduce((acc, prod) => acc + prod.subtotal, 0);
    // Actualizar el estado de nuevoTotal
    setNuevoTotal(nuevoTotalCalculado);
    console.log(nuevoTotal);
    const username = localStorage.getItem('username');
    setUserId(username);
  }, [updateCount, productos]);

  useEffect(() => {
    obtenerProductosDesdeAPI();
    obtenerProveedoresDesdeAPI();
  }, []);

  const obtenerProductosDesdeAPI = async () => {
    try {
      const response = await fetch('https://api.cvimport.com/api/product');
      if (response.ok) {
        const data = await response.json();
        
        const resultados_final = data.data.map((item) => ({ 
          label: item.name, // Usar 'name' como 'label'
          key: item.id       // Usar 'id' (o la propiedad adecuada) como 'key'
        }));
        
        setProductoList(resultados_final);
        console.log(resultados_final);
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
    }
  };

  const obtenerProveedoresDesdeAPI = async () => {
    try {
      const response = await fetch('https://api.cvimport.com/api/provider');
      if (response.ok) {
        const data = await response.json();
        
        const resultados_final = data.data.map((item) => ({ 
          label: item.name, // Usar 'name' como 'label'
          key: item.id       // Usar 'id' (o la propiedad adecuada) como 'key'
        }));
        
        setProviderList(resultados_final);
        console.log(resultados_final);
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
    }
  };

  const obtenerProductoPorId =  async (event, value) => {
 
    try {
      const response = await fetch(`https://api.cvimport.com/api/product/${value.key}`);
      if (response.ok) {
        const data = await response.json();

        setNewPurchaseLine({ 
          product_id: value.key,
          name: data.data.name,
          sku: data.data.sku ,
          price : data.data.purchase_price,
        }); 
        
        const sel = {
          label: data.data.name, // Reemplaza con el nombre que desees
          key: value.key // Reemplaza con el ID que desees
        };
        setSelProd(sel);

      } else {
        console.error('Error al obtener el producto desde la API');
        setProducto(null);
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
    }
  };

  const agregarProducto = async () => {
    console.log("Cantidad;", newPurchaseLine.quantity);
    if (!newPurchaseLine.product_id || !newPurchaseLine.quantity || newPurchaseLine.quantity <= 0) {
      alert('Selecciona un producto y especifica la cantidad antes de agregarlo.');
      return;
    }
   
 
    // Calcular el subtotal del nuevo producto
    const subtotal = newPurchaseLine.price  * newPurchaseLine.quantity;
    
    // Crear un nuevo objeto de producto en base a la información de la API
    const nuevoPurchaseline = {
      name: newPurchaseLine.name,
      product_id :  newPurchaseLine.product_id, 
      sku: newPurchaseLine.sku,
      quantity:newPurchaseLine.quantity,
      price: newPurchaseLine.price,
      subtotal: subtotal,

    };
        
    setNuevoTotal((prevTotal) => prevTotal + subtotal);
    // Agregar el nuevo producto al estado de productos
    setProductos([...productos, nuevoPurchaseline]);
    setSelProd([]);
    // Limpiar los campos del nuevo producto

    setNewPurchaseLine([]);

    console.log("Purchase Line:" ,newPurchaseLine ) 
  
  };

  const eliminarProducto = (sku) => {
    // Eliminar un producto del estado de productos
    console.log(sku);
    const nuevosProductos = productos.filter((prod) => prod.sku !== sku);
    setProductos(nuevosProductos);
  };

  const enviarOrdenCompra = async () => { 
    // Implementar la lógica para enviar la orden de compra a la API
    try {


      const purchase_line = productos.map((producto) => ({
        product_id: producto.product_id,
        quantity: producto.quantity,
        price: producto.price,
      }));


     const send = {
      "provider_id": proveedor ,
      "purchase_date": date,
      "total": nuevoTotal,
      "purchase_line": purchase_line,
      "user_id":userId
    }

    const response = await fetch('https://api.cvimport.com/api/purchase', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Otros encabezados si es necesario
      },
      body: JSON.stringify(send),
    });
    
    console.log("Envio : ", send  );
    } catch (error) {
      console.error('Error al enviar la orden de compra:', error);
      // Puedes manejar el error de alguna manera (mostrar un mensaje de error, etc.)
    }

  setProductos([]);
  setSelProv([]);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewPurchaseLine((prevPurchase) => ({
      ...prevPurchase,
      [name]: value,
    }));
  };

  const handleInputChangePurchase  = (event, value) => {
    setProveedor( value.key)
    const sele = {
      label: value.label, 
      key: value.key 
    };

    setSelProv(sele);
  } 
    const handleInputDate = (event) => {
      formatDate(event.$d);
    
    };
  
    function formatDate(date) {
      var d = new Date(date),
          month = '' + (d.getMonth() + 1),
          day = '' + d.getDate(),
          year = d.getFullYear();
  
      if (month.length < 2) 
          month = '0' + month;
      if (day.length < 2) 
          day = '0' + day;
          setDate([day, month, year].join('/'));

  }

  const editarProducto = (sku) => {
    const productToEdit = productos.find((prod) => prod.sku === sku);
    console.log("Aquiii:", productToEdit , sku)
    setEditingProduct(productToEdit);
    setIsModalOpen(true);
  };

  const handleModalOpen = () => {
    setIsModalOpen(true);
  };
  
  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const modalContent = (
    <Box
      sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
      }}
    >
      <Typography variant="h6" gutterBottom>
        Editar Cantidad
      </Typography>
      {/* Contenido del modal, por ejemplo, un campo de entrada para la nueva cantidad */}
      <TextField
        fullWidth
        label="Nueva Cantidad"
        type="number"
        name="newQuantity"
        value={editingProduct ? editingProduct.quantity : ''}
        onChange={(event) => handleEditInputChange(event)}
        margin="normal"
      />
      <Button variant="contained" onClick={() => guardarEdicionCantidad()}>
        Guardar
      </Button>
      <Button variant="contained" onClick={handleModalClose}>
        Cancelar
      </Button>
    </Box>
  );

  const handleEditInputChange = (event) => {
    const { value } = event.target;
    setEditingProduct((prevProduct) => ({
      ...prevProduct,
      quantity: value,
    }));
  };

  const guardarEdicionCantidad = () => {
    // Implementar lógica para guardar la edición de cantidad
    // Puedes actualizar el estado y cerrar el modal
    const updatedProducts = productos.map((prod) =>
      prod.sku === editingProduct.sku ? { ...prod, quantity: editingProduct.quantity } : prod
    );
    setProductos(updatedProducts);
    handleModalClose();
  };

  
  return (
    <Container >
      <Grid container marginLeft={10}  spacing={2} alignItems="center">
            <Grid item xs={12} md={12}>
                <br />
            <Typography variant="h5" gutterBottom>
              Registro de Orden de Compra
            </Typography>
            </Grid>
            <Grid item xs={12} md={8}>
       
            <Autocomplete
                value = {selProv || []}
                id="combo-box-demo"
                options={providerList || []}
                sx={{ width:650 }}
                renderInput={(params) => <TextField {...params} label="Proveedor" />}
                onChange={ handleInputChangePurchase }
                />
            </Grid>

            <Grid item xs={12} md={4}>
            <InputLabel>Fecha de Compra</InputLabel>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                defaultValue={dayjs(new Date())}
                onChange={  handleInputDate }
                format="DD/MM/YYYY" />
            </LocalizationProvider>
            </Grid>
          
      
            <Grid item xs={12} md={12}>
            <br /> 
            <Typography variant="h6" gutterBottom>
              Agregue Productos
            </Typography>
            </Grid>
            <Grid container marginLeft={5}  spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
            <Autocomplete
                value = {selProd || []}
                clearOnBlur={true}
                id="combo-box-demo"
                options={productoList || []}  // Añade una verificación para asegurarte de que no sea null
                onChange={obtenerProductoPorId }
                sx={{ width:350 }}
                renderInput={(params) => <TextField {...params} label="Productos" />}
                />



            </Grid>  
            <Grid item xs={12} md={4}>
                <TextField
                fullWidth
                label="Cantidad"
                type="number"
                name="quantity"
                value={newPurchaseLine.quantity || [] }
                onChange={ handleInputChange }
                margin="normal"
                />
            </Grid>
            <Grid item xs={12} md={4}>
            <Button variant="contained" onClick={agregarProducto}>
              Agregar Producto
            </Button>
            </Grid>  
            </Grid>
            <br /> 
            {/* Tabla de productos */}
            <TableContainer component={Paper} sx={{ marginTop: 2 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>SKU</TableCell>
                    <TableCell>Producto</TableCell>
                    <TableCell>Precio</TableCell>
                    <TableCell>Cantidad</TableCell>
                    <TableCell>Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {productos.map((prod) => (
                    <TableRow key={prod.id}>
                      <TableCell>{prod.sku}</TableCell>
                      <TableCell>{prod.name}</TableCell>
                      <TableCell>{prod.price}</TableCell>
                      <TableCell>{prod.quantity}</TableCell>
                      <TableCell>
                      <Button onClick={() => editarProducto(prod.sku)}
                              startIcon={<FontAwesomeIcon icon={faEdit} />}
                            ></Button>
                            <Button onClick={() => eliminarProducto(prod.sku)}
                            startIcon={<FontAwesomeIcon icon={faTrash} />}
                            ></Button>

                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Modal open={isModalOpen} onClose={handleModalClose}>
                  {modalContent}
                </Modal>
            <div style={style.buttonContainer}>
            <Typography variant="h6" gutterBottom>
              Total: {nuevoTotal.toFixed(2)}
            </Typography>

            <Button variant="contained" onClick={enviarOrdenCompra}>
              Enviar Orden de Compra
            </Button>
            </div>           
        </Grid>
   
    </Container>
  );
};

const style  = {
    Container: {
        position: 'absolute',
        width: '1500px',
      },
    
      rowContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
         marginBottom: '5px', 
         padding: '5px',
      },
    
      buttonContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        width: '90%',
        marginTop: '40px',
      },
      createButton: {
        padding: '10px',
        borderRadius: '8px',
        background: '#4CAF50',
        color: '#fff',
        cursor: 'pointer',
      },
      cancelButton: {
        padding: '10px',
        borderRadius: '8px',
        background: '#f44336',
        color: '#fff',
        cursor: 'pointer',
      },
      spaceBetweenElements: {
        marginRight: '10px', // Ajusta el margen entre elementos flexibles según tus necesidades
      },
};


export default ContentPurchase;










