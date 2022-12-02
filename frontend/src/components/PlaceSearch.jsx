import { Button, Input, AutoComplete } from "antd";
import { useState } from "react";
import CitySelect from "./CitySelect";
import ExperienceSelect from "./ExperienceSelect";
import {useNavigate, useSearchParams} from 'react-router-dom'
import useDebounceValue from "../hooks/useDebounceValue";
import { useEffect } from "react";
import useFetch from "../hooks/useFetch";

export default function PlaceSearch({className}) {
  const [search,setSearch] = useSearchParams()
 
  const [city, setCity] = useState(search.get('city')||null) 
  const [experience, setExperience] = useState(search.get('experience')||null) 
  const [destination, setDestination] = useState(search.get('destination')||'') 
  const slowValue = useDebounceValue(destination,500);
  const navigate = useNavigate()
  const {data} = useFetch("places",{experienceId:experience, cityId: city, name: slowValue})


  
  const handleClick = ()=>{
    const query = {
      city,
      experience,
      destination
    }
    Object.keys(query).forEach(key => {
      if (query[key] === null || query[key] === '') {
        delete query[key];
      }
    });
    
    const searchParams = new URLSearchParams(query).toString()
    navigate(`/places?${searchParams}`)
  }

  return (
    <div className={`container  ${className} p-4 card shadow rounded`}>
    <div className="row g-4">
      <div className="col-md-3">
        <CitySelect value={city} handleChange={(value)=>{
          setCity(value)
        }}/>
      </div>

  
      <div className="col-md-3">
       <ExperienceSelect value={experience} handleChange={(value)=>{
         setExperience(value)
       }}/>
      </div>

      <div className="col-md-4">
        <AutoComplete placeholder="Destination"
          onSelect={(value)=>setDestination(value)}
         value={destination} 
          style={{ width:"100%" }}
        onSearch={value=>{
        
          setDestination(value)
          
        }}> 
          {
           data && data.data && Array.isArray(data.data) && data.data.map(place=>(
              <AutoComplete.Option key={place.id} value={place.name}>
                {place.name}
              </AutoComplete.Option>
            ))
          }
        </AutoComplete>
    </div>
     
      <div className="col-md-2">
         <Button type="primary" onClick={handleClick} className="w-100">Search</Button>
      </div>

    </div>


  </div>
  )
}
