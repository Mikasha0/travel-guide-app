import { Skeleton } from 'antd'
import {useSearchParams} from 'react-router-dom'
import PlaceCard from '../components/PlaceCard'
import PlaceSearch from '../components/PlaceSearch'
import useFetch from '../hooks/useFetch'

export default function PlacesPage() {
    const [search,setSearch] = useSearchParams()
    const searchParams = {
        experienceId : search.get('experience'),
        cityId : search.get('city'),
        name: search.get('destination')
    }
    const {data,error,loading} = useFetch('places', searchParams)
    
    if(loading){
        return <Skeleton />
    }
    if(error){
        return <div>{JSON.stringify(error,null,2)}</div>
    }

   
    return (
        <div className="container">
            <PlaceSearch className='my-4'/>
            <div className="row gx-4 gy-4">
                {
                     data.data.map(place=>(
                      <div className="col-md-4" key={Math.random()}>
                          <PlaceCard  id={place.id}  name={place.name} experience={place.experience} image={place.image} key={Math.random()} />
                      </div>
                  ))
                }
            </div>
        </div>
      )
   
}
