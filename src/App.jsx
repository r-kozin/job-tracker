import React, {useEffect} from "react";
import { RouterProvider, Outlet, createBrowserRouter } from "react-router-dom";
import Home from "./pages/Home/Home";
import { useDispatch } from "react-redux";
import { fetchAllData } from "./redux/boardSlice";
import JobInfo from "./pages/JobInfo/JobInfo";
import EditJobForm from "./pages/EditJob/EditJobForm";

const Layout = () => {
  return (
    <div className="app">
      {/* <Navbar /> */}
      <Outlet />
      {/* <Footer /> */}
    </div>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "/", element: <Home /> },
      // { path: "/add", element: <AddJobForm /> }, -- Turned into modal instead
      { path: "/job/:id", element: <JobInfo /> },
      { path: "/edit/:id", element: <EditJobForm /> },
    ],
  },
]);

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
      dispatch(fetchAllData()) // fetch all data from database
    }, []);

  return <RouterProvider router={router} />;
}
export default App;
