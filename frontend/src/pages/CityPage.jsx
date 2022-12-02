import { Button, Skeleton } from 'antd'
import React from 'react'
import { useState } from 'react'
import {useNavigate, useParams} from 'react-router-dom'
import PlaceCard from '../components/PlaceCard'
import BookTravel from '../components/section/cities/BookTravel'
import useFetch from '../hooks/useFetch'
import useUser from '../hooks/useUser'
import {formatDistance} from 'date-fns'
export default function CityPage() {
  const {id} = useParams()
  const [visible, setVisible] = useState(false)
  const navigate = useNavigate()
  const {user} = useUser()
  const open = ()=>setVisible(true)
  const close = ()=>setVisible(false)

  const goLogin = ()=>navigate('/login')
  const {data: cityData,loading: cityLoading, error:cityError} = useFetch(`cities/${id}`)
  const {data: guidesData,loading: guideLoading, error:guideError} = useFetch(`guides`,{cityId:id});
  const {data: placesData,loading: placesLoading, error:placesError} = useFetch(`places`,{featured:true,cityId:id});
  const {data: eventsData,loading: eventsLoading, error:eventsError} = useFetch(`events`,{days:10,cityId:id});
  
  if(cityLoading || placesLoading || guideLoading || eventsLoading) return <Skeleton />
  if(cityError) return <span className="text-danger">{cityError.message}</span>
  if(placesError) return <span className="text-danger">{placesError.message}</span>
  if(guideError) return <span className="text-danger">{guideError.message}</span>
  if(eventsError) return <span className="text-danger">{eventsError.message}</span>
  return (
    <div className="container py-4">
        <div className="d-flex justify-content-between">
        <h2>{cityData.data.name}</h2>
        <Button type='primary' onClick={user?open:goLogin}>Book Travel</Button>
        <BookTravel cityName={cityData.data.name} id={cityData.data.id} visible={visible} handleClose={close}/>
        </div>

        <h3>Featured Places</h3>
        <div className="row gx-4 gy-4">
            {
                placesData.data.map(place=>(
                  <div className="col-md-4" key={place.id}>
                        <PlaceCard id={place.id} name={place.name} experience={place.experience}
                        featured={place.featured} image={place.image} 
                    />
                  </div>
                ))
            }
        </div>
        <div className="py-2">
        <h3>Events</h3>
        <div className="row gx-4 gy-4">
           {
             eventsData.data.map(event=>(
               <div className="col-md-4" key={event.id}>
                 <div className="card text-center">
                  <h3>{event.title}</h3>
                  <h6>{formatDistance(new Date(event.date),new Date(),{addSuffix:true})}</h6>
                 </div>
               </div>
             ))
           } 
        </div>
        </div>

       <div className="py-2">
       <h3>Guides</h3>
        <div className="row gx-4 gy-4">
            {
              guidesData.data.map(guide=>(
                <div 
                  key={Math.random()}
                  onClick={()=>navigate(`/guides/${guide.id}`)}
                className="col-md-3 text-center py-2 card">
                  {guide.name} <br />
                  {guide.email}
                </div>
              ))
            }
        </div>
       </div>
    </div>
  )
}
