import { Button, Form, Input, Modal, notification, Skeleton } from "antd";
import { ErrorMessage, Field, Formik } from "formik";
import * as Yup from 'yup'
import useFetch from "../../../../hooks/useFetch";
import useToken from "../../../../hooks/useToken";
import { doPost } from "../../../../utils/request";

export default function EditPlan({id, visible, handleClose, handleSuccess}) {
    const [token] = useToken()
    const {data, error, loading} = useFetch(`booking-plans/${id}`)
    if(error) return <span className="text-danger">
        {error.message}
    </span>
    if(loading) return <Skeleton />
    if(data){
        return (
            <Modal
                title="Edit Booking Plan"
                footer={[]}
                visible={visible && id}
                onCancel={handleClose}
            >
                <Formik
                    initialValues={{ 
                        name: data.data.name,
                        days: data.data.days,
                        price: data.data.price,
                     }}
                    validationSchema={Yup.object({
                        name: Yup.string().required(),
                        days: Yup.number().integer().moreThan(0),
                        price: Yup.number().integer().moreThan(0),
                    })}
                    onSubmit={async (values, {setSubmitting})=>{
                        try{
                            const response = await doPost({
                                method:"PUT",
                                body: values,
                                token: token,
                                path:`booking-plans/${id}`
                            })
                            if(response.ok){
                                notification.success({
                                    message:"Plan Updated"
                                })
                                handleClose()
                                return handleSuccess()
                            }
                            notification.error({
                                message:"Something went Wrong"
                            })
                        }catch(err){
                            notification.error({
                                message:"Something went Wrong"
                            })
                        }finally{
                            setSubmitting(false)
                        }
                    }}
                >
                {
                    ({isSubmitting,dirty,handleSubmit})=>(
                        <Form>
                           <div className="py-2">
                           
                               Name : <Field 
                            title="Name"
                            name="name"
                            placeholder="Enter Name"
                            
                            as={Input}
                           />
                         
                           <ErrorMessage className="text-danger" name="name" component="span"/>
                           </div>
                           
                           <div className="py-2">
                              Price(Rs): 
                            <Field name="price" title="Price" type="number" placeholder="Price" as={Input}/>
                            <ErrorMessage className="text-danger" name="price" component="span"/>
                           </div>
                           
                           <div className="py-2">
                               Day(s):
                               <Field name="days" title="Days" type="number" placeholder="Days" as={Input}/>
                                <ErrorMessage className="text-danger" name="days" component="span"/>
                           </div>
                           <Button
                                loading={isSubmitting}
                                disabled={isSubmitting || !dirty}
                                onClick={handleSubmit}
                                className="w-100"
                           >
                              Update
                           </Button>
                        </Form>
                    )
                }
                </Formik>
            </Modal>
          )
    }
}
