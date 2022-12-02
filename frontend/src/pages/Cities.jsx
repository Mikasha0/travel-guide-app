import { Skeleton } from 'antd'
import React from 'react'
import { useNavigate } from 'react-router-dom'

import useFetch from '../hooks/useFetch'

export default function Cities() {
  const {data, loading, error} = useFetch("cities")
  const navigate = useNavigate() 
  if(error) return <span className="text-danger">{error.message||"Something went wrong"}</span>
  if(loading) return <Skeleton />

  return (
    <div className="container py-2">
        <h2>Cities</h2>
        <div className="row gx-5 gy-5">
            {
                data.data.map(city=>(
                    <div key={Math.random()}  className="col-md-4">
                        <div onClick={()=>navigate(`${city.id}`)} className=" card text-center py-4">
                            {city.name}
                        </div>
                    </div>
                ))
            }
        </div>
    </div>
  )
}
