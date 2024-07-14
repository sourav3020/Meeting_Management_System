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
import SendMinutes from "./Pages/Meeting/SendMinutes";
import SecondPDFFile from "./Pages/Meeting/PDF/SecondPDFFile";
import FirstPDFFile from "./Pages/Meeting/PDF/FirstPDFFile";
import { PDFViewer } from "@react-pdf/renderer";
import FirstPDFViewerPage from "./Pages/Meeting/FirstPDFViewerPage";
import SecondPDFViewerPage from "./Pages/Meeting/SecondPDFViewerPage";
import SendInvitation from "./Pages/Meeting/SendInvitation";

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
          path: `secondpdf-viewer/:meetingId`,
          element: (
            <ProtectedRoute>
              <SecondPDFViewerPage />
            </ProtectedRoute>
          ),
        },
        {
          path: `firstpdf-viewer/:meetingId`,
          element: (
            <ProtectedRoute>
              <FirstPDFViewerPage />
            </ProtectedRoute>
          ),
        },
        {
          path: `sendminutes/:id`,
          element: (
            <ProtectedRoute>
              <SendMinutes />
            </ProtectedRoute>
          ),
        },
        {
          path: `sendinvitation/:id`,
          element: (
            <ProtectedRoute>
              <SendInvitation />
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
