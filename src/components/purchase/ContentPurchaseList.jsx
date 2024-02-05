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
import Article from '@mui/icons-material/Article';
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

const ContentPurchaseList = () => {


    const [data, setData] = useState([]);
    const [rows, setRows] = useState([]);
   
    
  useEffect(() => {
    fetchData();
  },  []);

  const fetchData = async () => {
    try {
      const response = await fetch('https://api.cvimport.com/api/purchase');
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
      serie: item.serie,
      name_user: item.name_user,
      name_provider: item.name_provider,
      total: item.total,
      tax: item.tax,

    }));

    setRows(rows);
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
      width: 150,
    },
    {
      field: 'name_provider',
      headerName: 'Proveedor',
      width: 250,
    },
    {
        field: 'name_user',
        headerName: 'Usuario',
        width: 200,
      },
    {
      field: 'tax',
      headerName: 'Impuestos',
      options: {
        searchable: true,
      },
    },
    {
      field: 'total',
      headerName: 'Total',
      options: {
        searchable: true,
      },
    },
    
    {
      field: 'status',
      headerName: 'status',
      width: 130,
        options: {
          searchable: true,
        },
      valueFormatter: (params) => (params.value === 0 ? 'ATENDIDO' : 'REGISTRADO'),

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
            icon={<Article />}
            label="PDF"
            className="textPrimary"
            onClick={() => handleEdit(id  )  }
            color="success"
          />,
        ];  
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
              <h1 className="m-0">Productos</h1>
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

export default ContentPurchaseList;



