import { useEffect, useState } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
ChartJS.register(ArcElement, Tooltip, Legend);

const options = {
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "left",
      labels: {
        font: {
          size: 10
        }
      }
    }
  },
};

export const getList = async (setLista, setTotalProductos, setTotalStock, setTotalPurchasePrice, setTotalSellingPrice, setTop3PurchasePrice) => {
  try {
    const response = await fetch("http://localhost:3006/products");

    if (response.ok) {
      const data = await response.json();
      setLista(data.data);

      // Calcula el total de productos
      setTotalProductos(data.data.length);


      // Calcula la suma de purchase_price tratando los valores nulos como ceros
      const totalPurchasePrice = data.data.reduce((acc, product) => {
        const purchasePrice = parseFloat(product.purchase_price);
        if (!isNaN(purchasePrice)) {
          return acc + purchasePrice;
        } else {
          return acc + 0; // Tratar valores nulos como ceros
        }
      }, 0);

      // Obtener el top 3 de productos según su precio de compra
      const sortedProducts = data.data.slice().sort((a, b) => parseFloat(b.purchase_price) - parseFloat(a.purchase_price));
      const top3PurchasePrice = sortedProducts.slice(0, 3);
      setTop3PurchasePrice(top3PurchasePrice);

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

export default function dashboardProducts() {
  const [lista, setLista] = useState([]);
  const [totalProductos, setTotalProductos] = useState(0);
  const [totalStock, setTotalStock] = useState(0);
  const [totalPurchasePrice, setTotalPurchasePrice] = useState(0);
  const [totalSellingPrice, setTotalSellingPrice] = useState(0);
  const [top3PurchasePrice, setTop3PurchasePrice] = useState(0);
  const [top3Data, setTop3Data] = useState(null);
  const [selectedProductDetails, setSelectedProductDetails] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedEstado, setSelectedEstado] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [isCategorySelected, setIsCategorySelected] = useState(false);


  useEffect(() => { }, [lista]);

  useEffect(() => {
    getList(setLista, setTotalProductos, setTotalStock, setTotalPurchasePrice, setTotalSellingPrice, setTop3PurchasePrice);
  }, []);

  // Actualiza el conjunto de datos del gráfico Doughnut cuando cambia top3PurchasePrice
  useEffect(() => {
    if (top3PurchasePrice.length > 0) {
      const updatedTop3Data = {
        labels: top3PurchasePrice.map(product => product.name),
        datasets: [
          {
            label: "Top 3 Products",
            data: top3PurchasePrice.map(product => product.purchase_price),
            backgroundColor: ["#900C3F", "#DAF7A6", "#ECECEC"],
            hoverOffset: 30,
          },
        ],
      };
      setTop3Data(updatedTop3Data);
    }
  }, [top3PurchasePrice]);

  const productNames = lista.map(product => product.name);
  const productCategory = lista.map(product => product.categoria);
  const uniqueCategories = [...new Set(productCategory)];
  const productSubCategory = lista.map(product => product.subcategoria);
  const uniqueSubCategories = [...new Set(productSubCategory)];
  const productEstado = lista.map(product => product.status);
  const mapEstadoToText = (estado) => {
    return estado === "1" ? "Inactivo" : "Activo";
  };
  const uniqueEstado = [...new Set(productEstado)].map(mapEstadoToText);


  const handleProductChange = (event, value) => {
    const selectedProductData = lista.find(product => product.name === value);
    setSelectedProductDetails(selectedProductData);
    setSelectedProduct(value); // Actualiza el estado del producto seleccionado
  };

  const handleEstadoChange = (event, value) => {
    setSelectedEstado(value);
  };

  const handleCategoryChange = (event, value) => {
    setSelectedCategory(value);
  };

  const handleSubCategoryChange = (event, value) => {
    setSelectedSubCategory(value);
  };

  // Función para actualizar los datos de la dona
  const updateDoughnutData = (products) => {
    if (products.length > 0) {
      const updatedData = {
        labels: products.map(product => product.name),
        datasets: [
          {
            label: "Top Products",
            data: products.map(product => product.purchase_price),
            backgroundColor: ["#900C3F", "#DAF7A6", "#ECECEC"],
            hoverOffset: 30,
          },
        ],
      };
      setTop3Data(updatedData);

      // Actualizar el texto del card "Top 3"
      setTop3PurchasePrice(products);
    }
  };

  // useEffect para actualizar la dona cuando se selecciona un producto, una categoría o una subcategoría
  useEffect(() => {
    // Actualizar la dona cuando se selecciona un producto
    if (selectedProductDetails) {
      const updatedTop3Data = {
        labels: [selectedProductDetails.name],
        datasets: [
          {
            label: "Top Product",
            data: [100], // Llena al 100%
            backgroundColor: ["#007BFF"],
            hoverOffset: 30,
          },
        ],
      };
      setTop3Data(updatedTop3Data);
    } else { // Actualizar la dona cuando se selecciona una categoría o una subcategoría
      if (selectedCategory || selectedSubCategory) {
        // Obtener la lista de productos según la categoría o subcategoría seleccionada
        const filteredProducts = lista.filter(product =>
          (!selectedCategory || product.categoria === selectedCategory) &&
          (!selectedSubCategory || product.subcategoria === selectedSubCategory)
        );
        const sortedProducts = filteredProducts.slice().sort((a, b) => parseFloat(b.purchase_price) - parseFloat(a.purchase_price));
        const top3Products = sortedProducts.slice(0, 3);
        updateDoughnutData(top3Products);
      } else { // Si no hay producto, categoría ni subcategoría seleccionada, actualizar la dona con los datos generales
        updateDoughnutData(top3PurchasePrice);
      }
    }
  }, [selectedProductDetails, selectedCategory, selectedSubCategory, lista, top3PurchasePrice]);


  const refreshData = () => {
    getList(setLista, setTotalProductos, setTotalStock, setTotalPurchasePrice, setTotalSellingPrice, setTop3PurchasePrice);
    setSelectedProductDetails(null); // Restablecer la selección del producto
    setSelectedProduct(null); // Restablecer el valor seleccionado en Autocomplete
    setSelectedEstado(null); // Restablecer el estado seleccionado
    setSelectedCategory(null); // Restablecer la categoría seleccionada
    setSelectedSubCategory(null); // Restablecer la subcategoría seleccionada
  };

  const filteredProducts = lista.filter(product => {
    return (!selectedEstado || product.status === (selectedEstado === "Activo" ? "0" : "1")) &&
      (!selectedProduct || product.name === selectedProduct) &&
      (!selectedCategory || product.categoria === selectedCategory) &&
      (!selectedSubCategory || product.subcategoria === selectedSubCategory);
  });

  const sumStock = lista.reduce((total, product) => {
    if ((!selectedEstado || product.status === (selectedEstado === "Activo" ? "0" : "1")) &&
      (!selectedCategory || product.categoria === selectedCategory) &&
      (!selectedSubCategory || product.subcategoria === selectedSubCategory)) {
      return total + product.initial_stock;
    } else {
      return total;
    }
  }, 0);

  const totalFilteredPurchasePrice = lista.reduce((acc, product) => {
    if (
      (!selectedEstado || product.status === (selectedEstado === "Activo" ? "0" : "1")) &&
      (!selectedProduct || product.name === selectedProduct) &&
      (!selectedCategory || product.categoria === selectedCategory) &&
      (!selectedSubCategory || product.subcategoria === selectedSubCategory)
    ) {
      const purchasePrice = parseFloat(product.purchase_price);
      if (!isNaN(purchasePrice)) {
        return acc + purchasePrice;
      }
    }
    return acc;
  }, 0);

  // Limita el resultado a dos decimales
  const totalFilteredPurchasePriceFormatted = totalFilteredPurchasePrice.toFixed(2);

  const totalFilteredSellingPrice = lista.reduce((acc, product) => {
    if (
      (!selectedEstado || product.status === (selectedEstado === "Activo" ? "0" : "1")) &&
      (!selectedProduct || product.name === selectedProduct) &&
      (!selectedCategory || product.categoria === selectedCategory) &&
      (!selectedSubCategory || product.subcategoria === selectedSubCategory)
    ) {
      const sellingPrice = parseFloat(product.selling_price);
      if (!isNaN(sellingPrice)) {
        return acc + sellingPrice;
      }
    }
    return acc;
  }, 0);

  // Limita el resultado a dos decimales
  const totalFilteredSellingPriceFormatted = totalFilteredSellingPrice.toFixed(2);


  return (
    <div className="content-wrapper">
      <div className="card" style={{ padding: 20 }}>
        <div className="card card-outline">
          <div className="card-header">
            <h3 className="card-title">
              <b style={{ textAlign: "center" }}>Dashboard Entradas</b>
            </h3>
          </div>
          <div className="card-body d-flex justify-content-center align-items-center">
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              options={productNames}
              sx={{ width: 300 }}
              renderInput={(params) => <TextField {...params} label="Producto" />}
              onChange={handleProductChange}
              value={selectedProduct} // Establece el valor del Autocomplete
            />
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              options={uniqueEstado}
              sx={{ width: 100 }}
              renderInput={(params) => <TextField {...params} label="Estado" />}
              onChange={handleEstadoChange}
              value={selectedEstado} // Establece el valor del Autocomplete
            />
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              options={uniqueCategories}
              sx={{ width: 120 }}
              renderInput={(params) => <TextField {...params} label="Categoria" />}
              onChange={handleCategoryChange}
              value={selectedCategory} // Establece el valor del Autocomplete
            />
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              options={uniqueSubCategories}
              sx={{ width: 150 }}
              renderInput={(params) => <TextField {...params} label="Sub Categoria" />}
              onChange={handleSubCategoryChange}
              value={selectedSubCategory} // Establece el valor del Autocomplete
            />
            <button className="btn btn-primary" style={{ height: 55 }} onClick={refreshData}><i className="fas fa-arrows-rotate"></i></button>

          </div>

          <div
            className="card-body"
            style={{ display: "flex", justifyContent: "center" }}
          >
            {top3Data && (
              <div >
                <Doughnut data={top3Data} options={options} style={{ width: 500, height: 200, margin: 10 }} />
              </div>

            )}
            <div>
              <div className="pl-2">
                <div className="card bg-light mb-3">
                  <div className="card-header">Cantidad</div>
                  <div className="card-body">
                    <p className="card-text">
                      <h4>{filteredProducts.length}</h4>
                    </p>
                  </div>
                </div>
                <div className="card bg-light mb-3">
                  <div className="card-header">Stock</div>
                  <div className="card-body">
                    <p className="card-text">
                      <h4>{sumStock}</h4>
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="pl-2">
              <div className="card border-success mb-3">
                <div className="card-header text-danger">Precio de Compra</div>
                <div className="card-body">
                  <p className="card-text text-danger">
                    <h4>S/{totalFilteredPurchasePriceFormatted}</h4>
                  </p>
                </div>
              </div>
              <div className="card border-success mb-3">
                <div className="card-header text-success">Precio de Venta</div>
                <div className="card-body">
                  <p className="card-text text-success">
                    <h4>S/{totalFilteredSellingPriceFormatted}</h4>
                  </p>
                </div>
              </div>
            </div>
            <div className="pl-2">
              <div className="card bg-light mb-3">
                <div className="card-header"><i className="fas fa-trophy"></i> Top 3</div>
                <div className="card-body">
                  {Array.isArray(top3PurchasePrice) && top3PurchasePrice.map((product, index) => (
                    <div key={index} className="card-text">
                      <p style={{ fontSize: 13 }}><i className="fas fa-award"></i> {product.name}</p>
                      <p style={{ fontSize: 10 }}>Precio de compra: S/{product.purchase_price}, Precio de venta: S/{product.selling_price}, Cantidad de productos: {product.initial_stock}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div
            className="card-body" style={{ width: "100%", display: "none" }}>
            <div className="card bg-light mb-3">
              <div className="card-header"><i className="fas fa-trophy"></i> Tabla</div>
              <div className="card-body">
                {Array.isArray(top3PurchasePrice) && top3PurchasePrice.map((product, index) => (
                  <div key={index} className="card-text">
                    <p style={{ fontSize: 13 }}><i className="fas fa-award"></i> {product.name}</p>
                    <p style={{ fontSize: 10 }}>Precio de compra: S/{product.purchase_price}, Precio de venta: S/{product.selling_price}, Cantidad de productos: {product.initial_stock}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="card-footer clearfix"></div>
        </div>
      </div>
    </div>
  );
}