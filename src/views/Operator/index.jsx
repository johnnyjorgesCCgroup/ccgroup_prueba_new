import React from 'react'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import Menu from '../../components/Menu'
import ContentOperator from '../../components/operator/ContentOperator'
const indexOperator = () => {
  return (
    <>
    <Header />
    <Menu />
    <ContentOperator/>
    <Footer />
    </>
  )
}

export default indexOperator