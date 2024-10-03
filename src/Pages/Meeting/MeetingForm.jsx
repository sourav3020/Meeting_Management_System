import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DateTimePickerField from "./DateTimePicker";
import SelectField from "./SelectedField";
import SelectedField2 from "./SelectedField2";
//import { saveAs } from "file-saver";

const base_url = import.meta.env.VITE_API_URL;

const MeetingForm = () => {
  const [meetingId, setMeetingId] = useState("");
  const [meetingType, setMeetingType] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [agendaItems, setAgendaItems] = useState([""]);
  const [roomName, setRoomName] = useState("");
  const [selectedAttendees, setSelectedAttendees] = useState([]);
  const [emailsOptions, setEmailsOptions] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [showAddMoreButton, setShowAddMoreButton] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedChairman, setSelectedChairman] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const navigate = useNavigate();

  /*
   Login function to fetch session token 
  (as login not implemented , here implement default
  login .require  fix  it in later version ).

     */

  // const login = async () => {
  //   try {
  //     const response = await axios.post(`${base_url}/api/login`, {
  //       email: "rudra@cu.ac.bd",
  //       password: "rudra1234",
  //     });

  //     if (response.data.session_id) {
  //       console.log("Login successful:", response.data.message);
  //       localStorage.setItem("session_token", response.data.session_id);
  //     }
  //   } catch (error) {
  //     console.error("Login failed:", error.response?.data || error.message);
  //   }
  // };

  // useEffect(() => {
  //   login();
  // }, []);

  // //fetch all attendee email and user_id

  const fetchEmails = async (attendeeTypes) => {
    const fetchAllPages = async (type, page = 1, accumulatedData = []) => {
      try {
        const config = {
          headers: {},
        };
        const token = localStorage.getItem("authToken");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        if (type === "student") {
          config.headers.Authorization = `Bearer ${token}`;
        }

        const response = await axios.get(
          `${base_url}/api/${type}?page=${page}`,
          config
        );
        const data = response.data.data;
        // const totalRecords = response.data.total_records;

        const newData = [...accumulatedData, ...data];

        // Check if there are more pages
        if (response.data.next) {
          return fetchAllPages(type, response.data.next.page, newData);
        } else {
          return newData;
        }
      } catch (error) {
        console.error(
          `Error fetching data for ${type} on page ${page}:`,
          error
        );
        return accumulatedData;
      }
    };

    try {
      const emailResults = await Promise.all(
        attendeeTypes.map((type) => fetchAllPages(type))
      );

      const attendees = emailResults.flatMap((data) =>
        data.map((attendee) => ({
          value: attendee.user_id,
          email: attendee.email,
          label: `${attendee.first_name_bn} ${attendee.last_name_bn} - ${attendee.email}`,
        }))
      );

      setEmailsOptions(attendees);
    } catch (error) {
      console.error("Error fetching emails:", error);
    }
  };

  const formatMeetingDateTime = (time) => {
    const date = new Date(time);

    // Function to format date as dd/mm/yyyy
    const formatDate = () => {
      const options = {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        timeZone: "Asia/Dhaka",
      };
      return date.toLocaleDateString("bn-BD", options).replace(/\//g, "/");
    };

    // Function to format time as HH:MM:SS
    const formatTime = () => {
      const options = {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
        timeZone: "Asia/Dhaka",
      };
      const timeString = date.toLocaleTimeString("bn-BD", options);
      return timeString.replace(/ (AM|PM)/, ""); // Removes AM/PM
    };

    // Function to get day of the week
    const formatDayOfWeek = () => {
      return date.toLocaleDateString("bn-BD", { weekday: "long" });
    };

    return {
      date: formatDate,
      time: formatTime,
      day: formatDayOfWeek,
    };
  };

  useEffect(() => {
    if (selectedAttendees.length > 0) {
      fetchEmails(selectedAttendees.map((attendee) => attendee.value));
    } else {
      setEmailsOptions([]);
    }
  }, [selectedAttendees]);

  //fetch all department
  const fetchDepartments = async () => {
    try {
      const response = await axios.get(`${base_url}/api/department?limit=all`);
      //console.log(response);
      const data = response.data;
      //console.log(data);
      const newData = [...data];

      const allDepartments = newData;
      const departmentOptions = allDepartments.map((department) => ({
        value: department.department_id,
        label: department.department_name_bn,
      }));
      setDepartments(departmentOptions);
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleAddAgenda = () => {
    setAgendaItems([...agendaItems, ""]);
  };

  const handleAgendaChange = (index, value) => {
    const newAgendaItems = [...agendaItems];
    newAgendaItems[index] = value;
    setAgendaItems(newAgendaItems);

    if (index === 0 && value.trim() !== "" && !showAddMoreButton) {
      setShowAddMoreButton(true);
    }
  };

  const handleRemoveAgenda = (index) => {
    const newAgendaItems = [...agendaItems];
    newAgendaItems.splice(index, 1);
    setAgendaItems(newAgendaItems);
  };

  const handleUserSelect = (selectedOptions) => {
    setSelectedUsers(selectedOptions || []);
  };
  const handleChairmanSelect = (selectedOptions) => {
    setSelectedChairman(selectedOptions || []);
  };

  //handle form submit .
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const token = localStorage.getItem("session_token");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    // form data to save meeting
    const formData = {
      meeting_id: parseInt(convertBengaliToEnglish(meetingId)),
      meeting_type: meetingType,
      selected_date: selectedDate.toISOString(),
      agenda: agendaItems.map((item, index) => ({
        topic: `বিষয় ${convertToBengaliNumber(index + 1)}`,
        description: item,
        decision: "",
      })),
      room_name: roomName,
      selected_attendees: selectedUsers.map((user) => user.value),
      department_id: selectedDepartment ? selectedDepartment.value : null,
      signature_url: selectedChairman ? selectedChairman.value : null,
    };

    try {
      const response = await axios.post(
        `${base_url}/api/meeting/create-meeting`,
        formData
      );
      console.log("Meeting created:", response.data);

      // Prepare data for notice
      const noticeData = {
        notice_type: meetingType,
        notice_title: `${selectedDepartment.label} বিভাগের সাপ্তাহিক সভা`,
        notice_description: `নির্বাচিত শিক্ষকবৃন্দকে জানানো যাচ্ছে যে আগামী ${formatMeetingDateTime(
          selectedDate
        ).date()} তারিখে ${roomName} বিভাগীয় ${meetingType} সভা অনুষ্ঠিত হবে।
        সদস্যদের অনুরোধ করা হচ্ছে যে, সভায় উপস্থিত থেকে তাদের মূল্যবান মতামত প্রদান করুন। অনুগ্রহ করে সময়ানুবর্তিতা বজায় রাখুন।
        `,
        notice_attachment: "no pdf available",
      };
      // Create the notice
      const noticeResponse = await axios.post(
        `${base_url}/api/notice`,
        noticeData,
        config
      );
      console.log("Notice created: ", noticeResponse.data);

      setSubmitting(false);
      setSubmitSuccess(true);
      setSubmitError(null);

      setTimeout(() => {
        navigate(
          `/main/sendinvitation/${parseInt(convertBengaliToEnglish(meetingId))}`
        );
      }, 2000);

      // Clear form fields upon successful submission
      setMeetingId("");
      setMeetingType("");
      setSelectedDate(new Date());
      setAgendaItems([""]);
      setRoomName("");
      setSelectedUsers([]);
      setSelectedDepartment(null);
      setSelectedChairman(null);
    } catch (error) {
      console.log(selectedChairman);
      console.error("Error creating meeting:", error);
      setSubmitting(false);
      setSubmitSuccess(false);
      setSubmitError("Error creating meeting. Please try again.");

      if (error.response && error.response.status === 400) {
        setSubmitError(
          <span className="text-white bg-red-500 p-2 rounded mx-auto mt-4 block">
            Invalid data provided. Please check your inputs.
          </span>
        );
      } else if (error.response && error.response.status === 500) {
        setSubmitError(
          <span className="text-white bg-red-500 p-2 rounded mx-auto mt-4 block">
            Server error. Please try again later.
          </span>
        );
      } else {
        setSubmitError(
          <span className="text-white bg-red-500 p-2 rounded mx-auto mt-4 block">
            Unexpected error. Please try again.
          </span>
        );
      }
    }
  };

  // Function to convert English numbers to Bengali
  function convertToBengaliNumber(number) {
    const bengaliNumbers = {
      0: "০",
      1: "১",
      2: "২",
      3: "৩",
      4: "৪",
      5: "৫",
      6: "৬",
      7: "৭",
      8: "৮",
      9: "৯",
    };

    // Convert each digit in the number to Bengali
    const convertedNumber = number
      .toString()
      .replace(/\d/g, (digit) => bengaliNumbers[digit]);

    return convertedNumber;
  }

  function convertBengaliToEnglish(numberString) {
    const bengaliToEnglishMap = {
      "০": "0",
      "১": "1",
      "২": "2",
      "৩": "3",
      "৪": "4",
      "৫": "5",
      "৬": "6",
      "৭": "7",
      "৮": "8",
      "৯": "9",
    };

    return numberString.replace(
      /[০১২৩৪৫৬৭৮৯]/g,
      (match) => bengaliToEnglishMap[match]
    );
  }

  return (
    <form
      onSubmit={handleFormSubmit}
      className="flex flex-col items-center justify-center"
    >
      <div className="grid w-full max-w-sm items-center gap-1.5 font-bangla">
        <Label htmlFor="meetingId">Meeting Id</Label>
        <Input
          type="text"
          id="meetingId"
          placeholder="meeting id"
          value={meetingId}
          onChange={(e) => setMeetingId(e.target.value)}
          className="font-bangla"
        />
      </div>
      <div className="grid w-full max-w-sm items-center gap-1.5 mt-4">
        <Label htmlFor="meetingType">Meeting Type</Label>
        <Input
          type="text"
          id="meetingType"
          placeholder="meeting type"
          value={meetingType}
          onChange={(e) => setMeetingType(e.target.value)}
          className="font-bangla"
        />
      </div>
      <DateTimePickerField
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
      />
      <div className="grid w-full max-w-sm items-center gap-1.5 mt-4">
        <Label htmlFor="agenda">Agenda</Label>
        {agendaItems.map((item, index) => (
          <Textarea
            key={index}
            placeholder={`Agenda ${index + 1}`}
            value={item}
            onChange={(e) => handleAgendaChange(index, e.target.value)}
            className="mb-2 font-bangla"
          />
        ))}
        {showAddMoreButton && (
          <Button type="button" onClick={handleAddAgenda} className="mt-2">
            Add More
          </Button>
        )}
      </div>
      <div className="grid w-full max-w-sm items-center gap-1.5 mt-4">
        <Label htmlFor="roomName">Room Name</Label>
        <Input
          type="text"
          id="roomName"
          placeholder="room name"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          className="font-bangla"
        />
      </div>
      <SelectField
        id="attendees"
        label="Select Attendees"
        options={[
          { value: "teacher", label: "Teachers" },
          { value: "student", label: "Students" },
          { value: "staff", label: "Staffs" },
        ]}
        isMulti={true}
        value={selectedAttendees}
        onChange={setSelectedAttendees}
      />
      <SelectField
        id="attendeesEmails"
        label="Attendees' Emails"
        options={emailsOptions}
        isMulti={true}
        value={selectedUsers}
        onChange={handleUserSelect}
      />
      <SelectedField2
        id="department"
        label="Select Department"
        options={departments}
        value={selectedDepartment}
        onChange={setSelectedDepartment}
      />
      <SelectedField2
        menuPlacement="top"
        id="chairman"
        label="Select Meeting Chairman"
        options={emailsOptions}
        value={selectedChairman}
        onChange={handleChairmanSelect}
      />

      {submitting && <p className="text-blue-500 font-bangla">Submitting...</p>}
      {submitSuccess && (
        <p className="text-white bg-green-500 p-2 rounded mx-auto mt-4 block font-bangla">
          Meeting created successfully!
        </p>
      )}
      {submitError && <p className="text-red-500 font-bangla">{submitError}</p>}
      <Button type="submit" className="mt-8 font-bangla" disabled={submitting}>
        Submit
      </Button>
    </form>
  );
};

export default MeetingForm;
