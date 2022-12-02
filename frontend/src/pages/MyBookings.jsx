import { Skeleton } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import useToken from "../hooks/useToken";

export default function Bookings() {
    const [token] = useToken()
    const navigate = useNavigate()
  const { data, error, loading } = useFetch(
    "bookings/personal",
    {},
    token
  );

  if (loading) return <Skeleton />;
  if (error) return <span className="text-danger">{error.message}</span>;
  return (
    <div className="container py-2">
      <table className="table table-sm table-striped">
        <thead>
          <tr>
            <th>#</th>

            <th>Date</th>
            <th>Guide</th>

            <th>City</th>
            <th>Plan</th>
          </tr>
        </thead>
        <tbody>
          {data.data.map((booking, index) => (
            <tr key={booking.id}>
              <td>{++index}</td>

              <td>{new Date(booking.date).toLocaleDateString("en-US")}</td>
              <td>
                {
                    booking.guide? <span onClick={()=>navigate(`/guides/${booking.guide.id}`)}>
                      {booking.guide.name}-
                    {booking.guide.email}
                    
                    </span> :""
                }
             </td>

              <td>{booking.city.name}</td>
              <td>
                {booking.plan.name} - {booking.plan.days} Days - Rs.{" "}
                {booking.plan.price}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
