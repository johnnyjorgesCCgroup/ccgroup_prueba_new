import React from 'react'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import Menu from '../../components/Menu'
import ContentIncidents from '../../components/incidents/ContentIncidents'
const indexCut = () => {
  return (
    <>
    <Header />
    <Menu />
    <ContentIncidents/>
    <Footer />
    </>
  )
}

export default indexCut