import React, { useEffect, useState } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import IndexCategory from '../views/Category/index';
import IndexSubCategory from '../views/SubCategory/index';
import IndexProduct from '../views/Product/index';
import IndexUser from '../views/User/index';
import IndexProvider from '../views/Provider/index';
import IndexPurchase from '../views/Purchase/index';
import IndexClient from '../views/Client/index';
import IndexOperator from '../views/Operator/index';
import IndexPurchaseList from '../views/PurchaseList/index';
import IndexOutput from '../views/Output/index';
import IndexEntry from '../views/Entry/index';
import IndexWarehouse from '../views/Warehouse/index';
import IndexMove from '../views/Move/index';
import IndexStock from '../views/Stock/index';

import './ProtectedRoutes.css'

const ProtectedRoutes = () => {
  const { isLoggedIn } = useAuth();
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setAuthChecked(true);
    };

    checkAuth();
  }, []);

  if (!authChecked) {
    return <div className='Cargando1' style={{ color: '#00FF88' }}>
    Cargando<span className='DotAnimation'>.</span>
  </div>;
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }

  return (
    <Routes>
      <Route path="/" element={<IndexProduct />} />
      <Route path="/category" element={<IndexCategory />} />
      <Route path="/subcategory" element={<IndexSubCategory />} />
      <Route path="/user" element={<IndexUser />} />
       <Route path="/purchase" element={<IndexPurchase />} /> 
       <Route path="/purchaseList" element={<IndexPurchaseList />} /> 
      <Route path="/provider" element={<IndexProvider />} />
      <Route path="/client" element={<IndexClient />} />
      <Route path="/operator" element={<IndexOperator />} />
      <Route path="/entry" element={<IndexEntry />} />
      <Route path="/output" element={<IndexOutput />} />
      <Route path="/warehouse" element={<IndexWarehouse />} />
      <Route path="/move" element={<IndexMove />} />
      <Route path="/stock" element={<IndexStock />} />
    </Routes>
  );
};

export default ProtectedRoutes;
