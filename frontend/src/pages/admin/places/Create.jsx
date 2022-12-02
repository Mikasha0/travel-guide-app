import { Button, Input, Select, Switch } from "antd";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as Yup from 'yup'
import useFetch from "../../../hooks/useFetch";
import useToken from "../../../hooks/useToken";
import { doPost } from "../../../utils/request";

export default function Create() {
    const {data,loading} = useFetch('cities')
    const [token] = useToken()
    const [error, setError] = useState(null)
    const navigate = useNavigate()
  return (
    <div className="container mx-auto my-2">
        <div className="card">
            <div className="card-header">
                Create Place
            </div>
            <div className="card-body">
                <Formik
                    initialValues={{ 
                        name: '',
                        cityId: null,
                        featured: false
                    }}
                    validationSchema={Yup.object({
                        name: Yup.string().required("Name is Required"),
                        cityId: Yup.number().required("Please Select a City"),
                        featured: Yup.boolean().required()
                    })}
                    onSubmit={async (value,{setSubmitting,setErrors})=>{
                        try{
                            setError(null)
                            const response = await doPost({path:'places',body:value,token })
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
                           
                            navigate(`/admin/places/${body.data.id}`)
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

                                <Select name="cityId" onChange={(value)=>setFieldValue('cityId',value)} className="my-2 w-100" placeholder="Select City" >
                                    {
                                        data && data.data.map(city=>(
                                            <Select.Option  key={Math.random()} value={city.id}>{city.name}</Select.Option>
                                        ))
                                    }
                                </Select>
                                <ErrorMessage className='text-danger' component="span"  name='cityId'/>


                                <label htmlFor="featured">Featured:</label>
                                <Switch className="mx-2" checked={values.featured} name="featured"
                                   onChange={value=>setFieldValue('featured', value)}
                                />
                                <ErrorMessage className='text-danger' component="span"  name='featured'/>
                                <Button type='primary' onClick={handleSubmit} className='w-100 my-2' loading={isSubmitting} disabled={isSubmitting || !isValid || !dirty}> Save </Button>
                    
                         </Form>
                        )   
                    }
                </Formik>
            </div>
        </div>
    </div>
  )
}
