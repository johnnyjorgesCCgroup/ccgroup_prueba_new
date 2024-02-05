import React from 'react'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import Menu from '../../components/Menu'
import ContentClient from '../../components/client/ContentClient'
const indexClient = () => {
  return (
    <>
    <Header />
    <Menu />
    <ContentClient/>
    <Footer />
    </>
  )
}

export default indexClient