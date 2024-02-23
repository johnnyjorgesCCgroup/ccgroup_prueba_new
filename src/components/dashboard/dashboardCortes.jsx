import { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';

const options = {
  maintainAspectRatio: false,
};

export const SkuCard = ({ selectedMoveDetails }) => {
  return (
    <div className="card">
      <div className="card-body">
        <h5 className="card-title">SKU</h5>
        {selectedMoveDetails && selectedMoveDetails.skuProduct && (
          <p className="card-text">{selectedMoveDetails.skuProduct}</p>
        )}
      </div>
    </div>
  );
};
export const getList = async (setLista, setTotalMoves, fromDate, toDate) => {
  try {
    const response = await fetch(`https://api.cvimport.com/api/inventoryMoves?fromDate=${fromDate}&toDate=${toDate}`);

    if (response.ok) {
      const data = await response.json();
      setLista(data.data);

      // Calculate total moves
      setTotalMoves(data.data.length);
    } else {
      console.error(
        "Error al obtener la lista de movimientos",
        response.statusText
      );
    }
  } catch (error) {
    console.error("Error al obtener la lista de movimientos", error);
  }
};

const getTopMoves = (moves) => {
  const sortedMoves = moves.slice().sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
  return sortedMoves.slice(0, 3);
};

const MoveDoughnut = ({ moves }) => {
  const [moveCounts, setMoveCounts] = useState([]);

  useEffect(() => {
    const counts = getMoveCountsByType(moves);
    setMoveCounts(counts);
  }, [moves]);

  const getMoveCountsByType = (moves) => {
    const moveTypes = moves.map(move => move.tipo);
    const uniqueMoveTypes = [...new Set(moveTypes)];
    const moveCounts = uniqueMoveTypes.map(type => {
      const count = moves.filter(move => move.tipo === type).length;
      return { type, count };
    });
    return moveCounts;
  };

  const labels = moveCounts.map(move => move.type);
  const data = moveCounts.map(move => move.count);

  const doughnutData = {
    labels,
    datasets: [
      {
        label: 'Movimientos por Tipo',
        data,
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#66FF99' // Puedes agregar más colores si es necesario
        ],
        hoverBackgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#66FF99' // Puedes agregar más colores si es necesario
        ]
      }
    ]
  };

  return (
    <div style={{ width: 400, height: 400 }}>
      <Doughnut data={doughnutData} options={options} />
    </div>
  );
};

