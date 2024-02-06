import React, { useEffect, useRef, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "admin-lte/dist/css/adminlte.min.css";
import "admin-lte/plugins/fontawesome-free/css/all.min.css";
import "admin-lte/plugins/overlayScrollbars/css/OverlayScrollbars.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "admin-lte/plugins/overlayScrollbars/js/jquery.overlayScrollbars.min.js";
import "admin-lte/dist/js/adminlte.min.js";
import { useAuth } from './AuthContext';
import $ from "jquery";
import { Link } from "react-router-dom";

const Menu = () => {
  const treeviewRef = useRef(null);
  const [activeItem, setActiveItem] = useState(null);
  const { isLoggedIn, logout } = useAuth();

  useEffect(() => {
    $(treeviewRef.current).Treeview("init");
    $(treeviewRef.current).on("treeview:opened", (event, openedItem) => {
      if (activeItem && activeItem !== openedItem) {
        $(activeItem).Treeview("close");
      }
      setActiveItem(openedItem);
    });
    $(treeviewRef.current).on("treeview:closed", () => {
      setActiveItem(null);
    });
  }, [activeItem]);

  const handleLogout = () => {
    logout();
  };


  return (
    <aside className="main-sidebar sidebar-dark-primary elevation-4">
      {/* Brand Logo */}
      <a href="index3.html" className="brand-link">
        {/*<img
          src="dist/img/AdminLTELogo.png"
          alt="AdminLTE Logo"
          className="brand-image img-circle elevation-3"
          style={{ opacity: ".8" }}
        />*/}
        <span className="brand-text font-weight-light">CCGroup Logistica</span>
      </a>
      {/* Sidebar */}
      <div className="sidebar">
        {/* Sidebar user panel (optional) */}
        <div className="user-panel mt-3 pb-3 mb-3 d-flex">
          <div className="image">
            {/*<img
              src="dist/img/user2-160x160.jpg"
              className="img-circle elevation-2"
              alt="User Image"
            />*/}
          </div>
          <div className="info">
            <a href="#" style={{ display: "flex", textAlign: "center" }}>
              Alexander Pierce
            </a>
          </div>
        </div>
        {/* SidebarSearch Form */}
        <div className="form-inline">
          <div className="input-group" data-widget="sidebar-search">
            <input
              className="form-control form-control-sidebar"
              type="search"
              placeholder="Search"
              aria-label="Search"
            />
            <div className="input-group-append">
              <button className="btn btn-sidebar">
                <i className="fas fa-search fa-fw" />
              </button>
            </div>
          </div>
        </div>
        {/* Sidebar Menu */}
        <nav className="mt-2">
          <ul
            ref={treeviewRef} // Asigna el ref al elemento que deseas seleccionar
            className="nav nav-pills nav-sidebar flex-column flex-column"
            data-widget="treeview"
            role="menu"
            data-accordion="true"
          >
            <li className="nav-item">
              <ul className="nav nav-treeview">
                <li className="nav-item">
                  <a href="./index.html" className="nav-link">
                    <i className="far fa-circle nav-icon" />
                    <p>Dashboard v1</p>
                  </a>
                </li>
              </ul>
            </li>

            <li className="nav-item">
              <a href="#" className="nav-link">
                <i className="nav-icon fas fa-solid fa-chart-simple" />
                <p>
                  Productos
                  <i className="fas fa-angle-left right" />
                </p>
              </a>
              <ul
                className="nav nav-treeview nav-pills nav-sidebar flex-column"
                ref={treeviewRef} // Asigna el ref al elemento que deseas seleccionar
                data-widget="treeview"
                role="menu"
                data-accordion="false"
              >
                <li className="nav-item">
                  <Link to="/category" className="nav-link">
                    <i className="far fa-circle nav-icon" />
                    <p>Categoria</p>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/subcategory" className="nav-link">
                    <i className="far fa-circle nav-icon" />
                    <p>SubCategoria</p>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/" className="nav-link">
                    <i className="far fa-circle nav-icon" />
                    <p>Productos</p>
                  </Link>
                </li>
              </ul>
            </li>

            <li className="nav-item">
              <a href="#" className="nav-link">
                <i className="nav-icon fas fa-solid fa-chart-simple" />
                <p>
                  Proveedores
                  <i className="fas fa-angle-left right" />
                </p>
              </a>
              <ul
                className="nav nav-treeview nav-pills nav-sidebar flex-column"
                ref={treeviewRef} // Asigna el ref al elemento que deseas seleccionar
                data-widget="treeview"
                role="menu"
                data-accordion="false"
              >
                <li className="nav-item">
                  <Link to="/provider" className="nav-link">
                    <i className="far fa-circle nav-icon" />
                    <p>Proveedor</p>
                  </Link>
                </li>
              </ul>
            </li>


            <li className="nav-item">
              <a href="#" className="nav-link">
                <i className="nav-icon fas fa-solid  fa-cart-plus" />
                <p>
                  Ordenes de Compra
                  <i className="fas fa-angle-left right" />
                </p>
              </a>
              <ul
                className="nav nav-treeview nav-pills nav-sidebar flex-column"
                ref={treeviewRef} // Asigna el ref al elemento que deseas seleccionar
                data-widget="treeview"
                role="menu"
                data-accordion="false"
              >
                <li className="nav-item">
                  <Link to="/purchase" className="nav-link">
                    <i className="far fa-circle nav-icon" />
                    <p>Ordenes</p>
                  </Link>
                </li>

                <li className="nav-item">
                  <Link to="/purchaseList" className="nav-link">
                    <i className="far fa-circle nav-icon" />
                    <p>Listado Ordenes</p>
                  </Link>
                </li>

              </ul>
            </li>

            <li className="nav-item">
              <a href="#" className="nav-link">
                <i className="nav-icon fas fa-solid fa-boxes-packing" />
                <p>
                  Logistica
                  <i className="fas fa-angle-left right" />
                </p>
              </a>
              <ul
                className="nav nav-treeview nav-pills nav-sidebar flex-column"
                ref={treeviewRef} // Asigna el ref al elemento que deseas seleccionar
                data-widget="treeview"
                role="menu"
                data-accordion="false"
              >
                <li className="nav-item">
                  <Link to="/stock" className="nav-link">
                    <i className="far fa-circle nav-icon" />
                    <p>Stock</p>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/entry" className="nav-link">
                    <i className="far fa-circle nav-icon" />
                    <p>Entradas</p>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/output" className="nav-link">
                    <i className="far fa-circle nav-icon" />
                    <p>Salidas</p>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/" className="nav-link">
                    <i className="far fa-circle nav-icon" />
                    <p>Kardex</p>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/move" className="nav-link">
                    <i className="far fa-circle nav-icon" />
                    <p>Movimientos</p>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/warehouse" className="nav-link">
                    <i className="far fa-circle nav-icon" />
                    <p>Almacenes</p>
                  </Link>
                </li>
              </ul>
            </li>

            
            <li className="nav-item">
              <a href="#" className="nav-link">
                <i className="nav-icon fas fa-solid  fa-bookmark" />
                <p>
                  Registros
                  <i className="fas fa-angle-left right" />
                </p>
              </a>
              <ul
                className="nav nav-treeview nav-pills nav-sidebar flex-column"
                ref={treeviewRef} // Asigna el ref al elemento que deseas seleccionar
                data-widget="treeview"
                role="menu"
                data-accordion="false"
              >
                <li className="nav-item">
                  <Link to="/client" className="nav-link">
                    <i className="far fa-circle nav-icon" />
                    <p>Market Place</p>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/operator" className="nav-link">
                    <i className="far fa-circle nav-icon" />
                    <p>Operadores</p>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/operator" className="nav-link">
                    <i className="far fa-circle nav-icon" />
                    <p>Almacenes</p>
                  </Link>
                </li>
              </ul>
            </li>

            <li className="nav-item">
              <a href="#" className="nav-link">
                <i className="nav-icon fas fa-solid  fa-users" />
                <p>
                  Usuarios
                  <i className="fas fa-angle-left right" />
                </p>
              </a>
              <ul
                className="nav nav-treeview nav-pills nav-sidebar flex-column"
                ref={treeviewRef} // Asigna el ref al elemento que deseas seleccionar
                data-widget="treeview"
                role="menu"
                data-accordion="false"
              >
                <li className="nav-item">
                  <Link to="/user" className="nav-link">
                    <i className="far fa-circle nav-icon" />
                    <p>Usuarios</p>
                  </Link>
                </li>
              </ul>
            </li>

            <a
          
              onClick={() => {
                handleLogout();
                history.push("/login");
              }}
              className="nav-link"
            >
              <i className="nav-icon fas fa-solid fa-right-from-bracket" />
              <p>Logout</p>
            </a>
          </ul>
        </nav>
        {/* /.sidebar-menu */}
      </div>
      {/* /.sidebar */}
    </aside>
  );
};

export default Menu;
