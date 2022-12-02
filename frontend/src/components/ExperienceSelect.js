import React, { useEffect, useState } from 'react'
import { doGet } from '../utils/request';
import { Select } from 'antd'
export default function ExperienceSelect({handleChange, value}) {
   const [experiences, setExperiences]=  useState([]);

 

   useEffect(()=>{
    const fetchExperiences = async ()=>{
        try{
            const response = await doGet({path:'experiences'});
            const data = await response.json();
            
            setExperiences(data.data)
            
        }catch(err){
            setExperiences([])
        }
    }
        fetchExperiences()
   },[])

  return (
      <Select defaultValue={value && Number(value)} onChange={handleChange} placeholder="Select Experience" style={{ width:"100%" }}> 
          <Select.Option value={null} >Select Experience</Select.Option>
          {
            experiences.map(experience=>(
                <Select.Option value={Number(experience.id)} key={Math.random()}> {experience.type} </Select.Option>
            ))
        }
      </Select>
  )
}
