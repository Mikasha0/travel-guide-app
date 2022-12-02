import styles from '../styles/Loginpage.module.scss'
import {Formik, Field, ErrorMessage, Form} from 'formik'
import * as Yup from 'yup'
import {Button, Input} from 'antd'
import { doPost } from '../utils/request'
import { useState } from 'react'
import useToken from '../hooks/useToken'
import {Link, useNavigate} from 'react-router-dom'

export default function LoginPage() {
  const [error, setError] = useState(null)
  const [token, setToken] = useToken();
  const navigate = useNavigate()
  return (
    <section className={styles.container}>
        <div className={styles.card}>
            <Formik
                initialValues={{ 
                    email: '',
                    password:''
                 }}
                 validationSchema={
                     Yup.object({
                         email: Yup.string().email().required("Email is Required"),
                         password: Yup.string().required('Password is Required')
                     })
                 }
                 onSubmit={async (values,{setSubmitting, setErrors})=>{
                    try{
                        setError(null)
                        setErrors([])
                        const response = await doPost({path:'auth/login', body:values})
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
                   ({isSubmitting,handleSubmit, dirty, isValid})=>(
                    
                    <Form className='w-100 px-2'>
                    <h5 className=" text-center">Login</h5>
                    {error && 
                        <span className="text-danger">{error}</span>
                    }
                    <Field name="email" type="email" className="my-2 w-100" placeholder="Enter Email" as={Input}/>
                    <ErrorMessage className='text-danger' component="span"  name='email'/>

                    <Field name="password" type="password" className="my-2 w-100" placeholder="Enter Password" as={Input.Password}/>
                    <ErrorMessage className='text-danger' component="span"  name='password'/>
                    <br />
                    <Button type='primary' onClick={handleSubmit} className='w-100 my-2' loading={isSubmitting} disabled={isSubmitting || !isValid || !dirty}> Login </Button>
                    </Form>
                   )
               }
            </Formik>
            <Link to={"/register"} className='text-center'>Not A User?</Link>
        </div>
    </section>
  )
}
