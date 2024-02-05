import React, { forwardRef, useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import MUIDataTable from 'mui-datatables';
import { Button, IconButton, Modal, TextField } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
const ContentOperator = () => {
  const [data, setData] = useState([]);
  const [rows, setRows] = useState([]);
  const [updateCount, setUpdateCount] = useState(0);
  const [openModal, setOpenModal] = useState(false);
  const [newOperator, setNewOperator] = useState({ 
    id:'' ,
    name: '', 
    document_type: '' ,
    document_number: '', 
    address: '' ,
    phone_number: ''
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
      const response = await fetch('https://api.cvimport.com/api/worker');
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
        id:'' ,
        name: '', 
        document_type: '' ,
        document_number: '', 
        address: '' ,
        phone_number: ''
    }));

    setRows(rows);
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: 'Desea eliminar esta Operador?',
      text: 'Los campos pueden verse afectados',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Eliminar!',
    }).then(async (result) => {
      fetchData();
      if (result.isConfirmed) {
        try {
          await fetch(`https://api.cvimport.com/api/worker/${id}`, {
            method: 'DELETE',
          });

          Swal.fire({
            icon: 'success',
            title: 'Operario Eliminada!',
            showConfirmButton: false,
            timer: 500,
          });

          setUpdateCount((prevCount) => prevCount + 1);
        } catch (error) {
          setUpdateCount((prevCount) => prevCount + 1);
          console.error('Error deleting Operator:', error);
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

  const ConnectEdit = async (newOperator ) => {
    try {
         console.log("holaXV:", newOperator.id , newOperator);
         const response = await fetch(`https://api.cvimport.com/api/worker/${newOperator.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: newOperator.name,
                serie: newOperator.serie,
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
      const operatorToEdit = data.find((item) => item.id === id);
      if (operatorToEdit) {
        setEditingMode(true);
        setOpenModal(true);
        setNewOperator({ 
            id: id ,  
            name: operatorToEdit.name, 
            document_type: operatorToEdit.serie ,
            document_number: operatorToEdit.serie , 
            address: operatorToEdit.serie,
            phone_number: operatorToEdit.serie
        });
        handleInputChange;
      }
  };


  const handleCreateOperator = async () => {
    try {
      setEditingMode(false);
        const response = await fetch('https://api.cvimport.com/api/worker', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newOperator),
        });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      Swal.fire({
        icon: 'success',
        title: 'Nueva Operador Creada!',
        showConfirmButton: false,
        timer: 1500,
      });

      handleCloseModal();
      setUpdateCount((prevCount) => prevCount + 1);
      fetchData(); // Actualiza los datos después de crear la categoría
    } catch (error) {
      console.error('Error creating Operator:', error);
      setOpenModal(false);
      Swal.fire({
        icon: 'error',
        title: 'An error occurred while creating category!',
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
    setNewOperator((prevOperator) => ({
      ...prevOperator,
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
      label: 'Nombre y Apellidos',
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
              <h1 className="m-0">Operador</h1>
            </div>
            {/* /.col */}
            <div className="col-sm-6">
              <ol className="breadcrumb float-sm-right">
                <li className="breadcrumb-item">
                  <a href="#">Home</a>
                </li>
                <li className="breadcrumb-item active">Operador</li>
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
                    <h3 className="card-title">Listado de Operadores</h3>
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<FontAwesomeIcon icon={faPlusCircle} />}
                      onClick={() => {
                        setEditingMode(false);
                        setOpenModal(true);
                        handleCreateOperator;
                        setNewOperator({ 
                            id:'' ,
                            name: '', 
                            document_type: '' ,
                            document_number: '', 
                            address: '' ,
                            phone_number: ''
                        
                        });
                      }} 
                    >
                      Crear Operador
                    </Button>

                    <Modal open={openModal} 
                          onClose={handleCloseModal}
                          >
                    <div style={style.modalContainer}>
                    <h2 style={{ textAlign: 'center', marginBottom: '20px' }}
                    >{editingMode ? 'Editar Operador' : 'Crear Nueva Operador'}</h2>

                        <TextField
                          label="id"
                          variant="outlined"
                          fullWidth
                          margin="normal"
                          name="id"
                          value= {newOperator.id}
                          style={{ display: 'none' }}
                        />

                        <TextField
                          label="Nombre"
                          variant="outlined"
                          fullWidth
                          margin="normal"
                          name="name"
                          value={newOperator.name}
                          onChange={ handleInputChange }
                        />
                        <InputLabel id="demo-simple-select-label">Tipo de Documento</InputLabel>
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select-autowidth"
                          name="document_type"
                          fullWidth
                          sx={{ color: 'black' }} 
                          value={newOperator.document_type}
                          label="Tipo de Documento"
                          onChange={handleInputChange}
                        >
                          <MenuItem value={"RUC"}>RUC</MenuItem>
                          <MenuItem value={"DNI"}>DNI</MenuItem>
                          <MenuItem value={"PASAPORTE"}>PASAPORTE</MenuItem>
                        </Select>

                        <TextField
                          label="Numero de Documento"
                          variant="outlined"
                          fullWidth
                          margin="normal"
                          name="document_number"
                          value={newOperator.document_number}
                          onChange={  handleInputChange }
                        />
                        <TextField
                          label="Direcciòn"
                          variant="outlined"
                          fullWidth
                          margin="normal"
                          name="address"
                          value={newOperator.address}
                          onChange={  handleInputChange }
                        />

                        <TextField
                          label="Telefono"
                          variant="outlined"
                          fullWidth
                          margin="normal"
                          name="phone_number"
                          value={newOperator.phone_number}
                          onChange={  handleInputChange }
                        />      
                        <div style={style.buttonContainer}>

                        <Button
                          variant="contained"
                          color="primary"
                          style={style.createButton}
                          onClick={() => editingMode ? ConnectEdit(newOperator) : handleCreateOperator()}
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
                            setNewOperator({ id:'' , name: '', serie: '' });
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
    width: '400px',
    backgroundColor: '#fff',
    boxShadow: '0px 0px 14px rgba(0, 0, 0, 0.1)',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: '20px',
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
};

export default ContentOperator;