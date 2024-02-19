import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import Button from '@mui/material/Button';

export const getList = async (setLista) => {
    try {
        const response = await fetch("http://localhost:8080/https://api.cvimport.com/api/product");
        if (response.ok) {
            const data = await response.json();
            setLista(data.data);
        } else {
            console.error(
                "Error al obtener la lista de trabajadores",
                response.statusText
            );
        }
    } catch (error) {
        console.error("Error al obtener la lista de trabajadores", error);
    }
};

export default function DataGridDemo() {
    const [lista, setLista] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);
    useEffect(() => {
    }, [lista]);

    useEffect(() => {
        getList(setLista); // Pasamos setLista como parámetro
    }, []);
    const columns = [
        { field: 'id', headerName: 'ID', width: 90 },
        {
            field: 'name',
            headerName: 'Product Name',
            width: 200,
        },
        {
            field: 'purchase_price',
            headerName: 'Purchase Price',
            type: 'number',
            width: 110,
        },
        {
            field: 'category',
            headerName: 'Category',
            width: 150,
        },
    ];

    const handleSelectionChange = (newSelection) => {
        setSelectedRows(newSelection.selectionModel);
    };

    const handleDeleteSelected = () => {
        const selectedIds = selectedRows.map(rowId => data.id(row => row.id === rowId).id);
        console.log('Selected rows IDs:', selectedIds);
    };

    return (
        <div className='content-wrapper'>
            <Box sx={{ height: 400, width: '100%' }}>
                <DataGrid
                    rows={lista}
                    columns={columns}
                    checkboxSelection
                    onSelectionModelChange={handleSelectionChange}
                />
            </Box>
            <Button onClick={handleDeleteSelected} variant="contained" color="secondary">
                Delete Selected
            </Button>
        </div>
    );
}
