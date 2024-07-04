import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import * as fontkit from "fontkit";
import fileDownload from "js-file-download";
import { PDFDocument, rgb } from "pdf-lib";
import { useEffect, useState } from "react";
import "react-calendar/dist/Calendar.css";
import "react-clock/dist/Clock.css";
import DateTimePicker from "react-datetime-picker";
import "react-datetime-picker/dist/DateTimePicker.css";
import Select from "react-select";
import Meeting from "./Meeting";

const CallMeeting = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedAttendees, setSelectedAttendees] = useState([]);
  const [selectedEmails, setSelectedEmails] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [emailsOptions, setEmailsOptions] = useState([]);
  const [meetingId, setMeetingId] = useState("");
  const [meetingType, setMeetingType] = useState("");
  const [agenda, setAgenda] = useState("");
  const [roomName, setRoomName] = useState("");
  const [signature, setSignature] = useState(null);

  const attendeesOptions = [
    { value: "teachers", label: "Teachers" },
    { value: "students", label: "Students" },
    { value: "staffs", label: "Staffs" },
  ];

  const [agendaItems, setAgendaItems] = useState([""]);
  const [showAddMoreButton, setShowAddMoreButton] = useState(false);

  useEffect(() => {
    const fetchEmails = async () => {
      try {
        const response = await axios.get(
          "http://bike-csecu.com:5000/api/teacher"
        );
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

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your form submission logic here
  };

  const handlePreview = async () => {
    try {
      // Fetch the PDF template
      const pdfBytes = await fetch("/public/firstPdf.pdf").then((res) =>
        res.arrayBuffer()
      );

      // Load the PDF template
      const pdfDoc = await PDFDocument.load(pdfBytes);

      // Register fontkit
      pdfDoc.registerFontkit(fontkit);

      // Embed the custom font
      const fontBytes = await fetch("/public/NotoSansBengali-Regular.ttf").then(
        (res) => res.arrayBuffer()
      );
      const customFont = await pdfDoc.embedFont(fontBytes);

      const pages = pdfDoc.getPages();
      const firstPage = pages[0];

      // Draw text on the first page using the custom font
      firstPage.drawText(meetingId, {
        x: 353,
        y: 706,
        size: 9,
        font: customFont,
        color: rgb(0, 0, 0),
      });

      // Save the modified PDF
      const pdfBytesModified = await pdfDoc.save();

      // Download the modified PDF
      const blob = new Blob([pdfBytesModified], { type: "application/pdf" });
      fileDownload(blob, "modifiedPdf.pdf");
    } catch (error) {
      console.error("Error generating preview:", error);
    }
  };

  return (
    <div className="flex ">
      <Meeting />
      <div className=" w-full ">
        <div className="w-full   p-8   shadow-md">
          <p className="text-center text-black text-2xl font-bold mb-8 font-bangla">
            Call A Meeting
          </p>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col items-center justify-center"
          >
            <div className="grid w-full max-w-sm items-center gap-1.5 font-bangla">
              <Label htmlFor="number">Meeting Id</Label>
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
              <Label htmlFor="text">Meeting Type</Label>
              <Input
                type="text"
                id="meetingType"
                placeholder="text"
                value={meetingType}
                onChange={(e) => setMeetingType(e.target.value)}
                className="font-bangla"
              />
            </div>
            <div className="grid w-full max-w-sm items-center gap-1.5 mt-4 ">
              <Label>Date and Time</Label>
              <DateTimePicker
                onChange={setSelectedDate}
                value={selectedDate}
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  border: "1px solid",
                  borderRadius: "4px",
                  boxSizing: "border-box",
                }}
              />
            </div>

            <div className="grid w-full max-w-sm items-center gap-1.5 mt-4">
              <Label htmlFor="message">Agenda</Label>
              {agendaItems.map((item, index) => (
                <Textarea
                  key={index}
                  placeholder={`Agenda ${index + 1}`}
                  value={item}
                  onChange={(e) => handleAgendaChange(index, e.target.value)}
                  className="mb-2"
                />
              ))}
              {showAddMoreButton && (
                <Button
                  type="button"
                  onClick={handleAddAgenda}
                  className="mt-2"
                >
                  Add More
                </Button>
              )}
            </div>

            <div className="grid w-full max-w-sm items-center gap-1.5 mt-4">
              <Label htmlFor="text">Room Name</Label>
              <Input
                type="text"
                id="roomName"
                placeholder="name"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                className="font-bangla"
              />
            </div>
            <div className="grid w-full max-w-sm items-center gap-1.5 mt-4">
              <Label htmlFor="picture">Signature</Label>
              <Input
                id="signature"
                type="file"
                onChange={(e) => setSignature(e.target.files[0])}
              />
            </div>
            <div className="grid w-full max-w-sm items-center gap-1.5 mt-4">
              <Label htmlFor="text">Who can attend?</Label>
              <Select
                isMulti
                options={attendeesOptions}
                value={selectedAttendees}
                onChange={(selectedOptions) =>
                  setSelectedAttendees(selectedOptions)
                }
                placeholder="Select attendees"
              />
            </div>
            <div className="grid w-full max-w-sm items-center gap-1.5 mt-4">
              <Label htmlFor="text">Send Email Invitation</Label>
              <Select
                isMulti
                options={emailsOptions}
                value={selectedEmails}
                onChange={(selectedOptions) =>
                  setSelectedEmails(selectedOptions)
                }
                placeholder="Select emails"
              />
            </div>
            <div className="grid w-full max-w-sm items-center gap-1.5 mt-4">
              <Label htmlFor="search">Search User</Label>
              <Select
                isMulti
                inputValue={searchQuery}
                onInputChange={(value) => setSearchQuery(value)}
                options={searchResults.map((user) => ({
                  value: user.email,
                  label: `${user.first_name} ${user.last_name} - ${user.email}`,
                }))}
                value={selectedUsers}
                onChange={handleUserSelect}
                placeholder="Search by email or name"
              />
            </div>
            <div className="grid grid-cols-2 gap-5 mt-10">
              <Button type="submit" className="font-bangla">
                Create Meeting
              </Button>
              <Button
                type="button"
                style={{
                  padding: "0.375rem 0.75rem",
                  fontSize: "0.875rem",
                  lineHeight: "1.25rem",
                  borderRadius: "0.375rem",
                  minHeight: "2.25rem",
                  // marginTop: "6px",
                  border: "1px solid var(--color-border, #E4E4E7)",
                  background: "var(--color-bg, #FFF)",
                  boxShadow: "0px 1px 2px 0px rgba(16, 24, 40, 0.05)",
                  color: "var(--color-text-error, #DC2626)",
                }}
                onClick={handlePreview}
                className="font-bangla"
              >
                Preview
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
export default CallMeeting;