export default function DashboardMoves() {
  const [lista, setLista] = useState([]);
  const [totalMoves, setTotalMoves] = useState(0);
  const [filteredMoves, setFilteredMoves] = useState([]);
  const [topMoves, setTopMoves] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [selectedMoveDetails, setSelectedMoveDetails] = useState(null);
  const [selectedEntity, setSelectedEntity] = useState(null);
  const [selectedDocumentType, setSelectedDocumentType] = useState(null);
  const [selectedProductName, setSelectedProductName] = useState(null);
  const [productNames, setProductNames] = useState([]);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  useEffect(() => {
    getList(setLista, setTotalMoves, fromDate, toDate);
  }, [fromDate, toDate]);

  useEffect(() => {
    const names = lista.map(move => move.nameProduct);
    setProductNames([...new Set(names)]);
  }, [lista]);

  const moveEntities = lista.map(move => move.entity);
  const uniqueEntities = [...new Set(moveEntities)];
  const moveDocumentTypes = lista.map(move => move.document_type.trim());
  const uniqueDocumentTypes = [...new Set(moveDocumentTypes)];
  const totalEntradas = filteredMoves.filter(move => move.tipo === "Entrada").length;
  const totalSalidas = filteredMoves.filter(move => move.tipo === "Salida").length;

  // Cálculo de precios de entradas y salidas
  const totalPriceEntradas = filteredMoves
    .filter(move => move.tipo === "Entrada")
    .reduce((total, move) => total + parseFloat(move.price), 0);

  const totalPriceSalidas = filteredMoves
    .filter(move => move.tipo === "Salida")
    .reduce((total, move) => total + parseFloat(move.price), 0);

  const handleEntityChange = (event, value) => {
    setSelectedEntity(value);
  };

  const handleDocumentTypeChange = (event, value) => {
    setSelectedDocumentType(value);
  };

  const handleProductChange = (event, value) => {
    setSelectedProductName(value);
    // Aquí necesitas encontrar el detalle del movimiento correspondiente al producto seleccionado
    // Puedes hacer esto filtrando la lista de movimientos
    const selectedMove = lista.find(move => move.nameProduct === value);
    setSelectedMoveDetails(selectedMove); // Actualiza los detalles del movimiento seleccionado
  };

  const handleFromDateChange = (event) => {
    setFromDate(event.target.value);
  };

  const handleToDateChange = (event) => {
    setToDate(event.target.value);
  };

  const refreshData = async () => {
    try {
      // Verificar si fromDate y toDate no son cadenas vacías antes de llamar a getList
      if (fromDate !== '' && toDate !== '') {
        await getList(setLista, setTotalMoves, fromDate, toDate);
      } else {
        console.error("Las fechas 'Desde' y 'Hasta' son requeridas.");
      }
      setSelectedMoveDetails(null);
      setSelectedEntity(null); // Restablecer el valor seleccionado de entidad
      setSelectedDocumentType(null); // Restablecer el valor seleccionado de tipo de documento
      setSelectedProductName(null); // Restablecer el valor seleccionado de nombre del producto
      setFromDate(''); // Restablecer la fecha de inicio a una cadena vacía
      setToDate(''); // Restablecer la fecha de fin a una cadena vacía
    } catch (error) {
      console.error("Error al actualizar los datos:", error);
    }
  };



  useEffect(() => {
    const filteredMoves = lista.filter(move => {
      return (!selectedEntity || move.entity === selectedEntity) &&
        (!selectedDocumentType || move.document_type.trim() === selectedDocumentType) &&
        (!selectedProductName || move.nameProduct === selectedProductName) &&
        (!fromDate || move.date >= fromDate) &&
        (!toDate || move.date <= toDate);
    });

    setFilteredMoves(filteredMoves);
    setTotalMoves(filteredMoves.length);

    const totalPrice = filteredMoves.reduce((total, move) => {
      return total + parseFloat(move.price);
    }, 0);

    setTotalPrice(totalPrice);
  }, [lista, selectedEntity, selectedDocumentType, selectedProductName, fromDate, toDate]);

  const totalPriceFormatted = totalPrice.toFixed(2);

  useEffect(() => {
    const topMoves = getTopMoves(filteredMoves);
    setTopMoves(topMoves);
  }, [filteredMoves]);

  return (
    <div className="content-wrapper">
      <div className="card" style={{ padding: 20 }}>
        <div className="card card-outline">
          <div className="card-header">
            <h3 className="card-title">
              <b style={{ textAlign: "center" }}>Dashboard Movimientos</b>
            </h3>
          </div>
          <div className="card-body d-flex justify-content-center align-items-center">
            <TextField
              id="date-from"
              label="Desde"
              type="date"
              sx={{ width: 200 }}
              onChange={handleFromDateChange}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              id="date-to"
              label="Hasta"
              type="date"
              sx={{ width: 200 }}
              onChange={handleToDateChange}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <Autocomplete
              disablePortal
              id="combo-box-product-name"
              options={productNames}
              sx={{ width: 280 }}
              renderInput={(params) => <TextField {...params} label="Nombre del Producto" />}
              onChange={handleProductChange}
              value={selectedProductName}
            />
            <Autocomplete
              disablePortal
              id="combo-box-entity"
              options={uniqueEntities}
              sx={{ width: 150 }}
              renderInput={(params) => <TextField {...params} label="Entidad" />}
              onChange={handleEntityChange}
              value={selectedEntity}
            />
            <Autocomplete
              disablePortal
              id="combo-box-document-type"
              options={uniqueDocumentTypes}
              sx={{ width: 150 }}
              renderInput={(params) => <TextField {...params} label="Tipo de Documento" />}
              onChange={handleDocumentTypeChange}
              value={selectedDocumentType}
            />
            <button className="btn btn-primary" style={{ height: 55 }} onClick={refreshData}><i className="fas fa-arrows-rotate"></i></button>
          </div>
          <div style={{ display: "block" }}>
            <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
              <div id="dona">
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <Button variant="contained" className="m-1" style={{backgroundColor:"#FF6384"}}><i className="fas fa-chart-pie" style={{fontSize:"20px"}}></i></Button>
                  <Button variant="outlined" className="m-1" style={{borderColor:"#FF6384"}}><i className="fas fa-chart-line" style={{fontSize:"20px", color:"#FF6384"}}></i></Button>
                </div>
                <MoveDoughnut moves={filteredMoves} />
              </div>
              <div style={{ display: "block" }} id="top3yEntradasySalidas">
                <div id="entradasYsalidas" style={{ display: "flex" }}>
                  <div className="ml-2" id="totalMovimientosYprecioTotal" style={{ display: "block" }}>
                    <div className="card bg-light mb-3">
                      <div className="card-header">Cantidad de Movimientos</div>
                      <div className="card-body">
                        <p className="card-text">
                          <h4>{totalMoves}</h4>
                        </p>
                      </div>
                    </div>
                    <div className="card bg-light mb-3">
                      <div className="card-header">Precio Total</div>
                      <div className="card-body">
                        <p className="card-text">
                          <h4>S/ {totalPriceFormatted}</h4>
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="ml-2" id="totalEntradasSalidas" style={{ display: "block" }}>
                    <div id="movesEntradasSalidas" style={{ display: "flex", }}>
                      <div>
                        <div className="card bg-light mb-3" style={{ width: "auto" }}>
                          <div className="card-header">N° Entradas</div>
                          <div className="card-body">
                            <p className="card-text">
                              <h4>{totalEntradas}</h4>
                            </p>
                          </div>
                        </div>
                      </div>
                      <div>
                        <div className="card bg-light mb-3 ml-2" style={{ width: "auto" }}>
                          <div className="card-header">N° Salidas</div>
                          <div className="card-body">
                            <p className="card-text">
                              <h4>{totalSalidas}</h4>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div id="preciosEntradasSalidas" style={{ display: "flex" }}>
                      <div>
                        <div className="card bg-light mb-3" style={{ width: "auto" }}>
                          <div className="card-header">$ Entradas</div>
                          <div className="card-body">
                            <p className="card-text">
                              <h4>S/ {totalPriceEntradas.toFixed(2)}</h4>
                            </p>
                          </div>
                        </div>
                      </div>
                      <div>
                        <div className="card bg-light mb-3 ml-2" style={{ width: "auto" }}>
                          <div className="card-header">$ Salidas</div>
                          <div className="card-body">
                            <p className="card-text">
                              <h4>S/ {totalPriceSalidas.toFixed(2)}</h4>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div style={{ width: "100%", display: "flex", justifyContent: "center" }} id="top3">
                  <div className="card bg-light mb-3 ml-2" style={{ width: "100%" }}>
                    <div className="card-header"><i className="fas fa-trophy"></i> Top 3 Movimientos</div>
                    <div className="card-body">
                      {topMoves.map((move, index) => (
                        <div key={index} className="card-text">
                          <p style={{ fontSize: 13 }}><i className="fas fa-award"></i> {move.nameProduct}</p>
                          <p style={{ fontSize: 10 }}>Precio: S/ {move.price}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="card-footer clearfix">
            <SkuCard selectedMoveDetails={selectedMoveDetails} />
          </div>
        </div>
      </div>
    </div>
  );
}
