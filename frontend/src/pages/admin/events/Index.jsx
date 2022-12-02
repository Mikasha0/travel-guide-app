import { Button, Skeleton } from 'antd'
import React from 'react'
import { useState } from 'react'
import Create from '../../../components/section/admin/events/Create'
import Edit from '../../../components/section/admin/events/Edit'
import useFetch from '../../../hooks/useFetch'

export default function Index() {
   const {data,error,loading,refresh} = useFetch("events")
   const [visible, setVisible] = useState(false)
   const [id, setId] = useState(null)
   const [editVisible, setEditVisible] = useState(false)

   if(loading) return <Skeleton />
   if(error) return <span className="text-danger">
       {error.message}
   </span>

   const open = ()=>setVisible(true)
   const close = ()=>setVisible(false)

   const openEdit = (id)=>{
       setId(id)
       setEditVisible(true)
   }
   const closeEdit = ()=>{
        setId(null)
        setEditVisible(false)
   }

  return (
    <div className="container py-2">
        <Create handleClose={close} handleSuccess={refresh}
            visible={visible}
        />
        {
            id && <Edit id={id} handleClose={closeEdit} handleSuccess={refresh}
            visible={editVisible}
        />
        }
        <div className="card">
            <div className="card-header">
                Events <Button
                    onClick={open}
                >
                    Create
                </Button>
            </div>
            <div className="card-body">
                <table className="table-sm table table-striped">
                    <thead>
                        <th>#</th>
                        <th>Title</th>
                        <th>City</th>
                        <th>Date</th>
                        <th>Actions</th>
                    </thead>
                    <tbody>
                        {
                            data.data.map((event, index)=>(
                                <tr key={event.id}>
                                    <td>{++index}</td>
                                    <td>{event.title}</td>
                                    <td>{event.city.name}</td>
                                    <td>{new Date(event.date).toLocaleDateString("en-US")}</td>
                                    <td>
                                        <Button
                                            type='primary'
                                            onClick={()=>openEdit(event.id)}
                                        >
                                            Edit
                                        </Button>
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


