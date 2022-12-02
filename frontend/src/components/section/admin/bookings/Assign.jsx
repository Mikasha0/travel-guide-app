import { Button, Form, Modal, notification, Select, Skeleton } from 'antd'
import { Formik } from 'formik'
import React from 'react'
import useFetch from '../../../../hooks/useFetch'
import useToken from '../../../../hooks/useToken'
import { doPost } from '../../../../utils/request'

export default function Assign({ bookingId, visible, handleClose, handleSuccess }) {
    const [token] = useToken()
    const { data, error, loading } = useFetch("users", { role: "GUIDE" }, token)
    if (loading) return <Skeleton />
    if (error) return <span className="text-danger">{error.message}</span>
    return (
        <Modal
            footer={[]}
            onCancel={handleClose}
            visible={visible}
            title="Assign Guide"
        >
            <Formik
                initialValues={{
                    guideId: null
                }}
                onSubmit={async (values, { setSubmitting }) => {
                    try {
                        const response = await doPost({ method: "PUT", body: values, path: `bookings/${bookingId}`, token: token })
                        if (response.ok) {
                            notification.success({
                                message: "Guide Added"
                            })
                            handleClose()
                            return handleSuccess()
                        }
                        notification.error({
                            message: "Failed"
                        })
                    } catch (err) {
                        notification.error({
                            message: "Failed"
                        })
                    } finally {
                        setSubmitting(false)
                    }
                }}
            >
                {({ dirty, handleSubmit, isSubmitting, setFieldValue }) => (
                    <Form>
                    <Select
                        name="guideId"
                        onChange={(value) => setFieldValue('guideId', value)}
                        className='my-2 w-100'
                    >
                        {
                            data && data.data.map(guide => (
                                <Select.Option key={Math.random()} value={guide.id}>{guide.name}</Select.Option>
                            ))
                        }
                    </Select>
                    <Button className='w-100' loading={isSubmitting} disabled={isSubmitting||!dirty} onClick={handleSubmit}>
                        Assign
                    </Button>
                    </Form>
                )}
            </Formik>
        </Modal>
    )
}
