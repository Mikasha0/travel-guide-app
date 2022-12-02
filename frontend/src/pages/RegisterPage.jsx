import styles from '../styles/Register.module.scss'
import {Formik, Field, ErrorMessage, Form} from 'formik'
import * as Yup from 'yup'
import {Button, Input, Radio, Select, Skeleton} from 'antd'
import { doPost } from '../utils/request'
import { useState } from 'react'
import useToken from '../hooks/useToken'
import {Link, useNavigate} from 'react-router-dom'
import useFetch from '../hooks/useFetch'

export default function RegisterPage() {
    const [error, setError] = useState(null)
    const [token, setToken] = useToken();
    const {data,loading,error:cityError} = useFetch("cities");
  const navigate = useNavigate()
  if(loading) return <Skeleton />
  if(cityError) return <span className="text-danger">{cityError.message}</span>
  return (
    <section className={styles.container}>
        <div className={styles.card}>
        <Formik
                initialValues={{ 
                    email: '',
                    name:'',
                    role: "VISITOR",
                    cityId: null,
                    password:''
                 }}
                 validationSchema={
                     Yup.object({
                         email: Yup.string().email().required("Email is Required"),
                         password: Yup.string().required('Password is Required'),
                         passwordConfirmation: Yup.string().oneOf(
                             [
                                 Yup.ref('password'),null
                             ],"Passwords Must Match"
                         ),
                         role: Yup.string().oneOf(["VISITOR","GUIDE"],"Role Doesnt exist")
                     })
                 }
                 onSubmit={async (values,{setSubmitting, setErrors})=>{
                    try{
                        setError(null)
                        setErrors([])
                        const response = await doPost({path:'auth/signup', body:values})
                        if(!response.ok){
                            const body = await response.json()
                            const errs = body.errors || []
                            const errorList = {}
                            errs.forEach(err=>{
                                if(errorList[err.param]){
                                    errorList[err.param] += err.msg  
                                    return;
                                }
                                errorList[err.param] = err.msg
                            })
                            setErrors(errorList)
                            setError(body.message || "Something Went Wrong")
                            return;
                        }
                        const body = await response.json()
                        setToken(body.token)
                        navigate(`/`)
                    }catch(err){
                        setError(err.message||"Something Went Wrong")
                    }finally{
                        setSubmitting(false)
                    }

                 }}
            >
               {
                   ({isSubmitting,handleSubmit, dirty, isValid, values,setFieldValue})=>(
                    
                    <Form className='w-100 px-2'>
                    <h5 className=" text-center">Register</h5>
                    {error && 
                        <span className="text-danger">{error}</span>
                    }
                    <Field name="name" type="text" className="my-2 w-100" placeholder="Enter Name" as={Input}/>
                    <ErrorMessage className='text-danger' component="span"  name='name'/>

                    <Field name="email" type="email" className="my-2 w-100" placeholder="Enter Email" as={Input}/>
                    <ErrorMessage className='text-danger' component="span"  name='email'/>

                    <Field name="password" type="password" className="my-2 w-100" placeholder="Enter Password" as={Input.Password}/>
                    <ErrorMessage className='text-danger' component="span"  name='password'/>
                    
                    <Field name="passwordConfirmation" type="password" className="my-2 w-100" placeholder="Re-Enter Password" as={Input.Password}/>
                    <ErrorMessage className='text-danger' component="span"  name='passwordConfirmation'/>
                    {
                        (values.role=='GUIDE') && (
                            <div className="py-1">
                                  <Select name="cityId" onChange={(value)=>setFieldValue('cityId',value)} className="my-2 w-100" placeholder="Select City" >
                                    {
                                        data && data.data.map(city=>(
                                            <Select.Option  key={Math.random()} value={city.id}>{city.name}</Select.Option>
                                        ))
                                    }
                                </Select>
                                <ErrorMessage className='text-danger' component="span"  name='cityId'/>

                            </div>
                        )

                    }
                    <div>
                    <div>What Are You?</div>
                    <Field name="role" as={Radio.Group}>
                        <Radio value={"VISITOR"}>Visitor</Radio>
                        <Radio value={"GUIDE"}>Guide</Radio>
                    </Field>
                    </div>

                    <br />
                    <Button type='primary' onClick={handleSubmit} className='w-100 my-2' loading={isSubmitting} disabled={isSubmitting || !isValid || !dirty}> Register </Button>
                    </Form>
                   )
               }
            </Formik>
            <Link to={"/login"} className='text-center'>Back to Login</Link>
        </div>
    </section>
  )
}
