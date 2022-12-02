import { Button, Form, Input, Modal, notification } from "antd";
import { ErrorMessage, Field, Formik } from "formik";
import * as Yup from 'yup'
import useToken from "../../../../hooks/useToken";
import { doPost } from "../../../../utils/request";

export default function CreatePlan({visible, handleClose, handleSuccess}) {
    const [token] = useToken()
  return (
    <Modal
        title="Create Booking Plan"
        footer={[]}
        visible={visible}
        onCancel={handleClose}
    >
        <Formik
            initialValues={{ 
                name: "",
                days: 0,
                price: 0,
             }}
            validationSchema={Yup.object({
                name: Yup.string().required(),
                days: Yup.number().integer().moreThan(0),
                price: Yup.number().integer().moreThan(0),
            })}
            onSubmit={async (values, {setSubmitting})=>{
                try{
                    const response = await doPost({
                        body: values,
                        token: token,
                        path:"booking-plans"

                    })
                    if(response.ok){
                        notification.success({
                            message:"Plan added"
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
                       Create
                   </Button>
                </Form>
            )
        }
        </Formik>
    </Modal>
  )
}
