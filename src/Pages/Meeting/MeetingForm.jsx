// src/MeetingForm.js
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import DateTimePickerField from './DateTimePicker';
import SelectField from './SelectedField';

const base_url=import.meta.env.VITE_API_URL ;

const MeetingForm = ({ handleSubmit }) => {
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

  useEffect(() => {
    const fetchEmails = async (attendeeTypes) => {
      try {
        const emailResults = await Promise.all(
          attendeeTypes.map(type => axios.get(`${base_url}/api/${type}`))
        );

        const emails = emailResults.flatMap(response =>
          response.data.data.map(attendee => ({
            value: attendee.email,
            label: `${attendee.first_name_bn} ${attendee.last_name_bn} - ${attendee.email}`,
          }))
        );

        setEmailsOptions(emails);
      } catch (error) {
        console.error("Error fetching emails:", error);
      }
    };

    if (selectedAttendees.length > 0) {
      fetchEmails(selectedAttendees.map(attendee => attendee.value));
    } else {
      setEmailsOptions([]);
    }
  }, [selectedAttendees]);


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

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const formData = {
      meetingId,
      meetingType,
      selectedDate,
      agendaItems,
      roomName,
      signature,
      selectedAttendees,
      selectedUsers,
    };
    handleSubmit(formData);
  };

  return (
    <form onSubmit={handleFormSubmit} className="flex flex-col items-center justify-center">
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
      <DateTimePickerField selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
      <div className="grid w-full max-w-sm items-center gap-1.5 mt-4">
        <Label htmlFor="agenda">Agenda</Label>
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
      <Button type="submit" className="mt-8 font-bangla">Submit</Button>
    </form>
  );
};

export default MeetingForm;
