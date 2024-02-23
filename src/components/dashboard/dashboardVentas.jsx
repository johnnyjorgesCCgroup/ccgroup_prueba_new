import React, { useEffect, useState } from 'react'

export default function dashboardVentas() {
  const [lista, setLista] = useState([])

  const getList = async () => {
    try{const response = await fetch("https://api.cvimport.com/api/product")
      if(response.ok){
        const data = await response.json()
        setLista(data.data)
      }
      else{console.error("Primer Error", response.statusText)}
    }
    catch(error){console.error("Segundo Error", error)}
  }

  useEffect(() => {
    getList();
  }, [])

  return (
    <div className='content-wrapper'>{lista.map(product => (
      <div key={product.id}>
        <h2>{product.name}</h2>
        <p>{product.categoria}</p>
      </div>
    ))}</div>
  )
}
