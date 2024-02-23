import React, { useEffect, useState } from 'react'

export default function ContentIncidents() {
    const [lista, setLista] = useState([])

    const getList = async () => {
        try{const response = await fetch("https://apiticketccgroup.onrender.com/incidents")
            if(response.ok){
                const data = await response.json()
                setLista(data)
            }
            else{console.error("Error de fetch", response.statusText)}    
    }
        catch(error){console.error("Error de bd", error)}
    }

    useEffect(() => {
        getList();
    }, [])

  return (
    <div className='content-wrapper'>
        {lista.map(incidents =>(
            <div key={incidents.id}>
                <h2>{incidents.plataforma}</h2>
                <p>{incidents.motivo}</p>
            </div>
    ))}
    </div>
  )
}
