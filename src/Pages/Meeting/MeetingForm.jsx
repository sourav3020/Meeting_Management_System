import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DateTimePickerField from "./DateTimePicker";
import SelectField from "./SelectedField";
//import { saveAs } from "file-saver";

const base_url = import.meta.env.VITE_API_URL;

const MeetingForm = () => {
  const [meetingId, setMeetingId] = useState("");
  const [meetingType, setMeetingType] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [agendaItems, setAgendaItems] = useState([""]);
  const [roomName, setRoomName] = useState("");
  const [signature, setSignature] = useState(null);
  const [selectedAttendees, setSelectedAttendees] = useState([]);
  const [emailsOptions, setEmailsOptions] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [showAddMoreButton, setShowAddMoreButton] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const navigate = useNavigate();

  //fetch all attendee email and user_id
  useEffect(() => {
    const fetchEmails = async (attendeeTypes) => {
      try {
        const emailResults = await Promise.all(
          attendeeTypes.map((type) => {
            const config = {
              headers: {}
            };
            console.log(type);
            if (type === 'student') {
              // Add your token logic here
              const token = "fba7b5c2-427a-11ef-88f4-3c5282764ceb"; 
              config.headers.Authorization = `Bearer ${token}`;
            }
            
            return axios.get(`${base_url}/api/${type}?page=2`, config);
          })
        );

        const attendees = emailResults.flatMap((response) =>
          response.data.data.map((attendee) => ({
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

    if (selectedAttendees.length > 0) {
      fetchEmails(selectedAttendees.map((attendee) => attendee.value));
    } else {
      setEmailsOptions([]);
    }
  }, [selectedAttendees]);

  //fetch all department
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axios.get(`${base_url}/api/department`);
        const departmentOptions = response.data.data.map((department) => ({
          value: department.department_id,
          label: department.department_name_bn,
        }));
        setDepartments(departmentOptions);
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    };

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

  const handleUserSelect = (selectedOptions) => {
    setSelectedUsers(selectedOptions || []);
  };

  //handle form submit .
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    //first upload signature and get signature file name to save it in database
    let signatureUrl = "";
    try {
      if (signature) {
        const formData = new FormData();
        formData.append("image", signature);

        const uploadResponse = await axios.post(
          `${base_url}/api/upload/image`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        signatureUrl = uploadResponse.data.image.filename;
        console.log("Signature uploaded:", signatureUrl);
      }
    } catch (error) {
      console.error("Error uploading signature:", error);
      setSubmitting(false);
      setSubmitSuccess(false);
      setSubmitError("Error uploading signature. Please try again.");
      return;
    }
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
      signature_url: signatureUrl,
    };

    try {
      const response = await axios.post(
        `${base_url}/api/meeting/create-meeting`,
        formData
      );
      console.log("Meeting created:", response.data);
      setSubmitting(false);
      setSubmitSuccess(true);
      setSubmitError(null);

      // Generate PDF and save to local storage
      // const pdfBlob = await generatePDF(formData);
      // savePdfToLocalStorage(pdfBlob);

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
      setSignature(null);
    } catch (error) {
      console.error("Error creating meeting:", error);
      setSubmitting(false);
      setSubmitSuccess(false);
      setSubmitError("Error creating meeting. Please try again.");

      if (error.response && error.response.status === 400) {
        setSubmitError("Invalid data provided. Please check your inputs.");
      } else if (error.response && error.response.status === 500) {
        setSubmitError("Server error. Please try again later.");
      } else {
        setSubmitError("Unexpected error. Please try again.");
      }
    }
  };

  // Function to generate PDF
  // const generatePDF = async (meetingId) => {
  //   // Generate PDF using FirstPDFFile component
  //   const pdfBlob = await pdf(<FirstPDFFile meetingID={meetingId} />).toBlob();
  //   return pdfBlob;
  // };

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
      <div className="grid w-full max-w-sm items-center gap-1.5 mt-4">
        <Label htmlFor="signature">Signature</Label>
        <Input
          id="signature"
          type="file"
          onChange={(e) => setSignature(e.target.files[0])}
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
      <SelectField
        id="department"
        label="Select Department"
        options={departments}
        value={selectedDepartment}
        onChange={setSelectedDepartment}
      />
      {submitting && <p className="text-blue-500 font-bangla">Submitting...</p>}
      {submitSuccess && (
        <p className="text-green-500 font-bangla">
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
