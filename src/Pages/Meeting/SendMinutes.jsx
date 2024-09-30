import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Modal from "@/components/ui/Modal";
import Notification from "@/components/ui/Notification";
import Spinner from "@/components/ui/Spinner";
import { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { useParams } from "react-router-dom";
import Select from "react-select";
import Meeting from "./Meeting";
import SaveMinutes from "./PDF/SaveMinutes";

const base_url = import.meta.env.VITE_API_URL;

const SendMinutes = () => {
  const { id } = useParams();

  const [selectedAttendees, setSelectedAttendees] = useState([]);
  const [attendeesOptions, setAttendeesOptions] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    fetchAttendees(id);
  }, [id]);

  const fetchAttendees = async (id) => {
    try {
      setLoading(true);
      const response = await fetch(`${base_url}/api/meeting/attendees/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch attendees");
      }
      const data = await response.json();
      const options = data.map((attendee) => ({
        value: attendee.email,
        label: `${attendee.first_name_bn} ${attendee.last_name_bn}`,
      }));
      setAttendeesOptions(options);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const sendEmails = async () => {
    try {
      setLoading(true);
      // Generate PDF
      const base64data = await generateAndSavePDF(id);

      // Send emails to selected attendees
      const selectedEmails = selectedAttendees.map(
        (attendee) => attendee.value
      );
      const subject = "Minutes of Meeting of last meeting";
      const body = `
Dear Sir,

Here is the Minutes of Meeting of our last meeting. Please find the attached agenda and additional details.

Best regards,
Meeting Management Team
University of Chittagong
`;
      const response = await fetch(`${base_url}/api/meeting/send-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          meeting_id: id,
          subject: subject,
          body: body,
          to_email: selectedEmails,
          attachment: base64data,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send emails");
      }
      setSelectedAttendees([]);
      //const responseData = await response.json();
      setSuccessMessage("Minutes sent successfully!");
      // Set a timeout to clear the message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (error) {
      setError("Failed to send minutes.");
    } finally {
      setLoading(false);
    }
  };

  const generateAndSavePDF = async (meetingId) => {
    return new Promise((resolve, reject) => {
      const onComplete = (base64data) => {
        resolve(base64data);
      };

      const onError = (error) => {
        reject(error);
      };

      const container = document.createElement("div");
      container.style.display = "none";
      document.body.appendChild(container);

      const root = createRoot(container);
      root.render(
        <SaveMinutes
          meetingID={meetingId}
          onComplete={onComplete}
          onError={onError}
        />
      );

      setTimeout(() => {
        root.unmount();
        document.body.removeChild(container);
      }, 2000);
    });
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
          Send Meeting Minutes
        </Button>
        <Button
          onClick={openSecondPDFViewer}
          className="mt-4 bg-blue-700 text-white p-2 rounded-md"
        >
          View Meeting Minutes
        </Button>
        {successMessage && (
          <Notification type="success" message={successMessage} />
        )}
        {error && <Modal type="error" message={error} />}
        {loading && <Spinner />}
      </div>
    </div>
  );
};

export default SendMinutes;
