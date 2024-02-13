import React, { forwardRef, useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import MUIDataTable from 'mui-datatables';
import { Button, IconButton, Modal, TextField } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers';
import Grid from '@mui/material/Grid';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import OnlinePrediction from '@mui/icons-material/OnlinePrediction'
import dayjs from 'dayjs';

import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

import {
  GridRowModes,
  DataGrid,
  GridToolbarContainer,
  GridActionsCellItem,
  GridRowEditStopReasons,
} from '@mui/x-data-grid';
import {
  randomCreatedDate,
  randomTraderName,
  randomId,
  randomArrayItem,
} from '@mui/x-data-grid-generator';

import * as XLSX from 'xlsx';

const ContentCut = () => {

  const [pdf, setPdf] = useState(null);
  const [subCategoryId, setsubCategoryIdy] = useState(null);
  const [selectSubCategory, setSelectSubCategory] = useState(null);
  const [select, setSelect] = useState(null);
  const [date, setDate] = useState(null);
  const [data, setData] = useState([]);
  const [rows, setRows] = useState([]);
  const [updateCount, setUpdateCount] = useState(0);
  const [openModal, setOpenModal] = useState(false);
  const [newProduct, setNewProduct] = useState({ 
                                                id:'' , 
                                                name: '', 
                                                sku:'' , 
                                                purchase_price: '', 
                                                selling_price:'' , 
                                                entry_date: '', 
                                                category_id:'' ,
                                                subcategory_id:'' , 
                                                unit: '', 
                                                status: '',
                                                initial_stock:'' , 
                                                min_stock: '',
                                            });
  //Avisa si es edit al componente
  const [editingMode, setEditingMode] = useState(false);
  const [file, setFile] = useState(null);
  const [jsonData, setJsonData] = useState('');

  const handleFileChange = (event) => {
    console.log(event);
    setSelectedFile(event.target.files[0]);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(event);
    if (!selectedFile) {
      console.error('No file selected');
      return;
    }

    const reader = new FileReader();

    console.log("Aqqui Json data:",reader);
    reader.onload = (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      console.log("Aqqui Json data:",jsonData);
      // Enviar los datos a la API
    //  sendDataToAPI(jsonData);
    };

  };


  useEffect(() => {

    fetchData();
    fetchDataSelect();
  }, [updateCount]);

  const fetchData = async () => {
    try {
      const response = await fetch('https://api.cvimport.com/api/inventoryMoves');
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const valor = await response.json();


      setData(valor.data);
      updateTableRows(valor.data);
      setPdf(valor.data);
       
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const fetchDataSelect = async () => {
    try {
    const response_category = await fetch('https://api.cvimport.com/api/category');
    if (!response_category.ok) {
      throw new Error(`HTTP error! Status: ${response_category.status}`);
    }
    const valor_select = await response_category.json();
    console.log(valor_select.data);
    updateSelects(valor_select.data);

  } catch (error) {
    console.error('Error fetching data:', error);
  }
  };

  const fetchDataSelectSubCategory = async (id) => {
    try {
      console.log(id);
    const response_category = await fetch('https://api.cvimport.com/api/subcategory');
    if (!response_category.ok) {
      throw new Error(`HTTP error! Status: ${response_category.status}`);
    }
    const valor_select = await response_category.json();

    const resultados =  valor_select.data.filter(objeto => objeto.category_id === id);
    setsubCategoryIdy(id);
    const resultados_final = resultados.map((item) => ({  
      key: item.id,      
      value: item.name 
    }));     
  
    setNewProduct((prevProduct) => ({
      ...prevProduct,
      'category_id': id,
    }));
    setSelectSubCategory(resultados_final);

  } catch (error) {
    console.error('Error fetching data:', error);
  }
  };


  const fetchDataSelectSubCategoryEdit = async (id) => {
    try {
      console.log(id);
    const response_category = await fetch('https://api.cvimport.com/api/inventoryMoves');
    if (!response_category.ok) {
      throw new Error(`HTTP error! Status: ${response_category.status}`);
    }
    const valor_select = await response_category.json();

    const resultados =  valor_select.data.filter(objeto => objeto.category_id === id);
 
    const resultados_final = resultados.map((item) => ({  
      key: item.id,      
      value: item.name 
    }));     
  
    setSelectSubCategory(resultados_final);

  } catch (error) {
    console.error('Error fetching data:', error);
  }
  };


  const updateSelects = (data) => {  
  
    const rows = data.map((item) => ({  
      key: item.id,      
      value: item.name 
    }));     
    console.log(rows); 
    setSelect(rows);                
  };

  const updateTableRows = (data) => {
    const rows = data.map((item) => ({
      id: item.id,
      serie: item.serie,
      nameProduct: item.nameProduct,
      skuProduct: item.skuProduct,
      almacen: item.almacen,
      tipo: item.tipo,
      quantity: item.quantity,
      price: item.price,
      document_number: item.document_number,
      
    }));
    setRows(rows);
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: 'Desea eliminar este Producto?',
      text: 'Los campos como stock pueden verse afectados',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Eliminar!',
    }).then(async (result) => {
      fetchData();
      if (result.isConfirmed) {
        try {
          await fetch(`https://api.cvimport.com/api/product/${id}`, {
            method: 'DELETE',
          });

          Swal.fire({
            icon: 'success',
            title: 'Productos Eliminada!',
            showConfirmButton: false,
            timer: 500,
          });

          setUpdateCount((prevCount) => prevCount + 1);
        } catch (error) {
          setUpdateCount((prevCount) => prevCount + 1);
          console.error('Error deleting category:', error);
          Swal.fire({
            icon: 'error',
            title: 'An error occurred while deleting!',
            showConfirmButton: false,
            timer: 500,
          });
        }
      }
    });
  };

  const handleOpenModal = () => {
      setOpenModal(true);
    };

  const handleCloseModal = () => {
      setOpenModal(false);
    };

  const ConnectEdit = async (newProduct ) => {
    try {
         console.log("holaXV:", newProduct.id , newProduct);
         const response = await fetch(`https://api.cvimport.com/api/product/${newProduct.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              id: newProduct.id,
              name: newProduct.name,
              sku: newProduct.sku,
              purchase_price: newProduct.purchase_price,
              selling_price: newProduct.selling_price,
              entry_date: newProduct.entry_date,
              category_id: newProduct.category_id,
              unit: newProduct.unit,
              status: newProduct.status,
              subcategory_id: newProduct.subcategory_id,
              initial_stock: newProduct.initial_stock,
              min_stock: newProduct.min_stock,
              stock: newProduct.stock,  
            }),
        });
        console.log()
        handleCloseModal();
        setUpdateCount((prevCount) => prevCount + 1);
        fetchData(); // Actualiza los datos después de crear la categoría
    } catch (error) {
        // Si hay un error durante la solicitud
        console.log(error);
        Swal.fire({
            icon: 'error',
            title: 'Un error ha ocurrido',
            showConfirmButton: false,
            timer: 1500
        });
    } 

  };

  const handleEdit = async ( id ) => {
      const ProductToEdit = data.find((item) => item.id === id);
      fetchDataSelectSubCategoryEdit(ProductToEdit.category_id);
      console.log(ProductToEdit, select , selectSubCategory );

      if (ProductToEdit) {
        setEditingMode(true);
        setOpenModal(true);
        setNewProduct({ id: ProductToEdit.id ,  
           name: ProductToEdit.name, 
           serie: ProductToEdit.serie ,
           status: ProductToEdit.status         ,  
           sku: ProductToEdit.sku ,   
           category_id: ProductToEdit.category_id , 
           subcategory_id: ProductToEdit.subcategory_id ,   
           initial_stock: ProductToEdit.initial_stock ,
           min_stock: ProductToEdit.min_stock ,
           purchase_price: ProductToEdit.purchase_price  ,         
           selling_price: ProductToEdit.selling_price ,
          });
        console.log(newProduct);
        handleInputChange;
      }
  };


  const handleCreateProduct = async () => {


    console.log("handleCreateProduct ; ", newProduct );
    try {
      setEditingMode(false);
      const response = await fetch('https://api.cvimport.com/api/product', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(
            {
               
                sku: newProduct.sku , 
                name: newProduct.name, 
                purchase_price: newProduct.purchase_price, 
                selling_price: newProduct.selling_price , 
                entry_date: date, 
                category_id: subCategoryId , 
                subcategory_id: newProduct.subcategory_id  , 
                initial_stock:newProduct.initial_stock , 
                min_stock: newProduct.min_stock,
                stock: newProduct.stock, 
            }
        ),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      Swal.fire({
        icon: 'success',
        title: 'Nuevo Producto creado!',
        showConfirmButton: false,
        timer: 1500,
      });

      handleCloseModal();
      setUpdateCount((prevCount) => prevCount + 1);
      fetchData(); // Actualiza los datos después de crear la categoría
    } catch (error) {
      setOpenModal(false);
      console.error('Error creating category:', error);
      Swal.fire({
        icon: 'error',
        title: 'El Nombre de Producto ya existe!',
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };

  const handleInputChangeSelect = (event) => {
    setCategoryId(event.value);
    fetchDataSelect()
  };

  const handleInputChange = (event) => {

    const { name, value } = event.target;
    console.log(newProduct);
    setNewProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));
  };

  const secondSelect = (event) => {
    const id = event.target.value;
     setSelectSubCategory(event.target.value);
    fetchDataSelectSubCategory(id);
  };

  
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
        setDate([year, month, day].join('-'));
        console.log( "Aquiiii date:" , date, [year, month, day].join('-'));

}

const getSku = async (event)  => {
  console.log("Aqui Edicion :",editingMode);
  if( editingMode == 0){
try {
  console.log("holaXV:", subCategoryId);

  const response = await fetch(`https://api.cvimport.com/api/product/ObteinSku/${event.target.value}`);
  const valor = await response.json();
  setNewProduct((prevProduct) => ({
    ...prevProduct,
    'sku': valor.data,
  }));

 console.log("holaXVVVVVV:", valor);
} catch (error) {
 // Si hay un error durante la solicitud
 console.log(error);

} 
}
};



const handleStatus = async (id)  => {
  try {  
    const response = await fetch(`http://161.132.40.129/api/product/statusUpdate/${id}`);
    const valor = await response.json();
    setNewProduct((prevProduct) => ({
      ...prevProduct,
      'status': valor.data.status,
    }));
    fetchData();
   console.log("holaXVVVVVV:", valor.data.status);
  } catch (error) {
   // Si hay un error durante la solicitud
   console.log(error);
  
  } 
  
  };
const getSubCatId = async (event)  => {
  setNewProduct((prevProduct) => ({
    ...prevProduct,
    'subcategory_id': event.target.value,
  }));


};

const blobToFile = (blob, fileName) => {
  const file = new File([blob], fileName, { type: blob.type });
  return file;
};

  const handleDownload = () => {
 
    // Crear un libro de Excel
    console.log("pdf :",pdf);
    const workbook = XLSX.utils.book_new();
    const sheetData = pdf.map(item => [
     `${item.sku.substring(0,1)}00`,
      item.categoria,
      item.sku.substring(0, 3),
      item.subcategoria,
      item.sku,
      "NEW PROD",
      item.name,
      item.unit,
      item.purchase_price,
      "NEW PROD", 
      item.updated_at,
      "ADMIN",
      item.status === 1 ? 'ACTIVO' : 'DESHABILITADO', // Modificado para mostrar "Activo" o "Inactivo"
      "ACTUAL", 
    ]);    
    
    const worksheet = XLSX.utils.aoa_to_sheet([['COD_CAT', 'CATEGORÍA', 'COD_SUB CAT', 'COD_SUB CAT', 'CÓDIGO', 'SKU  ', 'DESCRIPCIÓN', 'U.M.', 'COSTO', 'PROVEEDOR', 'ULT MODIFICACIÓN', 'USER' , 'ESTADO', 'PRICE STATUS' ], ...sheetData]);

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Datos');

    // Cambiado el tipo de blob a 'array' en lugar de 'blob'
    const blob = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

    // Convertir el blob a un objeto File
    const file = blobToFile(new Blob([blob]), 'datos.xlsx');

    // Crear un objeto URL para el blob del File
    const url = URL.createObjectURL(file);

    // Crear un enlace de descarga y hacer clic en él para iniciar la descarga
    const a = document.createElement('a');
    a.href = url;
    a.download = 'datos.xlsx';
    document.body.appendChild(a);
    a.click();

    // Limpiar el objeto URL y el enlace
    URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

const columns = [
    {
      field : 'id',
      headerName: 'Id',
      options: {
        display: false,
      },
      width: 40,
    },
    {
      field: 'serie',
      headerName: 'Serie',
    
    },
    {
      field: 'nameProduct',
      headerName: 'Nombre',
      width: 305,
    },
    {
      field: 'skuProduct',
      headerName: 'SKU',
    },
    {
      field: 'almacen',
      headerName: 'Almacen',
    },
    
    {
      field: 'tipo',
      headerName: 'Tipo',
     
    },
    {
      field: 'quantity',
      headerName: 'Cantidad',
  
    },
    {
      field: 'document_number',
      headerName: 'Documento  ',
      width: 155,
    },
    {
      field: 'status',
      headerName: 'Status',
        options: {
          searchable: true,
        },
      valueFormatter: (params) => (params.value === 1 ? 'ANULADO' : 'FINALIZADO'),

    },   
            
    {
      field: 'Actions',
      type: 'actions',
      width: 130,
      headerName: 'Acciones',
      cellClassName: 'actions',
      getActions: ({ id }) => {
        return [

          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={() => handleDelete(id )}
            color="warning"
          />,
        ];  
      },
    },
  ];

  const handleConvert = () => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = e.target.result;
        const workbook = XLSX.read(data, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json(worksheet);
        setJsonData(JSON.stringify(json, null, 2));
      };
      reader.readAsBinaryString(file);
    }
  };

  
  const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
  });

  return (
    <div className="content-wrapper">
      {/* Content Header (Page header) */}
      <div className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1 className="m-0">Cortes</h1>
            </div>
            {/* /.col */}
            <div className="col-sm-6">
              <ol className="breadcrumb float-sm-right">
                <li className="breadcrumb-item">
                  <a href="#">Home</a>
                </li>
                <li className="breadcrumb-item active">v</li>
              </ol>
            </div>
            {/* /.col */}
          </div>
          {/* /.row */}
        </div>
        {/* /.container-fluid */}
      </div>
      <div className="content">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-header border-0">
                  <div className="d-flex justify-content-between">
                    <h3 className="card-title">Listado de Cortes</h3>

                      <input type="file" accept=".xls,.xlsx" onChange={e => setFile(e.target.files[0])} />

                         <Button
                          variant="contained"
                          color="blue"
                          onClick={handleConvert}                    >
                          Cargar Saga Falabella
                        </Button>

                      <pre>{jsonData}</pre>


                    <Modal open={openModal} 
                          onClose={handleCloseModal}
                          >
                    <div style={style.modalContainer}>
                    <h2 style={{ textAlign: 'center', marginBottom: '20px' }}
                    >{editingMode ? 'Editar Producto' : 'Crear Nuevo Producto'}</h2>
              
                    <Grid container spacing={2} alignItems="center">
                        <TextField
                          label="id"
                          variant="outlined"
                          fullWidth
                          margin="normal"
                          name="id"
                          value= {newProduct.id}
                          style={{ display: 'none' }}
                        />            
                   <Grid item xs={12} md={6}>
                        <InputLabel>SKU</InputLabel>
                        <TextField
                          fullWidth
                          name="sku"
                          value={newProduct.sku}
                          variant="filled"
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                    <InputLabel>Fecha de Ingreso</InputLabel>

                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DatePicker
                            defaultValue={dayjs(new Date())}
                            onChange={  handleInputDate }
                            format="DD/MM/YYYY" />
                      </LocalizationProvider>
                      </Grid>
                    </Grid>
              
                    <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={6}>
                          <InputLabel id="demo-simple-select-standard-label">Categoria</InputLabel>
                          <Select 
                              label="Categoria"
                              labelId="demo-simple-select-standard-label"
                              fullWidth
                              value = {newProduct.category_id}
                              onChange={  secondSelect }
                              sx={{ color: 'black' }} 
                          >

                          {Array.isArray(select) && select.length > 0 ? (
                              select.map((item) => (
                                <MenuItem  value={item.key}>
                                  {item.value}
                                </MenuItem>
                              ))
                            ) : (
                              <MenuItem value="" disabled>
                                No hay categorías disponibles
                              </MenuItem>
                            )}


                          </Select>
                    </Grid>
                    

                    <Grid item xs={12} md={6}>
                          <InputLabel id="demo-simple-select-standard-label">Sub Categoria</InputLabel>
                          <Select 
                              label="SubCategoria"
                              labelId="demo-simple-select-standard-label"
                              fullWidth
                              value = {newProduct.subcategory_id}
                              onChange={(event) => {
                                // Primero, llama a la función para obtener el ID de la subcategoría
                                getSubCatId(event);
                                // Luego, llama a la función para obtener el SKU
                                getSku(event);
                              }}
                              sx={{ color: 'black' }} 
                          >
                            {Array.isArray(selectSubCategory) && select.length > 0 ? (
                              selectSubCategory.map((item) => (
                                <MenuItem  value={item.key}>
                                  {item.value}
                                </MenuItem>
                              ))
                            ) : (
                              <MenuItem value="" disabled>
                                No hay sub categorías disponibles
                              </MenuItem>
                            )}
                          </Select>
                    </Grid>
                    </Grid>

                    <Grid container spacing={1} alignItems="center">
                    <Grid item xs={12} md={12}>

                        <TextField
                          label="Nombre"
                          variant="outlined"
                          fullWidth
                          margin="normal"
                          name="name"
                          value={newProduct.name}
                          onChange={ handleInputChange }
                        />
                    </Grid>
                    </Grid>

                    <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={6}>
                        <TextField
                          label="Precio de Compra"
                          variant="outlined"
                          fullWidth
                          margin="normal"
                          name="purchase_price"
                          value={newProduct.purchase_price}
                          onChange={  handleInputChange }
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                          label="Precio de Venta"
                          variant="outlined"
                          fullWidth
                          margin="normal"
                          name="selling_price"
                          value={newProduct.selling_price}
                          onChange={  handleInputChange }
                        />
                    </Grid>
                    </Grid>
                     


                        <div style={style.buttonContainer}>

                        <Button
                          variant="contained"
                          color="primary"
                          style={style.createButton}
                          onClick={() => editingMode ? ConnectEdit(newProduct) : handleCreateProduct()}
                          > 
                            {editingMode ? 'Editar' : 'Crear'}
                        </Button>
                        <Button
                          variant="contained"
                          color="secondary"
                          style={style.cancelButton}
                          onClick={() => {
                            setOpenModal(false);
                            setEditingMode(false);
                            setNewProduct({ id:'' , name: '', serie: '' });
                          }}                      >
                          Cancelar
                        </Button>
                        </div>
                      </div>
                    </Modal>
                  </div>
                </div>
                <div className="card-body">
                  <div className="row">
             
                    <div className="col-lg-12">
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        initialState={{
                          pagination: {
                            paginationModel: { page: 0, pageSize: 50 },
                          },
                        }}
                        pageSizeOptions={[5, 10]}
                        
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const style  = {
  modalContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '5 00px',
    backgroundColor: '#fff',
    boxShadow: '0px 0px 14px rgba(0, 0, 0, 0.1)',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
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

export default ContentCut;



