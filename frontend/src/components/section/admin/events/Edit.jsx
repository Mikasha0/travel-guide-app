import {
    Button,
   
    Input,
    Modal,
    notification,
    Select,
    Skeleton,
    
  } from "antd";
  import { Field, Formik, ErrorMessage, Form } from "formik";
  import {formatWithOptions} from 'date-fns/fp'
  import {enUS} from 'date-fns/locale'
  import React from "react";
  import useFetch from "../../../../hooks/useFetch";
  import useToken from "../../../../hooks/useToken";
  import { doPost } from "../../../../utils/request";
  import * as Yup from "yup";
  
  export default function Edit({ id,visible, handleClose, handleSuccess }) {
    const [token] = useToken();
    const { data, error, loading } = useFetch("cities",{} ,token);
    const { data:eventData, error: eventError, loading:eventLoading } = useFetch(`events/${id}`,{}, token);

    if (loading || eventLoading) return <Skeleton />;
    if (error) return <span className="text-danger">{error.message}</span>;
    if (eventError) return <span className="text-danger">{eventError.message}</span>;
    return (
      <Modal
        footer={[]}
        onCancel={handleClose}
        visible={visible}
        title="Edit Event"
      >
        <Formik
          initialValues={{
            cityId: eventData.data.cityId,
            date: formatWithOptions({locale:enUS},'mm/dd/yyyy')(new Date(eventData.data.date)),
            title: eventData.data.title,
          }}
          validationSchema={Yup.object({
            cityId: Yup.number().required("Please Select a City"),
            date: Yup.date().required("Date is Required"),
            title: Yup.string().required("Title is Required"),
          })}
          onSubmit={async (values, { setSubmitting }) => {
            try {
              const response = await doPost({
                method: "PUT",
                body: values,
                path: `events/${id}`,
                token: token,
              });
              if (response.ok) {
                notification.success({
                  message: "Event Updated",
                });
                handleClose();
                return handleSuccess();
              }
              notification.error({
                message: "Failed",
              });
            } catch (err) {
              notification.error({
                message: "Failed",
              });
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ dirty, handleSubmit, isSubmitting, setFieldValue }) => (
            <Form>
              <div className="py-1">
                <Select
                  name="cityId"
                  defaultValue={eventData.data.cityId}
                  onChange={(value) => setFieldValue("cityId", value)}
                  className="my-2 w-100"
                >
                  {eventData &&
                    data.data.map((city) => (
                      <Select.Option key={Math.random()} value={city.id}>
                        {city.name}
                      </Select.Option>
                    ))}
                </Select>
                <ErrorMessage
                  className="text-danger"
                  name="cityId"
                  component="span"
                />
              </div>
              <div className="py-1">
                <Field name="title" placeholder="Event Title" as={Input} />
                <ErrorMessage
                  className="text-danger"
                  name="title"
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
                className="w-100"
                loading={isSubmitting}
                disabled={isSubmitting || !dirty}
                onClick={handleSubmit}
              >
                Update
              </Button>
            </Form>
          )}
        </Formik>
      </Modal>
    );
  }
  