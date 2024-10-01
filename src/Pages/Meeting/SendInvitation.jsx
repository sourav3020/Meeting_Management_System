import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Modal from "@/components/ui/Modal";
import Notification from "@/components/ui/Notification";
import Spinner from "@/components/ui/Spinner";
import { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { useParams, useNavigate } from "react-router-dom";
import Select from "react-select";
import Meeting from "./Meeting";
import SaveInvitation from "./PDF/SaveInvitation";

const base_url = import.meta.env.VITE_API_URL;

const SendInvitation = () => {
  const { id } = useParams();
  const navigate = useNavigate();

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
      const subject = "Invitation to Upcoming Meeting";
      const body = `
Dear Sir,

You are cordially invited to attend our upcoming meeting. Please find the attached agenda and additional details.

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

      //const responseData = await response.json();
      setSuccessMessage(
        <span className="flex items-center justify-center">
          Invitations sent successfully!
        </span>
      );

      setSelectedAttendees([])
      // Set a timeout to clear the message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000); // Change 3000 to your desired duration in milliseconds
    } catch (error) {
      setError("Failed to send invitations.");
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
      container.style.display = "none"; // Hide the container
      document.body.appendChild(container);

      const root = createRoot(container);
      root.render(
        <SaveInvitation
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

  const openFirstPDFViewer = () => {
    window.open(`/main/firstpdf-viewer/${id}`);
  };

  return (
    <div className="flex">
      <Meeting />
      <div className="w-full flex flex-col items-center justify-center gap-4 mt-8 p-4 rounded-lg bg-white relative">
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
          Send Invitation
        </Button>
        <Button
          onClick={openFirstPDFViewer}
          className="mt-4 bg-blue-700 text-white p-2 rounded-md"
        >
          View Invitation
        </Button>

        {successMessage && (
          <div className="inset-0 flex items-center justify-center bg-gray bg-opacity-20 z-50">
            <Notification
              type="success"
              message={successMessage}
              className="bg-white text-gray-800 p-4 rounded-lg shadow-lg"
            />
          </div>
        )}
        <div className="flex items-center justify-center">
          {error && <Modal type="error" message={error} />}

          {loading && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
              <Spinner style={{ width: "35px", height: "35px" }} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SendInvitation;
