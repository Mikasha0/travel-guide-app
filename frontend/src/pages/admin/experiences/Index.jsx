import { Button, notification, Skeleton } from "antd";
import React from "react";
import useFetch from "../../../hooks/useFetch";
import { useNavigate } from "react-router-dom";
import { doPost } from "../../../utils/request";
import useToken from "../../../hooks/useToken";

export default function Index() {
  const {
    data: experiences,
    error,
    loading,
    refresh,
  } = useFetch("experiences");
  const navigate = useNavigate();
  const [token] = useToken();
  const handleDelete = async (id) => {
    try {
      if (!window.confirm("Are You Sure?")) return;
      const response = await doPost({
        method: "DELETE",
        path: `experiences/${id}`,
        token: token,
      });
      if (response.ok) {
        notification.success({
          message: "Record Deleted",
        });
        return refresh();
      }
      notification.error({
        message: (await response.json().error) || "Something went wrong",
      });
    } catch (err) {
      notification.error({
        message: err.message || "Something Went Wrong",
      });
    }
  };

  const handleRename = async (id, originalName) => {
    try {
      const newName = window.prompt("New Name", originalName);
      if (newName === null || newName === originalName || newName === "") {
        return;
      }
      const response = await doPost({
        method: "PUT",
        body: { type: newName },
        path: `experiences/${id}`,
        token: token,
      });
      if (response.ok) {
        notification.success({
          message: "Update Successful",
        });
        return refresh();
      }
      notification.error({
        message: (await response.json().error) || "Something went wrong",
      });
    } catch (err) {
      notification.error({
        message: err.message || "Something went wrong",
      });
    }
  };
  if (error) {
    return <span className="text-danger">{error}</span>;
  }
  if (loading) return <Skeleton />;
  return (
    <div className="container p-1 mx-auto">
      <div className="card">
        <div className="card-header">
          <Button type="primary" onClick={() => navigate("create")}>
            Create
          </Button>
        </div>
        <div className="card-body">
          <table className="table table-sm table-border table-striped">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {experiences.data.map((experience, index) => (
                <tr key={Math.random()}>
                  <td>{++index}</td>
                  <td>{experience.type}</td>
                  <td>
                    <Button
                      type="primary"
                      onClick={() => handleDelete(experience.id)}
                      danger
                    >
                      Delete
                    </Button>
                    <Button
                      type="primary"
                      onClick={() =>
                        handleRename(experience.id, experience.type)
                      }
                    >
                      Rename
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
