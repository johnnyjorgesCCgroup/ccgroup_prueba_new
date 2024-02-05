import React from 'react'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import Menu from '../../components/Menu'
import ContentEntry from '../../components/entry/ContentEntry'
import ContentMove from '../../components/move/ContentMove'
const indexMove = () => {
  return (
    <>
    <Header />
    <Menu />
    <ContentMove/>
    <Footer />
    </>
  )
}

export default indexMove