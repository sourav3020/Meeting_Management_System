import React from 'react';
import { Label } from "@/components/ui/label";
import Select from "react-select";

const SelectedField2 = ({ id, label, options, isMulti, value, onChange }) => {
  return (
    <div className="grid w-full max-w-sm items-center gap-1.5 mt-4">
      <Label htmlFor={id}>{label}</Label>
      <Select
        menuPlacement="top"
        id={id}
        options={options}
        isMulti={isMulti}
        value={value}
        onChange={onChange}
        className="font-bangla"
      />
    </div>
  );
};

export default SelectedField2;
