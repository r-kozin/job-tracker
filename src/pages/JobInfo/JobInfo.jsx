import React, { useEffect, useState } from "react";
import "./JobInfo.css";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { parseISO } from "date-fns";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import EditIcon from "@mui/icons-material/Edit";

const JobInfo = () => {
  const { id } = useParams();
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchJob = async () => {
      const res = await axios.get("http://localhost:3000/job/" + id);
      console.log(res.data);
      setData(res.data);
    };
    fetchJob();
  }, [id]);

  return (
    <div className="jobInfo">
      <div className="mainInfo">
        <div className="leftHeader">
          <h1>{data.jobtitle}</h1>
          <h2>{data.companyname}</h2>
        </div>
        <div className="rightHeader">
          <a href={`http://${window.location.host}/`} className="domLink">
            <ArrowBackIosNewIcon />
            <span>Back to Boards</span>
          </a>
          <Link to={`/edit/${id}`} className="domLink">
            <EditIcon fontSize="small" />
            <span>Edit Job</span>
          </Link>
        </div>
      </div>
      <div className="details">
        <div className="left">
          <p>Application Status: {data.appstatus}</p>
          <div className="app-url">
            <p>
              Application URL: <a href={data.appurl}>{data.appurl}</a>
            </p>
          </div>
          <p>Applicant Tracking System: {data.ats}</p>
        </div>
        <div className="right">
          <p>
            {data.salarymin === 0 && data.salarymax === 0
              ? "Salary: Not Listed"
              : `Salary Range: $${data.salarymin} - $${data.salarymax}`}
          </p>
          <p>Location: {data.location}</p>
          <p>
            Date Posted:{" "}
            {data.datecreated != null
              ? parseISO(data.datecreated).toLocaleDateString()
              : "Unknown"}
          </p>
          <p>Date Applied: {parseISO(data.dateapplied).toLocaleDateString()}</p>
        </div>
      </div>
      <div className="description">
        <p id="jobDescription">
          Description: <br />
          <br />
          {data.description}
        </p>
      </div>
    </div>
  );
};

export default JobInfo;
