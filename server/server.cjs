const express = require("express");
const pool = require("./db.cjs");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());
const port = 3000;

app.get("/", (req, res) => {
  res.send("Please use /jobs or /jobs/:status or /job/:id");
});

app.post("/new", async (req, res) => {
  try {
    const newJob = await pool.query(
      "INSERT INTO jobs (companyname, jobtitle, description, location, salarymin, salarymax, ats, appurl, appstatus, dateapplied, datecreated) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(),$10) RETURNING *",
      [
        req.body.companyName,
        req.body.jobTitle,
        req.body.desc,
        req.body.location,
        req.body.salaryMin,
        req.body.salaryMax,
        req.body.ATS,
        req.body.appURL,
        req.body.appStatus,
        req.body.dateCreated,
      ]
    );
    res.json(newJob.rows[0]);
  } catch (err) {
    console.log(err);
    res.status(500);
    res.send(err);
  }
});

app.put("/edit/:id", async (req, res) => {
  try {
    const updatedJob = await pool.query(
      "UPDATE jobs SET companyname = $1, jobtitle = $2, description = $3, location = $4, salarymin = $5, salarymax = $6, ats = $7, appurl = $8, appstatus = $9, dateapplied = $10, datecreated = $11 WHERE id = $12 RETURNING *",
      [
        req.body.companyName,
        req.body.jobTitle,
        req.body.desc,
        req.body.location,
        req.body.salaryMin,
        req.body.salaryMax,
        req.body.ATS,
        req.body.appURL,
        req.body.appStatus,
        req.body.dateApplied,
        req.body.dateCreated,
        req.params.id,
      ]
    );
    res.json(updatedJob.rows[0]);
  } catch (err) {
    console.log(err);
    res.status(500);
    res.send(err);
  }
});

app.put("/move/:id", async (req, res) => {
  try {
    console.log(req.body)
    const movedJob = await pool.query(
      "UPDATE jobs SET appstatus = $1 WHERE id = $2 RETURNING *",
      [req.body.appstatus, req.params.id]
    );
    res.json(movedJob.rows[0]);
  } catch (err) {
    console.log(err);
    res.status(500);
    res.send(err);
  }
});

app.delete("/delete/:id", async (req, res) => {
  try {
    const deletedJob = await pool.query(
      "DELETE FROM jobs WHERE id = $1 RETURNING *",
      [req.params.id]
    );
    res.json(deletedJob.rows[0]);
    console.log(deletedJob.rows[0])
  } catch (err) {
    console.log(err);
    res.status(500);
    res.send(err);
  }
});

app.get("/jobs", async (req, res) => {
  try {
    const allJobs = await pool.query("SELECT * FROM jobs");
    res.json(allJobs.rows);
  } catch (err) {
    console.log(err);
  }
});
app.get("/jobs/:status", async (req, res) => {
  try {
    const jobsByStatus = await pool.query(
      "SELECT * FROM jobs WHERE appstatus = $1",
      [req.params.status]
    );
    if (jobsByStatus.rows.length === 0) {
      res.send("No jobs found in this category");
    } else {
      res.json(jobsByStatus.rows);
    }
  } catch (err) {
    console.log(err);
  }
});

app.get("/job/:id", async (req, res) => {
  try {
    const job = await pool.query("SELECT * FROM jobs WHERE id = $1", [
      req.params.id,
    ]);
    if (job.rows.length === 0) {
      res.send("Job not found");
    } else {
      res.json(job.rows[0]);
    }
  } catch (err) {
    console.log(err);
  }
});

app.put("/reject/:id", async (req, res) => {
  try {
    const rejectedJob = await pool.query(
      "UPDATE jobs SET appstatus = $1 WHERE id = $2 RETURNING *",
      ["Rejected", req.params.id]
    );
    res.json(rejectedJob.rows[0]);
  } catch (err) {
    console.log(err);
    res.send(err);
    res.status(500);
  }
});

app.get("/columns", async (req, res) => {
  try {
    const columns = await pool.query("SELECT * FROM column_list");
    res.json(columns.rows);
  } catch (err) {
    console.log(err);
  }
}
);

app.put("/reorder/:id", async (req, res) => {
  try {
    const reorderedJob = await pool.query(
      "UPDATE column_list SET jobIds = $1 WHERE id = $2 RETURNING *",
      [req.body.cardids, req.params.id]
    );
    res.json(reorderedJob.rows[0]);
    console.log(reorderedJob.rows[0]);
  } catch (err) {
    console.log(err);
    res.send(err);
    res.status(500);
  }
}
);

app.listen(port, () => {
  console.log(`Job Tracker listening at http://localhost:${port}`);
});
