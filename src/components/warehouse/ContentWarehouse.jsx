import React, { forwardRef, useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import MUIDataTable from 'mui-datatables';
import { Button, IconButton, Modal, TextField } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit, faPlusCircle } from '@fortawesome/free-solid-svg-icons';

const ContentWarehouse = () => {
  const [data, setData] = useState([]);
  const [rows, setRows] = useState([]);
  const [updateCount, setUpdateCount] = useState(0);
  const [openModal, setOpenModal] = useState(false);
  const [newWarehouse, setNewWarehouse] = useState({ id:'' , name: '' });
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
    
      const response = await fetch('https://api.cvimport.com/api/warehouse');
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const valor = await response.json();
      console.log(valor.data);
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
    }));

    setRows(rows);
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: 'Desea eliminar esta Almacen?',
      text: 'Los campos asociados pueden verse afectados',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Eliminar!',
    }).then(async (result) => {
      fetchData();
      if (result.isConfirmed) {
        try {
          await fetch(`https://api.cvimport.com/api/warehouse/${id}`, {
            method: 'DELETE',
          });

          Swal.fire({
            icon: 'success',
            title: 'Almacen Eliminada!',
            showConfirmButton: false,
            timer: 500,
          });

          setUpdateCount((prevCount) => prevCount + 1);
        } catch (error) {
          setUpdateCount((prevCount) => prevCount + 1);
          console.error('Error deleting Almacen:', error);
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

  const ConnectEdit = async (newWarehouse ) => {
    try {
         console.log("holaXV:", newWarehouse.id , newWarehouse);
         const response = await fetch(`https://api.cvimport.com/api/warehouse/${newWarehouse.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: newWarehouse.name,
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
      const categoryToEdit = data.find((item) => item.id === id);
      if (categoryToEdit) {
        setEditingMode(true);
        setOpenModal(true);
        setNewWarehouse({ id: id ,   name: categoryToEdit.name });
        handleInputChange;
      }
  };


  const handleCreateCategory = async () => {
    try {
      setEditingMode(false);
        const response = await fetch('https://api.cvimport.com/api/warehouse', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newWarehouse),
        });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      console.log(newWarehouse);
      Swal.fire({
        icon: 'success',
        title: 'Nuevo Almacen Creada!',
        showConfirmButton: false,
        timer: 1500,
      });

      handleCloseModal();
      setUpdateCount((prevCount) => prevCount + 1);
      fetchData(); // Actualiza los datos después de crear la categoría
    } catch (error) {
      console.error('Error creating Almacen:', error);
      setOpenModal(false);
      Swal.fire({
        icon: 'error',
        title: 'An error occurred while creating Almacen!',
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
  
    setNewWarehouse((prevCategory) => ({
      ...prevCategory,
      [name]: value,
    }));

    console.log(newWarehouse);
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
              <h1 className="m-0">Almacenes</h1>
            </div>
            {/* /.col */}
            <div className="col-sm-6">
              <ol className="breadcrumb float-sm-right">
                <li className="breadcrumb-item">
                  <a href="#">Home</a>
                </li>
                <li className="breadcrumb-item active">Productos</li>
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
                    <h3 className="card-title">Listado de Alamacenes</h3>
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<FontAwesomeIcon icon={faPlusCircle} />}
                      onClick={() => {
                        setEditingMode(false);
                        setOpenModal(true);
                        handleCreateCategory;
                        setNewWarehouse({ id:'' , name: '' });
                      }} 
                    >
                      Crear Almacen
                    </Button>

                    <Modal open={openModal} 
                          onClose={handleCloseModal}
                          >
                    <div style={style.modalContainer}>
                    <h2 style={{ textAlign: 'center', marginBottom: '20px' }}
                    >{editingMode ? 'Editar Almacen' : 'Crear Nuevo Almacen'}</h2>

                        <TextField
                          label="id"
                          variant="outlined"
                          fullWidth
                          margin="normal"
                          name="id"
                          value= {newWarehouse.id}
                          style={{ display: 'none' }}
                        />

                        <TextField
                          label="Nombre"
                          variant="outlined"
                          fullWidth
                          margin="normal"
                          name="name"
                          value={newWarehouse.name}
                          onChange={ handleInputChange }
                        />
 
                        <div style={style.buttonContainer}>

                        <Button
                          variant="contained"
                          color="primary"
                          style={style.createButton}
                          onClick={() => editingMode ? ConnectEdit(newWarehouse) : handleCreateCategory()}
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
                            setNewWarehouse({ id:'' , name: '' });
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
                    <div className="col-lg-1"></div>
                    <div className="col-lg-10">
                      <MUIDataTable columns={columns} data={data} options={options} />
                    </div>
                    <div className="col-lg-1"></div>
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

export default ContentWarehouse;