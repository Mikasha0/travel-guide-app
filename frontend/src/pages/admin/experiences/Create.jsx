import React from 'react'
import {Formik, Form, Field, ErrorMessage} from 'formik';
import { Button, Input, notification } from 'antd';
import { doPost } from '../../../utils/request';
import useToken from '../../../hooks/useToken';


export default function () {
  const [token] = useToken();
  return (
    <div className="container p-2 mx-auto">
        <div className="card">
            <div className="card-header">
                Experience
            </div>
            <div className="card-body">
                <Formik
                    initialValues={{ 
                        type:''
                     }}
                     validate={(values)=>{
                        const errors ={} 
                        if(!values.type){
                            errors.type = "Type is Required"
                        }
                        return errors;
                     }}
                     onSubmit={async (values, {setSubmitting, setErrors, resetForm})=>{
                         try{
                            const response = await doPost({
                                path:"experiences",
                                body: values,
                                token: token
                            })
                            if(!response.ok){
                                const errorList  = {}
                                const data = await response.json()
                                if(data.data && data.data.errors && Array.isArray(data.data.errors)){
                                   data.data.errors((err)=>{
                                    if(errorList[err.param]){
                                        errorList[err.param] += err.msg  
                                        return;
                                    }
                                    errorList[err.param] = err.msg;
                                   })
                                }
                                return setErrors(errorList)
                            }
                            notification.success({
                                message:"Experience Added"
                            })
                            resetForm()
                         }catch(err){
                            notification.error({
                                message: err.message||"Something Went Wrong"
                            })
                         }finally{
                             setSubmitting(false)
                         }
                     }}
                >
                    {
                        ({dirty,handleSubmit, isValid, isSubmitting})=>(
                            <Form>
                                <Field name="type" type="name" className="my-2 w-100" placeholder="Enter Type" as={Input}/>
                                <ErrorMessage name='type' className='text-danger' component="span" />
                                <br />
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
