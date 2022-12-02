import { Button, Input, Select, Skeleton, Switch, notification } from "antd";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useState } from "react";
import * as Yup from 'yup'
import useFetch from "../../../hooks/useFetch";
import useToken from "../../../hooks/useToken";
import { doPost } from "../../../utils/request";
import {useParams} from 'react-router-dom';
import UploadImage from '../../../components/section/admin/places/UploadImage'
import ErrorBoundary from "antd/lib/alert/ErrorBoundary";
import AddExperience from "../../../components/section/admin/places/AddExperience";
export default function Edit() {
    const {id} = useParams()
    const {data:cityData,loading:cityLoading} = useFetch('cities')
    const {data:placeData,loading:placeLoading, error:placeErr, refresh} = useFetch(`places/${id}`)
    const [token] = useToken()
    const [error, setError] = useState(null)

  if(placeLoading || cityLoading) return <Skeleton />
  return (
   <>
         <div className="container mx-auto my-2">
        <div className="card">
            <div className="card-header">
                Edit Place
            </div>
            <div className="card-body">
                <Formik
                    initialValues={{ 
                        name: placeData.data.name,
                        cityId: placeData.data.cityId,
                        featured: placeData.data.featured
                    }}
                    validationSchema={Yup.object({
                        name: Yup.string().required("Name is Required"),
                        cityId: Yup.number().required("Please Select a City"),
                        featured: Yup.boolean().required()
                    })}
                    onSubmit={async (value,{setSubmitting,setErrors})=>{
                        try{
                            setError(null)
                            const response = await doPost({method:"PUT", path:`places/${id}`,body:value,token })
                            const body = await response.json()
                            if(!response.ok) {
                                const errorList = {}
                                body.errors.forEach(err=>{
                                    if(errorList[err.param]){
                                        errorList[err.param] += err.msg  
                                        return;
                                    }
                                    errorList[err.param] = err.msg
                                })
                                setErrors(errorList)
                            }
                            notification.success({
                                message: body.message||"Update Successful"
                            })
                            refresh()
                        }catch(err){
                            setError(err.message||"Something Went Wrong")
                        }finally{
                            setSubmitting(false)
                        }
                    }}
                >
                    {
                        ({dirty,isSubmitting,handleSubmit,setFieldValue, isValid, values,getFieldProps})=>(
                            <Form>
                                <span className="text-danger text-center">{error}</span>
                               
                                <Field name="name" type="name" className="my-2 w-100" placeholder="Enter Name" as={Input}/>
                                <ErrorMessage className='text-danger' component="span"  name='name'/>

                                <Select defaultValue={Number(placeData.data.cityId)} name="cityId" onChange={(value)=>setFieldValue('cityId',value)} className="my-2 w-100" placeholder="Select City" >
                                    {
                                        cityData && cityData.data.map(city=>(
                                            <Select.Option key={Math.random()} value={Number(city.id)}>{city.name}</Select.Option>
                                        ))
                                    }
                                </Select>
                                <ErrorMessage className='text-danger' component="span"  name='cityId'/>


                                <label htmlFor="featured">Featured:</label>
                                <Switch className="mx-2" checked={values.featured} name="featured"
                                   onChange={value=>setFieldValue('featured', value)}
                                />
                                <ErrorMessage className='text-danger' component="span"  name='featured'/>
                                <Button type='primary' onClick={handleSubmit} className='w-100 my-2' loading={isSubmitting} disabled={isSubmitting || !isValid || !dirty}> Update </Button>
                    
                         </Form>
                        )   
                    }
                </Formik>
            </div>
        </div>
    </div>
    
  <AddExperience id={id}/>
   
  <ErrorBoundary>
  <UploadImage id={id} />
  </ErrorBoundary>

   </>
  )
}
