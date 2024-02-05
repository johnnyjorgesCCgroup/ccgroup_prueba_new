import React, { forwardRef, useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import MUIDataTable from 'mui-datatables';
import { Button, IconButton, Modal, TextField } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import CreatableSelect from 'react-select/creatable';

const ContentSubCategory = () => {
  const [data, setData] = useState([]);
  const [rows, setRows] = useState([]);
  const [clears, setClears] = useState({ });


  const [updateCount, setUpdateCount] = useState(0);
  const [openModal, setOpenModal] = useState(false);
  const [newSubCategory, setNewSubCategory] = useState({ id:'' , name: '', serie: '' , category_id: '' , value_select: ''});
  //Avisa si es edit al componente
  const [editingMode, setEditingMode] = useState(false);
  const [categoryId, setCategoryId] = useState(null);

  const [select, setSelect] = useState(null);
  const [selectEdit, setSelectEdit] = useState( null );
  
  const options = {
    filterType: 'checkbox',
    print: false,
    search: true, 
  };

  useEffect(() => {
    setClears({ "value": 0  , "label" : 0 }); 
    fetchData();
    fetchDataSelect();
  }, [updateCount]);

  const fetchDataSelect = async () => {
    try {
    const response_category = await fetch('https://api.cvimport.com/api/category');
    if (!response_category.ok) {
      throw new Error(`HTTP error! Status: ${response_category.status}`);
    }
    const valor_select = await response_category.json();
    updateSelects(valor_select.data);

  } catch (error) {
    console.error('Error fetching data:', error);
  }
  };

  
  const fetchDataSelectEdit = async ( res ) => {
    try {

    const response_category = await fetch('https://api.cvimport.com/api/category');
    if (!response_category.ok) {
      throw new Error(`HTTP error! Status: ${response_category.status}`);
    }
    const valor_select = await response_category.json();
    const filter =  valor_select.data.filter(item => item.name === res)
                                      .map(({ id, name, ...rest }) => ({
                                    value: id,
                                    label: name,
                                    ...rest  }))  ; 

    const array = filter[0];
    console.log( { "value": array.value , "label" : array.label } );
    setNewSubCategory((prevCategory) => ({
      ...prevCategory,
       'value_select' : { "value": array.value , "label" : array.label } ,
       'category_id' : array.value,
    }));


  } catch (error) {
    console.error('Error fetching data:', error);
  }
  };
  

  const fetchData = async () => {
    try {
      const response = await fetch('https://api.cvimport.com/api/subcategory');
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      };
      const valor = await response.json();
      updateTableRows(valor.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const updateTableRows = (data) => {
    
    const rows = data.map((item) => ({
      id: item.id,
      name: item.name,
      category: item.category.name,
      serie: item.serie,
    }));
     setRows(rows);
     setData(rows);
  };

  const updateSelects = (data) => {     
    const rows = data.map((item) => ({  
      value: item.id,      
      label: item.name 
    }));      
    setSelect(rows);                
  };


  const handleDelete = async (id) => {
    Swal.fire({
      title: 'Desea eliminar esta Sub categoria?',
      text: 'Los campos de productos asociados podrian verse afectados',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Eliminar!',
    }).then(async (result) => {
      fetchData();
      if (result.isConfirmed) {
        try {
          await fetch(`https://api.cvimport.com/api/subcategory/${id}`, {
            method: 'DELETE',
          });

          Swal.fire({
            icon: 'success',
            title: 'Categoria Eliminada!',
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

  const ConnectEdit = async (newSubCategory ) => {
    try {
      console.log(newSubCategory, categoryId);
         console.log("hola Edicion:", categoryId ,  newSubCategory.id , newSubCategory);
         const response = await fetch(`https://api.cvimport.com/api/subcategory/${newSubCategory.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "name"         : newSubCategory.name,
                "serie"        : newSubCategory.serie,
                "category_id"  : newSubCategory.category_id,
            }),
        });
        setOpenModal(false)
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
      const subCategoryToEdit = data.find((item) => item.id === id)
      console.log("Aquiii ..",subCategoryToEdit);;
      fetchDataSelect;
      fetchDataSelectEdit(  subCategoryToEdit.category );
    
      if (subCategoryToEdit) {
        setEditingMode(true);
        setOpenModal(true);
        setNewSubCategory({ id: id ,   name: subCategoryToEdit.name, serie: subCategoryToEdit.serie, category_id: subCategoryToEdit.category_id   ,categoria: subCategoryToEdit.categoria   });
        handleInputChange;
      }

    
  };


  const handleCreateCategory = async () => {
    try {
      console.log("Aquiiii:",newSubCategory);
      setEditingMode(false);
      const response = await fetch('https://api.cvimport.coom/api/subcategory', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          "name"         : newSubCategory.name,
          "serie"        : newSubCategory.serie,
          "category_id"  : newSubCategory.category_id,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      Swal.fire({
        icon: 'success',
        title: 'Nueva Categoria Creada!',
        showConfirmButton: false,
        timer: 1500,
      });

      handleCloseModal();
      setUpdateCount((prevCount) => prevCount + 1);
      fetchData(); // Actualiza los datos después de crear la categoría
    } catch (error) {
      setOpenModal(false)
      console.error('Error creating category:', error);
      Swal.fire({
        icon: 'error',
        title: 'An error occurred while creating category!',
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };

  const handleInputChangeSelect = (event) => {
    setCategoryId(event.value);
    setNewSubCategory((prevSubCategory) => ({
      ...prevSubCategory,
      'category_id': event.value,
    }));
    console.log(newSubCategory);
    fetchDataSelect()
  };

  const handleInputChange = (event) => {

    const { name, value } = event.target;
    if(editingMode){
      const { name, value } = event.target.value;
    };
    setNewSubCategory((prevCategory) => ({
      ...prevCategory,
      [name]: value,
    }));
    console.log(newSubCategory);
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
      name: 'category',
      label: 'category',
      options: {
        searchable: true,
      },
    },
    {
      name: 'serie',
      label: 'Serie',
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
              <h1 className="m-0">Sub Categorias</h1>
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
                    <h3 className="card-title">Listado de Sub Categorias</h3>
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<FontAwesomeIcon icon={faPlusCircle} />}
                      onClick={() => {
                        setEditingMode(false);
                        setOpenModal(true);
                        handleCreateCategory;
                        setNewSubCategory({ id:'' , name: '', serie: '' , categoria: '' });
                        setSelectEdit( {"value": null  , "label" : null});
                      }} 
                    >
                      Crear Sub Categoría
                    </Button>

                    <Modal open={openModal} 
                          onClose={handleCloseModal}
                          >
                    <div style={style.modalContainer}>
                    <h2 style={{ textAlign: 'center', marginBottom: '20px' }}
                    >{editingMode ? 'Editar Sub Categoría' : 'Crear Nueva Sub Categoría'}</h2>

                        <TextField
                          label="id"
                          variant="outlined"
                          fullWidth
                          margin="normal"
                          name="id"
                          value= {newSubCategory.id}
                          style={{ display: 'none' }}
                        />

                        <TextField
                          label="Nombre"
                          variant="outlined"
                          fullWidth
                          margin="normal"
                          name="name"
                          value={newSubCategory.name}
                          onChange={ handleInputChange }
                        />
                        <TextField
                          label="Serie"
                          variant="outlined"
                          fullWidth
                          margin="normal"
                          name="serie"
                          value={newSubCategory.serie}
                          onChange={  handleInputChange }
                        />
                        <div style={{ width: '100%' }}>
                        <CreatableSelect 
                        isClearable 
                        options={select} 
                        label="Categoria"
                        variant="outlined"
                        margin="normal"
                        name="category_id"
                        value={newSubCategory.value_select}
                        onChange={handleInputChangeSelect}
                        />
                       </div>

                        <div style={style.buttonContainer}>
                        <Button
                          variant="contained"
                          color="primary"
                          style={style.createButton}
                          onClick={() => editingMode ? ConnectEdit(newSubCategory) : handleCreateCategory()}
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
                            setNewSubCategory({ id:'' , name: '', serie: '' });
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

export default ContentSubCategory;