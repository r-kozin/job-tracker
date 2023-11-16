import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = "http://localhost:3000";

const initialState = {
  cards: {
    // "job-1": { id: "job-1", companyName: "Google", jobTitle: "Web Developer" },
    // "job-2": {
    //   id: "job-2",
    //   companyName: "Apple",
    //   jobTitle: "Software Engineer",
    // },
    // "job-3": { id: "job-3", companyName: "Facebook", jobTitle: "SWE I" },
    // "job-4": {
    //   id: "job-4",
    //   companyName: "Netflix",
    //   jobTitle: "Software Developer",
    // },
  },
  columns: {
    "column-1": {
      id: "column-1",
      title: "Added",
      cardIds: [],
      //   cardIds: ["job-1", "job-2", "job-3", "job-4"],
    },
    "column-2": {
      id: "column-2",
      title: "Applied",
      cardIds: [],
    },
    "column-3": {
      id: "column-3",
      title: "Interviewing",
      cardIds: [],
    },
    "column-4": {
      id: "column-4",
      title: "Offer",
      cardIds: [],
    },
    "column-5": {
      id: "column-5",
      title: "Rejected",
      cardIds: [],
    },
  },
  // Facilitate reordering of the columns
  columnOrder: ["column-1", "column-2", "column-3", "column-4", "column-5"],
  fetchJobsStatus: "idle",
  fetchColumnsStatus: "idle",
  fetchDataStatus: "idle",
  error: null,
};

export const fetchAllData = createAsyncThunk(
  "jobs/fetchAllData", //action type, automatically creates /pending etc.
  async () => {
    console.log("fetching all data");
    const columnRes = await axios.get(`${BASE_URL}/columns`); // fetch
    console.log(columnRes.data);
    const jobsRes = await axios.get(`${BASE_URL}/jobs`); // fetch
    console.log(jobsRes.data);
    return { columns: columnRes.data, jobs: jobsRes.data }; //return data from response
  }
);

export const moveJob = createAsyncThunk(
  "jobs/updateJob", //action type, automatically creates /pending etc.
  async (action) => {
    console.log(action.id.split("-")[1]);
    const splitId = action.id.split("-")[1];
    console.log(action.appstatus);
    console.log("updating");
    const res = await axios.put(`${BASE_URL}/move/${splitId}`, {
      appstatus: action.appstatus,
    });
    // console.log(res.data);
    // return res.data;
  }
);

export const reorderJob = createAsyncThunk(
  "jobs/reorderJob", //action type, automatically creates /pending etc.
  async (action) => {
    const startId = action.newStart.id.split("-")[1]; // get id of start column, without "column-" prefix
    const finishId = action.newFinish.id.split("-")[1];

    const res = await axios.put(`${BASE_URL}/reorder/${startId}`, {
      // send request to server to update original column
      cardids: action.newStart.cardIds, // send new cardIds array of start column
    });
    const res2 = await axios.put(`${BASE_URL}/reorder/${finishId}`, {
      // send request to server to update new column
      cardids: action.newFinish.cardIds, // send new cardIds array of new column
    });
    console.log(res.data);
    // return res.data;
  }
);
export const reorderColumn = createAsyncThunk(
  "jobs/reorderColumn", //action type, automatically creates /pending etc.
  async (action) => {
    console.log(action);
    console.log(action.cardIds);
    const columnId = action.id.split("-")[1];

    const res = await axios.put(`${BASE_URL}/reorder/${columnId}`, {
      cardids: action.cardIds,
    });
    console.log(res.data);
    // return res.data;
  }
);

function addNewCards(state) {
  for (let i = 0; i < state.cards.length; i++) {
    console.log(state.cards[i].appstatus);
    if (state.cards[i].appstatus === "Added") {
      if (
        state.columns["column-1"].cardIds.indexOf(`job-${state.cards[i].id}`) <
        0
      ) {
        state.columns["column-1"].cardIds.push(`job-${state.cards[i].id}`);
      }
    } else if (state.cards[i].appstatus === "Applied") {
      if (
        state.columns["column-2"].cardIds.indexOf(`job-${state.cards[i].id}`) <
        0
      ) {
        state.columns["column-2"].cardIds.push(`job-${state.cards[i].id}`);
      }
    } else if (state.cards[i].appstatus === "Interviewing") {
      if (
        state.columns["column-3"].cardIds.indexOf(`job-${state.cards[i].id}`) <
        0
      ) {
        state.columns["column-3"].cardIds.push(`job-${state.cards[i].id}`);
      }
    } else if (state.cards[i].appstatus === "Offer") {
      if (
        state.columns["column-4"].cardIds.indexOf(`job-${state.cards[i].id}`) <
        0
      ) {
        state.columns["column-4"].cardIds.push(`job-${state.cards[i].id}`);
      }
    } else if (state.cards[i].appstatus === "Rejected") {
      if (
        state.columns["column-5"].cardIds.indexOf(`job-${state.cards[i].id}`) <
        0
      ) {
        state.columns["column-5"].cardIds.push(`job-${state.cards[i].id}`);
      }
    }
  }
  console.log(state.columns);
}

