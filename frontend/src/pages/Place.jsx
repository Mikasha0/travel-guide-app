import React from "react";
import useFetch from "../hooks/useFetch";
import { useParams, useNavigate } from "react-router-dom";
import { Skeleton } from "antd";
import PlaceCard from "../components/PlaceCard";

export default function Place() {
  const { id } = useParams();
  const navigate = useNavigate()
  const { data, error, loading } = useFetch(`places/${id}`, {});
  if (loading) return <Skeleton />;
  if (error) return <span className="text-danger">{error.message}</span>;
  return (
    <div className="container">
      <h2>{data.data.name}</h2>
      <h3 title="View City"
      onClick={()=>navigate(`/cities/${data.data.cityId}`)}
      >{data.data.city.name}</h3>
      <div className="py-2">
        {data.data.experience.map((exp) => (
          <span
            className="badge badge-primary bg-primary mx-1"
            key={Math.random()}
          >
            {exp.type}
          </span>
        ))}
      </div>
      <div className="row py-4">
        {data.data.image.map((img) => (
          <div className="col-md-4 gy-5 gx-2">
            <img src={img.src} className="img-fluid" alt="Place" />
          </div>
        ))}
      </div>
      <SimilarPlaces place={data.data}/>
    </div>
  );
}

function SimilarPlaces({ place }) {
   const {data,error,loading} = useFetch("places",{cityId:place.cityId}) 
   if(loading) return <Skeleton />
   if(error) return <span className="text-danger">
       {error.message}
   </span>
  return (
   <>
    <h3>Places Nearby</h3>
    <div className="row gx-4 gy-4">
      {data.data.map((place) => (
        <div className="col-md-4" key={Math.random()}>
          <PlaceCard
            id={place.id}
            name={place.name}
            experience={place.experience}
            image={place.image}
            key={Math.random()}
          />
        </div>
      ))}
    </div>
   </>
  );
}
