import React from 'react'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import Menu from '../../components/Menu'
import ContentWarehouse from '../../components/warehouse/ContentWarehouse'
const indexWarehouse = () => {
  return (
    <>
    <Header />
    <Menu />
    <ContentWarehouse/>
    <Footer />
    </>
  )
}

export default indexWarehouse