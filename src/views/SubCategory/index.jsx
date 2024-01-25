import React from 'react'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import Menu from '../../components/Menu'
import ContentSubCategory from '../../components/subcategory/ContentSubCategory'

console.log("Aqui estoy");

const IndexSubCategory = () => {
  return (
    <>
    <Header />
    <Menu />
    <ContentSubCategory/>
    <Footer />
    </>
  )
}
export default IndexSubCategory