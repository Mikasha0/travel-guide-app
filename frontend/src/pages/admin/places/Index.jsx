import { Skeleton, Button, notification } from 'antd'
import { Link, useNavigate } from 'react-router-dom'
import useFetch from '../../../hooks/useFetch'
import { doPost } from '../../../utils/request'

export default function Index() {

    const {data,error,loading,refresh} = useFetch('places')
    const navigate = useNavigate()

    const handleDelete = async (id)=>{
      try{
          const conf = window.confirm("Are You Sure?")
          if(!conf) return;
        const request = await doPost({method:"DELETE", path:`places/${id}`})
        if(request.ok) {
            refresh()
           return notification.success({
                message:(await request.json()).message||"Deleted Successfully"
            })
        }
        notification.error({
            message:(await request.json()).message||"Failed to Delete"
        })
      }catch(err){
        notification.error({
            message:err.message
        })
      }
    }
    if(loading) return <Skeleton />
    if(error) return <span className="m-1 fs-1 text-danger">{error.message || "Something Went Wrong"}</span>
    
    return (
       <div className="container mx-auto ">
           <div className="card my-4 p-2 ">
            <div className="card-head">
                <strong className='mx-1'>Places</strong>
                <Link className='btn btn-sm btn-primary mx-1' to={"/admin/places/create"}> Create </Link>
            </div>
           <div className="card-body">
           <table className="table table-sm table-striped table-border ">
               <thead>
                   <tr>
                       <th>#</th>
                       <th>Name</th>
                       <th>City</th>
                       <th>Experiences</th>
                       <th>Actions</th>
                   </tr>
               </thead>
               <tbody>
                   {
                       data.data.map((place,index)=>(
                           <tr key={place.id}>
                               <td>{++index}</td>
                               <td>{place.name}</td>
                               <td>{place.city.name}</td>
                               <td>
                               {   place.experience.map(exp=>(
                                <span className="badge badge-primary bg-primary mx-1" key={Math.random()}>{exp.type}</span>
                                 ))}
                               </td>
                               <td>
                                    <div className="d-flex">
                                        <Button type='primary'
                                            onClick={()=>navigate(`/admin/places/${place.id}`)}
                                        >Edit</Button>
                                        <Button type='primary' danger
                                            onClick={()=>handleDelete(place.id)}
                                        >Delete</Button>
                                    </div>
                               </td>
                           </tr>
                       ))
                   }
               </tbody>
           </table>
           </div>
           </div>
       </div>
    )
}
