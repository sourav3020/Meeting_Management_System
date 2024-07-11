import axios from "axios";
import { useEffect, useState } from "react";
import "react-calendar/dist/Calendar.css";
import "react-clock/dist/Clock.css";
import "react-datetime-picker/dist/DateTimePicker.css";
import Meeting from "./Meeting";
import MeetingForm from './MeetingForm' ;

const base_url=import.meta.env.VITE_API_URL ;

const CallMeeting = () => {
  const [selectedAttendees, setSelectedAttendees] = useState([]);
  const [selectedEmails, setSelectedEmails] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [emailsOptions, setEmailsOptions] = useState([]);

  useEffect(() => {
    const fetchEmails = async () => {
      try {
        const response = await axios.get(`${base_url}/api/teacher/`);
        console.log("API Response:", response.data);
        const emails = response.data.data.map((teacher) => ({
          value: teacher.email,
          label: `${teacher.first_name_bn} ${teacher.last_name_bn} - ${teacher.email} `,
        }));
        setEmailsOptions(emails);
      } catch (error) {
        console.error("Error fetching emails:", error);
      }
    };
    fetchEmails();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const fetchSearchResults = async () => {
        try {
          const response = await axios.get(
            `http://bike-csecu.com:5000/api/teacher/search?q=${searchQuery}`
          );
          setSearchResults(response.data.data);
        } catch (error) {
          console.error("Error fetching search results:", error);
        }
      };

      fetchSearchResults();
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const handleUserSelect = (selectedOptions) => {
    setSelectedUsers(selectedOptions || []);
    setSearchQuery("");
  };

  const handleSubmit = (formData) => {
    // Handle the submission of formData here
    console.log("Form Data:", formData);
  };

  return (
    <div className="flex ">
    <Meeting />
    <div className=" w-full ">
      <div className="w-full   p-8   shadow-md">
        <p className="text-center text-black text-2xl font-bold mb-8 font-bangla">
          Call A Meeting
        </p>
        <MeetingForm handleSubmit={handleSubmit} />
        </div>
      </div>
    </div>
  );
};
export default CallMeeting;


