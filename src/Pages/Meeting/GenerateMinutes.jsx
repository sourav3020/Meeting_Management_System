import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Select from 'react-select';
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";

const GenerateMinutes = () => {
    const [selectedAttendees, setSelectedAttendees] = useState([]);
    const attendeesOptions = [
        { value: 'teachers', label: 'Teachers' },
        { value: 'students', label: 'Students' },
        { value: 'staffs', label: 'Staffs' },
    ];

    const [agendaTitle, setAgendaTitle] = useState('');
    const [agendaDescription, setAgendaDescription] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // Add your form submission logic here
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-white">
             <div className="w-full max-w-screen-lg p-8 bg-gray-100 shadow-md">
            <p className="text-center text-black  text-2xl font-bold mb-8 font-bangla">Generate Minutes</p>
            <form onSubmit={handleSubmit} className="flex flex-col items-center justify-center">

            <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="number">Meeting Id</Label>
                <Input type="number" id="meetingId" placeholder="number" />
            </div>

            <div className="grid w-full max-w-sm items-center gap-1.5 mt-4">
                <Label htmlFor="text">Send to</Label>
                <Select
                    isMulti
                    options={attendeesOptions}
                    value={selectedAttendees}
                    onChange={(selectedOptions) => setSelectedAttendees(selectedOptions)}
                    placeholder="Select attendees"
                />
            </div>

            <div className="grid w-full max-w-sm items-center gap-1.5 mt-4">
                <Label htmlFor="agendaTitle">Agenda Title</Label>
                <Input
                    type="text"
                    id="agendaTitle"
                    placeholder="Title"
                    value={agendaTitle}
                    onChange={(e) => setAgendaTitle(e.target.value)}
                />
            </div>

            <div className="grid w-full max-w-sm items-center gap-1.5 mt-4">
                <Label htmlFor="agendaDescription">Decision</Label>
               <Textarea
                    placeholder="Decision"
                    id="agendaDecision"
                    value={agendaDescription}
                    onChange={(e) => setAgendaDescription(e.target.value)}
                />
            </div>

            <Button className='mt-4'>Generate Minutes</Button>
            </form>
            </div>
   

        </div>
    );
};

export default GenerateMinutes;
