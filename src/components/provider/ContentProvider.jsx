import React, { forwardRef, useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import MUIDataTable from 'mui-datatables';
import { Button, IconButton, Modal, TextField } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';
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

const ContentProvider = () => {
  const [data, setData] = useState([]);
  const [rows, setRows] = useState([]);
  const [updateCount, setUpdateCount] = useState(0);
  const [openModal, setOpenModal] = useState(false);
  const [newProvider, setNewProvider] = useState({ 
    id:'' , 
    name: '', 
    commercial_name:'' , 
    document_type: '', 
    document_number:'' , 
    phone_number: '', 
    email:'' , 
    supplier_type: '', 
    address: '',
    contact_person:'' , 
    phone_contact_person: '', 
    comment: ''
});
  //Avisa si es edit al componente
  const [editingMode, setEditingMode] = useState(false);


  const options = {
    filterType: 'checkbox',
    print: false,
    search: true, 
  };

  useEffect(() => {
    fetchData();
  }, [updateCount]);

  const fetchData = async () => {
    try {
      const response = await fetch('https://api.cvimport.com/api/provider');
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const valor = await response.json();
      setData(valor.data);
      updateTableRows(valor.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const updateTableRows = (data) => {
    const rows = data.map((item) => ({
      id: item.id,
      name: item.name,
      serie: item.serie,
    }));

    setRows(rows);
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: 'Desea eliminar este Provedor?',
      text: 'Los campos pueden estar asociados a OC',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Eliminar!',
    }).then(async (result) => {
      fetchData();
      if (result.isConfirmed) {
        try {
          await fetch(`https://api.cvimport.com/api/provider/${id}`, {
            method: 'DELETE',
          });

          Swal.fire({
            icon: 'success',
            title: 'Provedor Eliminada!',
            showConfirmButton: false,
            timer: 500,
          });

          setUpdateCount((prevCount) => prevCount + 1);
        } catch (error) {
          setUpdateCount((prevCount) => prevCount + 1);
          console.error('Error deleting provedor:', error);
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

  const ConnectEdit = async (newProvider ) => {
    try {
         console.log("holaXV:", newProvider.id , newProvider);
         const response = await fetch(`https://api.cvimport.com/api/provider/${newProvider.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: newProvider.name,
                commercial_name: newProvider.commercial_name,
                document_type: newProvider.document_type,
                document_number: newProvider.document_number,
                phone_number: newProvider.phone_number,
                email: newProvider.email,
                supplier_type: newProvider.supplier_type,
                address: newProvider.address,
                contact_person: newProvider.contact_person,
                phone_contact_person: newProvider.phone_contact_person,
                comment: newProvider.comment,

            }),
        });
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
      const providerToEdit = data.find((item) => item.id === id);
      if (providerToEdit) {
        setEditingMode(true);
        setOpenModal(true);
        setNewProvider({ 
            
            id: id ,   
            name: providerToEdit.name, 
            commercial_name: providerToEdit.commercial_name ,   
            document_type: providerToEdit.document_type, 
            document_number: providerToEdit.document_number, 
            phone_number: providerToEdit.phone_number   , 
            email: providerToEdit.email ,   
            supplier_type: providerToEdit.supplier_type, 
            address: providerToEdit.address, 
            contact_person: providerToEdit.contact_person ,   
            phone_contact_person: providerToEdit.phone_contact_person, 
            comment: providerToEdit.comment, 
        });
        handleInputChange;
      }
  };


  const handleCreateProvider = async () => {
    try {
      setEditingMode(false);
        const response = await fetch('https://api.cvimport.com/api/provider', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newProvider),
        });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      Swal.fire({
        icon: 'success',
        title: 'Nuevo Provedor Creado!',
        showConfirmButton: false,
        timer: 1500,
      });

      handleCloseModal();
      setUpdateCount((prevCount) => prevCount + 1);
      fetchData(); // Actualiza los datos después de crear la categoría
    } catch (error) {
      console.error('Error creating category:', error);
      setOpenModal(false);
      Swal.fire({
        icon: 'error',
        title: 'An error occurred while creating Provider!',
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if(editingMode){
      const { name, value } = event.target.value;
    };
    setNewProvider((prevProvider) => ({
      ...prevProvider,
      [name]: value,
    }));
  };

 
  const columns = [
    {
      name: 'id',
      label: 'Id',
      options: {
        display: false,
        searchable: true,
      },
    },
    {
      name: 'name',
      label: 'Nombre',
      options: {
        searchable: true,
      },
    },

    {
      name: 'commercial_name',
      label: 'Nombre Comercial',
      options: {
        searchable: true,
      },
    },

    {
      name: 'document_type',
      label: 'Tipo de Documento',
      options: {
        searchable: true,
      },
    },

    {
      name: 'document_number',
      label: 'Numero de Documento',
      options: {
        searchable: true,
      },
    },

    {
      name: 'phone_number',
      label: 'Telefono',
      options: {
        searchable: true,
      },
    },

    {
      name: 'Actions',
      label: 'Acciones',
      options: {
        customBodyRender: (value, tableMeta) => (
          <>
            <IconButton
              color="success"
              onClick={() => handleEdit(tableMeta.rowData[0]  )  }
              className="mx-2"
            >
              <FontAwesomeIcon icon={faEdit} />
            </IconButton>
            <IconButton
              color="primary"
              onClick={() => handleDelete(tableMeta.rowData[0])}
              className="mx-2"
            >
              <FontAwesomeIcon icon={faTrash} />
            </IconButton>
          </>
        ),
      },
    },
  ];

  return (
    <div className="content-wrapper">
      {/* Content Header (Page header) */}
      <div className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1 className="m-0">Provedores</h1>
            </div>
            {/* /.col */}
            <div className="col-sm-6">
              <ol className="breadcrumb float-sm-right">
                <li className="breadcrumb-item">
                  <a href="#">Home</a>
                </li>
                <li className="breadcrumb-item active">Provedores</li>
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
                    <h3 className="card-title">Listado de Provedores</h3>
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<FontAwesomeIcon icon={faPlusCircle} />}
                      onClick={() => {
                        setEditingMode(false);
                        setOpenModal(true);
                        handleCreateProvider;
                        setNewProvider({
                            id:'' , 
                            name: '', 
                            commercial_name:'' , 
                            document_type: '', 
                            document_number:'' , 
                            phone_number: '', 
                            email:'' , 
                            supplier_type: '', 
                            address: '',
                            contact_person:'' , 
                            phone_contact_person: '', 
                            comment: ''
                            
                            });
                      }} 
                    >
                      Crear Provedores
                    </Button>

                    <Modal open={openModal} 
                          onClose={handleCloseModal}
                          >
                    <div style={style.modalContainer}>
                    <h2 style={{ textAlign: 'center', marginBottom: '20px' }}
                    >{editingMode ? 'Editar Proveedor' : 'Crear Nuevo Proveedor'}</h2>
              
                    <Grid container spacing={2} alignItems="center">
                        <TextField
                          label="id"
                          variant="outlined"
                          fullWidth
                          margin="normal"
                          name="id"
                          value= {newProvider.id}
                          style={{ display: 'none' }}
                        />            

                    </Grid>
              


                    <Grid container spacing={1} alignItems="center">
                    <Grid item xs={12} md={12}>

                        <TextField
                          label="Nombre"
                          variant="outlined"
                          fullWidth
                          margin="normal"
                          name="name"
                          value={newProvider.name}
                          onChange={ handleInputChange }
                        />
                    </Grid>
                    </Grid>

                    <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={6}>
                        <TextField
                          label="Nombre Comercial"
                          variant="outlined"
                          fullWidth
                          margin="normal"
                          name="commercial_name"
                          value={newProvider.commercial_name}
                          onChange={  handleInputChange }
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>

                        <InputLabel id="demo-simple-select-label">Tipo de Documento</InputLabel>
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select-autowidth"
                          name="document_type"
                          fullWidth
                          sx={{ color: 'black' }} 
                          value={newProvider.document_type}
                          label="Tipo de Documento"
                          onChange={handleInputChange}
                        >
                          <MenuItem value={"RUC"}>RUC</MenuItem>
                          <MenuItem value={"DNI"}>DNI</MenuItem>
                          <MenuItem value={"PASAPORTE"}>PASAPORTE</MenuItem>
                        </Select>

                    </Grid>
                    </Grid>
                     

                    <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={6}>
                        <TextField
                          label="Numero de Documento"
                          variant="outlined"
                          fullWidth
                          margin="normal"
                          name="document_number"
                          value={newProvider.document_number}
                          onChange={  handleInputChange }
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                          label="Telefono"
                          variant="outlined"
                          fullWidth
                          margin="normal"
                          name="phone_number"
                          value={newProvider.phone_number}
                          onChange={  handleInputChange }
                        />
                    </Grid>
                    </Grid>

                    <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={6}>
                        <TextField
                          label="Email"
                          variant="outlined"
                          fullWidth
                          margin="normal"
                          name="email"
                          value={newProvider.email}
                          onChange={  handleInputChange }
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>

                    <InputLabel id="demo-select-small-label">Tipo de Proveedor</InputLabel>
                        <Select
                          labelId="demo-select-small-label"
                          id="demo-select-small-label"
                          name="supplier_type"
                          fullWidth
                          value={newProvider.supplier_type}
                          label="Tipo de Proveedor"
                          sx={{ color: 'black' }} 
                          onChange={handleInputChange}
                        >
                          <MenuItem value={"IMPORTADORA"}>IMPORTADORA</MenuItem>
                          <MenuItem value={"DISTRIBUIDORA"}>DISTRIBUIDORA</MenuItem>
                        </Select>

                    </Grid>
                    </Grid>

                    <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={6}>
                        <TextField
                          label="Dirección"
                          variant="outlined"
                          fullWidth
                          margin="normal"
                          name="address"
                          value={newProvider.address}
                          onChange={  handleInputChange }
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                          label="Persona de Contacto"
                          variant="outlined"
                          fullWidth
                          margin="normal"
                          name="contact_person"
                          value={newProvider.contact_person}
                          onChange={  handleInputChange }
                        />
                    </Grid>
                    </Grid>

                    <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={6}>
                        <TextField
                          label="Telefono Contacto"
                          variant="outlined"
                          fullWidth
                          margin="normal"
                          name="phone_contact_person"
                          value={newProvider.phone_contact_person}
                          onChange={  handleInputChange }
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                          label="Comentario"
                          variant="outlined"
                          fullWidth
                          margin="normal"
                          name="comment"
                          value={newProvider.comment}
                          onChange={  handleInputChange }
                        />
                    </Grid>
                    </Grid>

                        <div style={style.buttonContainer}>

                        <Button
                          variant="contained"
                          color="primary"
                          style={style.createButton}
                          onClick={() => editingMode ? ConnectEdit(newProvider) : handleCreateProvider()}
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
                            setNewProvider({ 
                                id:'' , 
                                name: '', 
                                commercial_name:'' , 
                                document_type: '', 
                                document_number:'' , 
                                phone_number: '', 
                                email:'' , 
                                supplier_type: '', 
                                address: '',
                                contact_person:'' , 
                                phone_contact_person: '', 
                                comment: ''
                             });
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
                      <MUIDataTable columns={columns} data={data} options={options} />
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

export default ContentProvider;