const boardSlice = createSlice({
  name: "board",
  initialState,
  reducers: {
    updateState: (state, action) => {
      console.log(action.payload);
      state.columns = {
        ...state.columns,
        [action.payload.newStart.id]: action.payload.newStart,
        [action.payload.newFinish.id]: action.payload.newFinish,
      };
      console.log(state);
    },
    updateColumn: (state, action) => {
      console.log(action.payload);
      state.columns = { ...state.columns, [action.payload.id]: action.payload };
      console.log(state);
    },
    addToState: (state, action) => {
      console.log(action.payload);
      let keys = [];
      for (let card in state.cards) {
        if (state.cards.hasOwnProperty(card)) {
          let cardId = card.split("-")[1];
          keys.push(parseInt(cardId));
        }
      }
      let k = 0;
      for (let i = 0; i < keys.length; i++) {
        if (keys[i] > k) {
          k = keys[i] + 1;
        }
        console.log(k);
      }
      action.payload.id = `job-${k}`; // add ID to payload
      action.payload.dateapplied = new Date().toISOString();

      state.cards = {
        ...state.cards,
        [`job-${k}`]: action.payload,
      };
      console.log(state.cards);
      if (action.payload.appStatus === "Added") {
        state.columns["column-1"].cardIds.push(`job-${k}`);
        console.log("added to column 1");
      } else if (action.payload.appStatus === "Applied") {
        state.columns["column-2"].cardIds.push(`job-${k}`);
        console.log("added to column 2");
      } else if (action.payload.appStatus === "Interviewing") {
        state.columns["column-3"].cardIds.push(`job-${k}`);
        console.log("added to column 3");
      } else if (action.payload.appStatus === "Offer") {
        state.columns["column-4"].cardIds.push(`job-${k}`);
        console.log("added to column 4");
      } else if (action.payload.appStatus === "Rejected") {
        state.columns["column-5"].cardIds.push(`job-${k}`);
        console.log("added to column 5");
      }
      console.log(state.cards);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAllData.pending, (state, action) => {
      state.fetchDataStatus = "pending";
    });
    builder.addCase(fetchAllData.rejected, (state, action) => {
      state.fetchDataStatus = "failed";
      state.error = action.error.message;
    });
    builder.addCase(fetchAllData.fulfilled, (state, action) => {
      for (let i = 0; i < action.payload.columns.length; i++) {
        let jobIds;
        if (action.payload.columns[i].jobids === "{}") {
          jobIds = [];
        } else {
          if (action.payload.columns[i].jobids === null) {
            jobIds = [];
          } else {
            jobIds = action.payload.columns[i].jobids
              .replace("{", "")
              .replace("}", "")
              .replace(/(['"])/g, "")
              .split(",");
            console.log(jobIds);
          }
        }
        state.columns[`column-${action.payload.columns[i].id}`] = {
          id: `column-${action.payload.columns[i].id}`,
          title: action.payload.columns[i].title,
          cardIds: jobIds,
        };
        console.log(state.columns);
      }
      for (let i = 0; i < action.payload.jobs.length; i++) {
        if (state.cards.hasOwnProperty(`job-${action.payload.jobs[i].id}`)) {
          console.log("already exists");
        } else {
          state.cards[`job-${action.payload.jobs[i].id}`] = {
            id: `job-${action.payload.jobs[i].id}`,
            companyName: action.payload.jobs[i].companyname,
            jobTitle: action.payload.jobs[i].jobtitle,
            appstatus: action.payload.jobs[i].appstatus,
            joburl: action.payload.jobs[i].joburl,
            description: action.payload.jobs[i].description,
            salarymin: action.payload.jobs[i].salarymin,
            salarymax: action.payload.jobs[i].salarymax,
            dateapplied: action.payload.jobs[i].dateapplied,
            datecreated: action.payload.jobs[i].datecreated,
            ats: action.payload.jobs[i].ats,
            location: action.payload.jobs[i].location,
          };
        }
      }
      console.log(state.cards);
      console.log(state.columns);
      addNewCards({ cards: action.payload.jobs, columns: state.columns });
      state.fetchDataStatus = "success";
    });
  },
});

export const { updateState, updateColumn, addToState } = boardSlice.actions;

export default boardSlice.reducer;
