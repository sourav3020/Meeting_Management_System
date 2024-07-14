import { Button } from "@/components/ui/button";
import Select from "react-select";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Meeting from "./Meeting";

const SendMinutes = () => {
  const { id } = useParams();
  const [selectedAttendees, setSelectedAttendees] = useState([]);
  const [attendeesOptions, setAttendeesOptions] = useState([]);

  useEffect(() => {
    fetchAttendees(id);
  }, [id]);

  const fetchAttendees = async (meetingId) => {
    const response = await fetch(
      `http://bike-csecu.com:5000/api/meeting/attendees/${meetingId}`
    );
    const data = await response.json();
    const options = data.map((attendee) => ({
      value: attendee.email,
      label: `${attendee.first_name} ${attendee.last_name}`,
    }));
    setAttendeesOptions(options);
  };

  const sendEmails = async () => {
    const emails = selectedAttendees.map((attendee) => attendee.value);
    // Add your logic to send emails to the selected attendees here
    console.log("Sending emails to:", emails);
    // Example: send email request to your backend
    // await fetch('/api/send-emails', {
    //     method: 'POST',
    //     body: JSON.stringify({ emails }),
    // });
  };

  const openSecondPDFViewer = () => {
    window.open(`/main/secondpdf-viewer/${id}`);
  };

  return (
    <div className="flex">
      <Meeting />
      <div className="w-full flex flex-col items-center justify-center gap-4 mt-8 p-4  rounded-lg  bg-white">
        <Label htmlFor="text" className="text-lg font-semibold text-gray-700">
          Send to
        </Label>
        <div className="w-full max-w-md">
          <Select
            isMulti
            options={attendeesOptions}
            value={selectedAttendees}
            onChange={(selectedOptions) =>
              setSelectedAttendees(selectedOptions)
            }
            placeholder="Select attendees"
            className="react-select-container"
            classNamePrefix="react-select"
          />
        </div>
        <Button
          onClick={sendEmails}
          className="mt-4 bg-gray-700 text-white p-2 rounded-md"
        >
          Send Emails
        </Button>
        <Button
          onClick={openSecondPDFViewer}
          className="mt-4 bg-blue-700 text-white p-2 rounded-md"
        >
          View Meeting Minutes
        </Button>
      </div>
    </div>
  );
};

export default SendMinutes;
