import React from 'react'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import Menu from '../../components/Menu'
import ContentPurchaseList from '../../components/purchase/ContentPurchaseList'
const IndexPurchaseList = () => {
  return (
    <>
    <Header />
    <Menu />
    <ContentPurchaseList/>
    <Footer />
    </>
  )
}

export default IndexPurchaseList