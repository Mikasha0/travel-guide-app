import { Button, Form, notification, Rate, Skeleton, Comment, Avatar } from "antd";
import { Formik } from "formik";
import { useNavigate, useParams } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import useToken from "../hooks/useToken";
import useUser from "../hooks/useUser";
import { doPost } from "../utils/request";

export default function GuidePage() {
  const { id } = useParams();
  const { data, error, loading } = useFetch(`guides/${id}`);
  const [token] = useToken();
  const { user , isAdmin} = useUser();
  const navigate = useNavigate();

  const postComplaint = async ()=>{
    try {
        const description = window.prompt("Whats Your Complaint?",'');
        const response = await doPost({
            body:{description},
            path:`guides/${id}/complaints`,
            token: token
        })
        if(response.ok){
            return notification.success({
                message:"Complaint Posted"
            })
        }
        notification.error({
            message:"Complaint Failed To Post"
        })
    } catch (error) {
        notification.error({
            message:error.message||"Complaint Failed To Post"
        })
    }
  }

  if (loading) return <Skeleton />;
  if (error) return <span className="text-danger">{error.message}</span>;
  return (
    <div className="container">
      <div className="row py-4">
        <div className="col-md-4">
          <h1>{data.data.name}</h1>
          {data.data.city && <h2>{data.data.city.name}</h2>}
          <h3>{data.data.email}</h3>
        </div>
        <div className="col-md-8 row gx-4 gy-4">
          <div className="col-md-6">
          Rate:
          <Formik
            initialValues={{
              stars: null,
            }}
            onSubmit={async (values, { setSubmitting }) => {
              try {
                const response = await doPost({
                  body: values,
                  path: `guides/${id}/reviews`,
                  token: token,
                });
                if (response.ok) {
                  return notification.success({
                    message: "Review Submitted",
                  });
                }
                notification.error({
                  message: "Failed To Submit Review",
                });
              } catch (error) {
                notification.error({
                  message: error.message || "Something Went Wrong",
                });
              } finally {
                setSubmitting(false);
              }
            }}
          >
            {({ handleSubmit, values, setFieldValue, dirty, isSubmitting }) => (
              <Form>
                <Rate
                  value={values.stars}
                  onChange={(value) => setFieldValue("stars", value)}
                />
                <Button
                    className="mx-2"
                  loading={isSubmitting}
                  disabled={!dirty || isSubmitting}
                  onClick={user?handleSubmit:()=>navigate('/login')}
                >
                  Rate
                </Button>
              </Form>
            )}
          </Formik>
          </div>
          <div className="col-md-6">
              <Button
                type="primary"
                className="w-100"
                danger
                onClick={user?postComplaint:()=>navigate('/login')}
              >Report</Button>
          </div>
        </div>
      </div>
      <ShowReviews id={id}/>
      {isAdmin && <ShowReports id={id} token={token}/>}
    </div>
  );
}


function ShowReviews({id}){

    const { data, error, loading } = useFetch(`guides/${id}/reviews`);
    if(loading) return <Skeleton />
    if(error) <span className="text-danger">{error.message}</span>
   
    if(data) return (
        <div className="container-fluid py-2">
            <div className="pb-2">
               Average Rating: <Rate disabled allowHalf={true} defaultValue={data.aggregrate._avg.stars} />
            </div>
            <div className="row gx-4 gy-4">
            {
                data.data.map(review=>(
                    <div key={Math.random()} className="col-md-4">
                        <div className="card p-2">
                            <div className="row">
                            <div className="col-4">
                                <Avatar className="w-100 h-100" src="https://joeschmoe.io/api/v1/random" alt={review.user.name} />
                            </div>
                            <div className="col-8">
                                <h5>{review.user.name}</h5>
                                <Rate disabled defaultValue={review.stars} />
                            </div>
                            </div>
                        </div>
                    </div>
                ))
            }
        </div>
        </div>
    )
}


function ShowReports({id, token}){
    
    const { data, error, loading } = useFetch(`guides/${id}/complaints`,{},token);
    if(loading) return <Skeleton />
    if(error) <span className="text-danger">{error.message}</span>
    
    if(data) return(
        <div className="py-4">
            <h2>Reports</h2>
            {
                data.data.map(report=>(
                    <Comment
                        key={report.id}
                        author={report.user.name}
                        avatar={<Avatar src="https://joeschmoe.io/api/v1/random" alt={report.user.name} />}
                        content={
                            <p>
                             {report.description}
                            </p>
                          }
                    />
                ))
            }
        </div>
    )
}