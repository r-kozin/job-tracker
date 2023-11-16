import { configureStore } from "@reduxjs/toolkit";
import boardsReducer from "./boardsSlice";
import jobsReducer from "./jobsSlice";
import boardReducer from "./boardSlice";

 export default configureStore({
  reducer: {
    boards: boardsReducer,
    jobs: jobsReducer,
    board: boardReducer,
  },
});