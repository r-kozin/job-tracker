import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = "http://localhost:3000";

const initialState = {
  boards: [
    {
      title: "Added",
      jobs: ['job-1', 'job-2', 'job-3', 'job-4'],
      id: 1,
    },
    {
      title: "Applied",
      jobs: [],
      id: 2,
    },
    {
      title: "Interviewing",
      jobs: [],
      id: 3,
    },
    {
      title: "Offer",
      jobs: [],
      id: 4,
    },
    {
      title: "Rejected",
      jobs: [],
      id: 5,
    },
  ],
  boardOrder: ['column-1', 'column-2', 'column-3', 'column-4', 'column-5'],
  fetchJobsStatus: "idle",
  addJobStatus: "idle",
  moveJobStatus: "idle",
  error: null,
};

const boardsSlice = createSlice({
  name: "boards",
  initialState,
  reducers: {
    incremented: (state) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.value += 1;
    },
    decremented: (state) => {
      state.value -= 1;
    },
  },
});

export const { incremented, decremented } = boardsSlice.actions;

export default boardsSlice.reducer;
