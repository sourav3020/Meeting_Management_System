import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Select from 'react-select';
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import Meeting from "./Meeting";
import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer';
import SecondPDFFile from "./PDF/SecondPDFFile";
import axios from "axios";

const base_url = import.meta.env.VITE_API_URL;

const GenerateMinutes = () => {
  const navigate = useNavigate();
  const [selectedAttendees, setSelectedAttendees] = useState([]);
  const [agendaItems, setAgendaItems] = useState([]);
  const [showAddMoreButton, setShowAddMoreButton] = useState(false);
  const [meetingId, setMeetingId] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const attendeesOptions = [
    { value: "teachers", label: "Teachers" },
    { value: "students", label: "Students" },
    { value: "staffs", label: "Staffs" },
  ];

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
    const response = await fetch(`${base_url}/api/meeting/agenda/${id}`);
    const data = await response.json();
    setAgendaItems(data.map((item) => ({
      topic: item.description,
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

  const handleGenerateMinutes = async () => {
    const decisions = agendaItems.map(item => item.decision);

    try {
      const response = await fetch(`${base_url}/api/meeting/save-decisions/${meetingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ decisions }),
      });

      if (response.ok) {
        // Navigate to the PDF viewer page
        navigate(`/main/sendminutes/${meetingId}`);
      } else {
        const errorData = await response.json();
        setErrorMessage(`Failed to save decisions: ${errorData.message}`);
      }
    } catch (error) {
      setErrorMessage(`Error saving decisions: ${error.message}`);
    }
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
            <form className="flex flex-col items-center justify-center">
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="meetingId">Meeting Id</Label>
                <Input
                  type="text"
                  id="meetingId"
                  placeholder="number"
                  value={meetingId}
                  onChange={handleMeetingIdChange}
                />
              </div>

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
                {/* {showAddMoreButton && (
                  <Button
                    type="button"
                    onClick={handleAddDecision}
                    className="mt-2"
                  >
                    Add More
                  </Button>
                )} */}
              </div>
              <div>
                <Button
                  type="button"
                  onClick={handleGenerateMinutes}
                  className="mt-4 mr-4 bg-slate-700 text-white p-2"
                >
                  Generate Minutes
                </Button>
              </div>
            </form>
            {errorMessage && (
              <p className="text-red-500 mt-4">{errorMessage}</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default GenerateMinutes;
