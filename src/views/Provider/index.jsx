import React from 'react'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import Menu from '../../components/Menu'
import ContentProvider from '../../components/provider/ContentProvider'
const IndexProvider = () => {
  return (
    <>
    <Header />
    <Menu />
    <ContentProvider/>
    <Footer />
    </>
  )
}

export default IndexProvider