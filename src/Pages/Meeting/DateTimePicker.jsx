import React from 'react';
import { Label } from "@/components/ui/label";
import DateTimePicker from "react-datetime-picker";
import "react-calendar/dist/Calendar.css";
import "react-clock/dist/Clock.css";
import "react-datetime-picker/dist/DateTimePicker.css";

const DateTimePickerField = ({ selectedDate, setSelectedDate }) => {
  return (
    <div className="grid w-full max-w-sm items-center gap-1.5 mt-4">
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
  );
};

export default DateTimePickerField;
