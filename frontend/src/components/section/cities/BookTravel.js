import {
    Button,
    Form,
    Modal,
    notification,
    Radio,
    Skeleton,
    Input,
} from "antd";
import { ErrorMessage, Field, Formik } from "formik";
import React from "react";
import useFetch from "../../../hooks/useFetch";
import KhaltiCheckout from "khalti-checkout-web";
import { doPost } from "../../../utils/request";
import useToken from "../../../hooks/useToken";
import * as Yup from 'yup'
export default function BookTravel({ id, cityName, visible, handleClose }) {
    const [token] = useToken();
    const { data, error, loading } = useFetch("booking-plans");
    if (loading) return <Skeleton />;
    if (error) return <span className="text-danger">{error.message}</span>;
    return (
        <Modal
            footer={[]}
            onCancel={handleClose}
            visible={visible}
            title="Booking Options"
        >
            <Formik
                initialValues={{
                    bookingPlanId: null,
                    date: null
                }}
                validationSchema={Yup.object({
                    bookingPlanId: Yup.string().required("Please Select a Booking Plan"),
                    date: Yup.date().required("Date is Required")
                })}
                onSubmit={async (values, { setSubmitting }) => {
                    let config = {
                        // replace this key with yours
                        publicKey: process.env.REACT_APP_KHALTI_PUBLIC_KEY,
                        productIdentity: values.bookingPlanId,
                        productName: cityName,
                        productUrl: window.location.href,
                        eventHandler: {
                            onSuccess: async (payload) => {
                                // hit merchant api for initiating verfication
                                try {
                                    console.log(payload);
                                    const response = await doPost({
                                        path: "bookings",
                                        body: {
                                            token: payload.token,
                                            bookingPlanId: values.bookingPlanId,
                                            cityId: id,
                                            date: values.date
                                        },
                                        token: token,
                                    });
                                    if (response.ok) {
                                        return notification.success({
                                            message: "Booking Successful",
                                        });
                                    }
                                    throw new Error("Something Went Wrong")
                                } catch (error) {
                                    notification.error({
                                        message: error.message || "Something Went Wrong"
                                    })
                                } finally {
                                    setSubmitting(false)
                                    handleClose()
                                }
                            },
                            // onError handler is optional
                            onError(error) {
                                notification.error({
                                    message: `${error.detail}. ${error.tries_remaining} Tries Left`,
                                });
                                handleClose()
                            },
                            onClose() {
                                console.log("widget is closing");
                            },
                        },
                    };
                    const checkout = new KhaltiCheckout(config);
                    checkout.show({
                        amount:
                            data.data.find((plan) => plan.id === values.bookingPlanId).price *
                            100,
                    });
                }}
            >
                {({ handleSubmit, dirty, isValid, isSubmitting }) => (
                    <Form>
                        <div className="py-1">
                            <Field name="bookingPlanId" as={Radio.Group}>
                                {data.data.map((plan) => (
                                    <Radio.Button key={plan.id} value={plan.id}>
                                        {plan.name} - Rs. {plan.price} - {plan.days} Days
                                    </Radio.Button>
                                ))}
                            </Field>
                            <ErrorMessage
                                className="text-danger"
                                name="bookingPlanId"
                                component="span"
                            />
                        </div>
                        <div className="py-1">
                            <Field name="date" type="date" as={Input} />
                            <ErrorMessage
                                className="text-danger"
                                name="date"
                                component="span"
                            />
                        </div>
                        <Button
                         type="primary"
                            loading={ isSubmitting }
                            disabled={isSubmitting || !dirty || !isValid}
                            onClick={handleSubmit} className="my-1 w-100">
                            Book
                        </Button>
                    </Form>
                )}
            </Formik>
        </Modal>
    );
}
