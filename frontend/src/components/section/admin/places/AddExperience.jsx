import useToken from "../../../../hooks/useToken";
import useFetch from "../../../../hooks/useFetch";
import { Button, notification, Select, Skeleton } from "antd";
import { Field, Form, Formik } from "formik";
import { doPost } from "../../../../utils/request";
export default function AddExperience({ id }) {
  const [token] = useToken();
  const {
    data: experiences,
    error: expError,
    loading: expLoading,
  } = useFetch("experiences", {}, token);
  const {
    data: selectedExperiences,
    error,
    loading,
    refresh,
  } = useFetch(`places/${id}/experiences`, {}, token);
  if (loading || expLoading) return <Skeleton />;

  if (error)
    return (
      <div className="container">
        <span className="text-danger">{error.message}</span>
      </div>
    );
  if (expError)
    return (
      <div className="container">
        <span className="text-danger">{expError.message}</span>
      </div>
    );

  return (
    <div className="container py-2">
      <div className="card ">
        <div className="card-header">Experience</div>
        <div className="card-body">
          <Formik
            initialValues={{
                experiences:selectedExperiences.data.map(exp=>exp.id)
            }}
            onSubmit={async (values, { setSubmitting }) => {
               try{
                const response = await doPost({body:values,path:`places/${id}/experiences`, token:token})
                if(response.ok) {
                    refresh()
                    return notification.success({
                        message:"Experiences Updated"
                    })
                }
                 notification.error({
                    message:"Experiences Failed to Update"
                })
               }catch(err){
                notification.error({
                    message:"Experiences Failed to Update"
                })
               }finally{
                   setSubmitting(false)
               }
            }}
          >
            {({setFieldValue, isSubmitting, handleSubmit}) => (
                <Form>
                <Select
                  mode="multiple"
                  size="large"
                  defaultValue={selectedExperiences.data.map(exp=>exp.id)}
                  onChange={(values)=>setFieldValue('experiences',values)}
                  placeholder="Select Experiences"
                  style={{ width:"100%", marginTop:"0.5rem", marginBottom:"0.5rem" }}
                >
                  {experiences.data.map((experience) => (
                    <Select.Option value={experience.id} key={Math.random()}>
                      {experience.type}
                    </Select.Option>
                  ))}
                </Select>
                <Button type="primary" onClick={handleSubmit} disabled={isSubmitting}>
                    Update
                </Button>
                </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}
