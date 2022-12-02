import { Skeleton } from "antd";
import React from "react";
import useFetch from "../../hooks/useFetch";
import useToken from "../../hooks/useToken";

export default function Bookings() {
    const [token] = useToken()
  const { data, error, loading } = useFetch(
    "bookings/guide",
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
            <th>User</th>

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
                {booking.user.name} - {booking.user.email} - {booking.mobile}
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
