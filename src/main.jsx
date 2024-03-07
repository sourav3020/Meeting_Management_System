import React from 'react'
import ReactDOM from 'react-dom/client'
import Main from './Layout/Main';
import Home from './Pages/Home/Home/Home';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import "./index.css";
import Meeting from './Pages/Meeting/Meeting';
import Profile from './Pages/Profile/Profile';
import CallMeeting from './Pages/Meeting/CallMeeting';
import MeetingList from './Pages/Meeting/MeetingList';
import GenerateMinutes from './Pages/Meeting/GenerateMinutes';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Main></Main>,
    children:[
      {
        path: "/",
        element: <Home></Home>
      },
      {
        path: "/meeting",
        element: <Meeting></Meeting>
      },
      {
        path: "/profile",
        element: <Profile></Profile>
      },
      {
        path: "/callmeeting",
        element: <CallMeeting></CallMeeting>
      },
      {
        path: "/generateminutes",
        element: <GenerateMinutes></GenerateMinutes>
      },
      {
        path: "/meetinglist",
        element: <MeetingList></MeetingList>
      },

    ]
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
