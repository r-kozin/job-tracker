import React from "react";
import "./EditJobForm.css";
import axios from "axios";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { parseISO } from "date-fns";
import { useSelector, useDispatch } from "react-redux";
import { reorderColumn } from "../../redux/boardSlice";

const EditJobForm = () => {
  const { id } = useParams();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(null);
  const boardState = useSelector((state) => state.board);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchJob = async () => {
      setLoading(true);
      const res = await axios.get("http://localhost:3000/job/" + id);
      console.log(res.data);
      setData(res.data);
      updateAppStatus(res.data.appstatus);
      setLoading(false);
    };
    fetchJob();
  }, [id]);

  const updateAppStatus = (status) => {
    console.log("update app status");
    console.log(status);
    const applicationStatus = document.getElementById("appStatus");
    const appStatusSplit = applicationStatus.innerHTML.split(`${status}`);
    applicationStatus.innerHTML =
      appStatusSplit[0] + `${status}" selected> ${status}` + appStatusSplit[2];
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted");
    //console log data from form
    const formData = new FormData(e.target);
    const jobData = Object.fromEntries(formData);
    jobData.dateApplied = data.dateapplied;
    console.log(jobData);

    //post data to server
    const postData = async (data) => {
      if (data.dateCreated === "") {
        data.dateCreated = null;
      }
      const res = await axios.put("http://localhost:3000/edit/" + id, data);
      console.log(res);
      if (res.status === 200) {
        alert("Job edited successfully");
        window.location.href = "/";
      }
    };
    postData(jobData);
  };

  const handleDelete = (e) => {
    e.preventDefault();
    console.log("handle delete");
    const deleteJob = async () => {
      const res = await axios.delete("http://localhost:3000/delete/" + id);
      console.log(res);
      if (res.status === 200) {
        let column = null;
        if (data.appstatus === "Added") {
          column = boardState.columns["column-1"];
        } else if (data.appstatus === "Applied") {
          column = boardState.columns["column-2"];
        } else if (data.appstatus === "Interviewing") {
          column = boardState.columns["column-3"];
        } else if (data.appstatus === "Offer") {
          column = boardState.columns["column-4"];
        } else if (data.appstatus === "Rejected") {
          column = boardState.columns["column-5"];
        }

        console.log(column);
        const newCardIds = Array.from(column.cardIds);
        newCardIds.splice(newCardIds.indexOf(`job-${id}`), 1);
        console.log(newCardIds);
        const newColumn = {
          ...column,
          cardIds: newCardIds,
        };
        dispatch(reorderColumn(newColumn));
        alert("Job deleted successfully");
        window.location.href = "/";
      }
    };
    deleteJob();
  };

  const handleCancel = (e) => {
    e.preventDefault();
    window.location.href = "/";
  };

  return (
    <div className="editJobForm">
      <h1>Edit Job</h1>
      <div className="formContainer">
        <form onSubmit={handleSubmit}>
          <label htmlFor="companyName">Company Name</label>
          <input
            type="text"
            id="companyName"
            name="companyName"
            defaultValue={data.companyname}
            required
          />
          <label htmlFor="jobTitle">Job Title</label>
          <input
            type="text"
            id="jobTitle"
            name="jobTitle"
            defaultValue={data.jobtitle}
            required
          />
          <label htmlFor="desc">Description</label>
          <textarea
            id="desc"
            name="desc"
            placeholder="Paste job description here..."
            defaultValue={data.description}
          />
          <label htmlFor="location">Location</label>
          <input
            type="text"
            id="location"
            name="location"
            defaultValue={data.location}
            required
          />
          <label htmlFor="salaryMin">Salary Min</label>
          <input
            type="number"
            id="salaryMin"
            name="salaryMin"
            defaultValue={loading ? 0 : data.salarymin}
          />
          <label htmlFor="salaryMax">Salary Max</label>
          <input
            type="number"
            id="salaryMax"
            name="salaryMax"
            defaultValue={loading ? 0 : data.salarymax}
          />
          <label htmlFor="ATS">ATS (Workday, LinkedIn, etc.)</label>
          <input type="text" id="ATS" name="ATS" defaultValue={data.ats} />
          <label htmlFor="appURL">Application URL</label>
          <input
            type="text"
            id="appURL"
            name="appURL"
            defaultValue={data.appurl}
          />
          <label htmlFor="appStatus">Application Status</label>
          <select id="appStatus" name="appStatus" required>
            <option value="Added">Added</option>
            <option value="Applied">Applied</option>
            <option value="Interviewing">Interviewing</option>
            <option value="Offer">Offer</option>
            <option value="Rejected">Rejected</option>
          </select>
          <label htmlFor="dateCreated">Date Posted</label>
          <input
            type="date"
            id="dateCreated"
            name="dateCreated"
            defaultValue={
              data.datecreated != null || undefined
                ? data.datecreated.split("T")[0]
                : ""
            }
          />
          <div className="formButtons">
            <button type="submit" className="submitButton">
              SUBMIT
            </button>
            <button className="cancelButton" onClick={handleCancel}>
              CANCEL
            </button>
            <button className="deleteButton" onClick={handleDelete}>
              DELETE
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditJobForm;
