import {
  Button,
 
  Input,
  Modal,
  notification,
  Select,
  Skeleton,
  
} from "antd";
import { Field, Formik, ErrorMessage, Form } from "formik";
import React from "react";
import useFetch from "../../../../hooks/useFetch";
import useToken from "../../../../hooks/useToken";
import { doPost } from "../../../../utils/request";
import * as Yup from "yup";

export default function Create({ visible, handleClose, handleSuccess }) {
  const [token] = useToken();
  const { data, error, loading } = useFetch("cities", {},token);
  if (loading) return <Skeleton />;
  if (error) return <span className="text-danger">{error.message}</span>;
  return (
    <Modal
      footer={[]}
      onCancel={handleClose}
      visible={visible}
      title="Add Event"
    >
      <Formik
        initialValues={{
          cityId: null,
          date: null,
          title: "",
        }}
        validationSchema={Yup.object({
          cityId: Yup.number().required("Please Select a City"),
          date: Yup.date().required("Date is Required"),
          title: Yup.string().required("Title is Required"),
        })}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            const response = await doPost({
              method: "POST",
              body: values,
              path: `events`,
              token: token,
            });
            if (response.ok) {
              notification.success({
                message: "Event Added",
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
                onChange={(value) => setFieldValue("cityId", value)}
                className="my-2 w-100"
              >
                {data &&
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
              Add
            </Button>
          </Form>
        )}
      </Formik>
    </Modal>
  );
}
