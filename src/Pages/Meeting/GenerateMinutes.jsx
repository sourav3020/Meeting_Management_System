import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Select from 'react-select';
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import Meeting from "./Meeting";





const GenerateMinutes = () => {
    const [selectedAttendees, setSelectedAttendees] = useState([]);
    const [decisionItems, setDecisionItems] = useState(['']);
    const [showAddMoreButton, setShowAddMoreButton] = useState(false);
    const attendeesOptions = [
        { value: 'teachers', label: 'Teachers' },
        { value: 'students', label: 'Students' },
        { value: 'staffs', label: 'Staffs' },
    ];

    const [agendaTitle, setAgendaTitle] = useState('');
    

    const handleAddDecision = () => {
        setDecisionItems([...decisionItems, '']);
    };

    const handleDecisionChange = (index, value) => {
        const newDecisionItems = [...decisionItems];
        newDecisionItems[index] = value;
        setDecisionItems(newDecisionItems);

        if (index === 0 && value.trim() !== '' && !showAddMoreButton) {
            setShowAddMoreButton(true);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Add your form submission logic here
    };

    return (
        <>
        <div className="flex">
            <Meeting></Meeting>
        <div className="flex flex-col  w-full">
             <div className="w-full  p-8 h-full shadow-md">
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
                <Label htmlFor="decisions">Decisions</Label>
                {decisionItems.map((item, index) => (
                    <Textarea
                        key={index}
                        placeholder={`Decision ${index + 1}`}
                        value={item}
                        onChange={(e) => handleDecisionChange(index, e.target.value)}
                        className="mb-2"
                    />
                ))}
           {showAddMoreButton && (
                <Button type="button" onClick={handleAddDecision} className="mt-2">
                    Add More 
                </Button>
            )}
        
            </div>

            <Button className='mt-4'>Generate Minutes</Button>
            </form>
            </div>
        
   

        </div>
        </div>
        </>
    );
};

export default GenerateMinutes;
