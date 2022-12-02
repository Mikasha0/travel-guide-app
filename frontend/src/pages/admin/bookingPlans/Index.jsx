import { Button, Skeleton } from "antd";
import React from "react";
import { useState } from "react";
import CreatePlan from "../../../components/section/admin/plans/CreatePlan";
import EditPlan from "../../../components/section/admin/plans/EditPlan";
import useFetch from "../../../hooks/useFetch";

export default function Index() {
  const [visible, setVisible] = useState(false);
  const [modelVisible, setModelVisible] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  const { data, error, loading, refresh } = useFetch("booking-plans");
  const open = () => setVisible(true);
  const close = () => setVisible(false);

  const openModal = (id) => {
    setCurrentId(id);
    setModelVisible(true);
  };
  const closeModal = () => {
    setCurrentId(null);
    setModelVisible(false);
  };

  if (loading) return <Skeleton />;
  if (error) return <span className="text-danger">{error.message}</span>;
  return (
    <>
      <CreatePlan
        visible={visible}
        handleClose={close}
        handleSuccess={refresh}
      />
      {currentId && (
        <EditPlan
         id={currentId}
          visible={modelVisible}
          handleClose={closeModal}
          handleSuccess={refresh}
        />
      )}
      <div className="container">
        <div className="card">
          <div className="card-header">
            Plans{" "}
            <Button type="primary" onClick={open}>
              Create
            </Button>
          </div>
          <div className="card-body">
            <table className="table table-striped table-sm table-bordered">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Plan Name</th>
                  <th>Price</th>
                  <th>Days(s)</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {data.data.map((plan, index) => (
                  <tr key={plan.id}>
                    <td>{++index}</td>
                    <td>{plan.name}</td>
                    <td>{plan.price}</td>
                    <td>{plan.days}</td>
                    <td>
                      <Button onClick={() => openModal(plan.id)}>Edit</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
