import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import "./index.css";
import Main from "./Layout/Main";
import CallMeeting from "./Pages/Meeting/CallMeeting";
import GenerateMinutes from "./Pages/Meeting/GenerateMinutes";
import Login from "./Pages/login";
import ProtectedRoute from "./ProtectedRoute";
import Profile from "./Pages/Meeting/Profile";

const App = () => {
  const [authToken, setAuthToken] = useState(localStorage.getItem('authToken'));

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      setAuthToken(token);
    }
  }, []);

  const router = createBrowserRouter([
    {
      path: "/",
      element: authToken ? <Navigate to="/main/callmeeting" /> : <Navigate to="/login" />,
    },
    {
      path: "/login",
      element: <Login setAuthToken={setAuthToken} />,
    },
    {
      path: "/main",
      element: <Main />,
      children: [
        {
          path: "callmeeting",
          element: (
            <ProtectedRoute>
              <CallMeeting />
            </ProtectedRoute>
          ),
        },
        {
          path: "generateminutes",
          element: (
            <ProtectedRoute>
              <GenerateMinutes />
            </ProtectedRoute>
          ),
        },
        {
          path: "profile",
          element: (
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          ),
        },
      ],
    },
  ]);

  return (
    <RouterProvider router={router} />
  );
};


export default App;
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
