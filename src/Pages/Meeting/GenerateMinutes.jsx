// GenerateMinutes.jsx
import { Navigate, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Select from 'react-select';
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import Meeting from "./Meeting";
import { NavLink } from "react-router-dom";
import PDFViewerPage from "./FirstPDFViewerPage";

const GenerateMinutes = () => {
  const navigate = useNavigate();
  const [selectedAttendees, setSelectedAttendees] = useState([]);
  const [agendaItems, setAgendaItems] = useState([]);
  const [showAddMoreButton, setShowAddMoreButton] = useState(false);
  const [meetingId, setMeetingId] = useState("");

  const attendeesOptions = [
    { value: "teachers", label: "Teachers" },
    { value: "students", label: "Students" },
    { value: "staffs", label: "Staffs" },
  ];

  const [agendaTitle, setAgendaTitle] = useState("");

  const handleAddDecision = () => {
    setAgendaItems([...agendaItems, { topic: "", decision: "" }]);
  };

  const handleDecisionChange = (index, field, value) => {
    const newAgendaItems = [...agendaItems];
    newAgendaItems[index][field] = value;
    setAgendaItems(newAgendaItems);

    if (index === 0 && value.trim() !== "" && !showAddMoreButton) {
      setShowAddMoreButton(true);
    }
  };

  const fetchMeetingDetails = async (id) => {
    const response = await fetch(`http://bike-csecu.com:5000/api/meeting/agenda/${id}`);
    const data = await response.json();
    setAgendaItems(data.map((item) => ({
      topic: item.topic,
      decision: item.decision,
    })));
  };

  const handleMeetingIdChange = (e) => {
    const id = e.target.value;
    setMeetingId(id);
    if (id) {
      fetchMeetingDetails(id);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your form submission logic here
  };

  const handleGenerateMinutes = async () => {
    // try {
    //   await Promise.all(
    //     agendaItems.map((item) =>
    //       fetch(`http://bike-csecu.com:5000/api/meeting/agenda/${meetingId}`, {
    //         method: "PUT",
    //         headers: {
    //           "Content-Type": "application/json",
    //         },
    //         body: JSON.stringify({
    //           decision: item.decision,
    //         }),
    //       })
    //     )
    //   );
      // Navigate to the PDF viewer page
      navigate(`/main/sendminutes/${meetingId}`);
    // } catch (error) {
    //   console.error("Error updating agenda:", error);
    // }
  };

  return (
    <>
      <div className="flex">
        <Meeting />
        <div className="flex flex-col w-full">
          <div className="w-full p-8 h-full shadow-md">
            <p className="text-center text-black text-2xl font-bold mb-8 font-bangla">
              Generate Minutes
            </p>
            <form
              onSubmit={handleSubmit}
              className="flex flex-col items-center justify-center"
            >
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="meetingId">Meeting Id</Label>
                <Input
                  type="number"
                  id="meetingId"
                  placeholder="number"
                  value={meetingId}
                  onChange={handleMeetingIdChange}
                />
              </div>

              <div className="grid w-full max-w-sm items-center gap-1.5 mt-4"></div>
              <div className="grid w-full max-w-sm items-center gap-1.5 mt-4">
                {agendaItems.map((item, index) => (
                  <div key={index} className="mb-2">
                    <p className="mb-2">Agenda {`${index + 1}`}</p>
                    <Input
                      type="text"
                      placeholder={`Topic ${index + 1}`}
                      value={item.topic}
                      onChange={(e) =>
                        handleDecisionChange(index, "topic", e.target.value)
                      }
                      className="mb-2"
                    />
                    <p className="mb-2">Decisions {`${index + 1}`}</p>
                    <Textarea
                      placeholder={`Decision ${index + 1}`}
                      value={item.decision}
                      onChange={(e) =>
                        handleDecisionChange(index, "decision", e.target.value)
                      }
                      className="mb-2"
                    />
                  </div>
                ))}
                {showAddMoreButton && (
                  <Button
                    type="button"
                    onClick={handleAddDecision}
                    className="mt-2"
                  >
                    Add More
                  </Button>
                )}
              </div>
              <div>
                {/* <NavLink
                  to={`/main/sendminutes/${meetingId}`}
                  type="button"
                  className="mt-4 mr-4 bg-slate-700 text-white p-2"
                >
                  Send Minutes
                </NavLink> */}
                <Button
                  type="button"
                  onClick={handleGenerateMinutes}
                  className="mt-4 mr-4 bg-slate-700 text-white p-2"
                >
                  Generate Minutes
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default GenerateMinutes;
