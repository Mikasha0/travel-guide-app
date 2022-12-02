import { Button, Skeleton } from "antd";
import React from "react";
import useFetch from "../../../hooks/useFetch";
import useToken from "../../../hooks/useToken";
import { formatDistance } from "date-fns";
import Assign from "../../../components/section/admin/bookings/Assign";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Index() {
  const [token] = useToken();
  const [selectedId, setSelectedId] = useState(null);
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();
  const open = (id) => {
    setSelectedId(id);
    setVisible(true);
  };
  const close = () => {
    setSelectedId(null);
    setVisible(false);
  };
  const { data, error, loading, refresh } = useFetch("bookings", {}, token);
  if (loading) return <Skeleton />;
  if (error) return <span className="text-danger">{error.message}</span>;
  return (
    <div className="container py-2">
      {selectedId && (
        <Assign
          bookingId={selectedId}
          handleClose={close}
          handleSuccess={refresh}
          visible={visible}
        />
      )}
      <table className="table table-sm table-striped">
        <thead>
          <tr>
            <th>#</th>
            <th>Token</th>
            <th>Date</th>
            <th>User</th>
            <th>Agent</th>
            <th>City</th>
            <th>Plan</th>
          </tr>
        </thead>
        <tbody>
          {data.data.map((booking, index) => (
            <tr key={booking.id}>
              <td>{++index}</td>
              <td>{booking.khalti_token}</td>
              <td>{new Date(booking.date).toLocaleDateString("en-US")}</td>
              <td>
                {booking.user.name} - {booking.user.email} - {booking.mobile}
              </td>
              <td>
                {booking.guide ? (
                  <span onClick={() => navigate(`/guides/${booking.guide.id}`)}>
                    {booking.guide.name}-{booking.guide.email}
                  </span>
                ) : (
                  <Button onClick={() => open(booking.id)}>Assign</Button>
                )}
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
