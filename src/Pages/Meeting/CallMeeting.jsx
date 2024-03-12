import { useState } from 'react';
import DateTimePicker from 'react-datetime-picker';
import Select from 'react-select';
import 'react-datetime-picker/dist/DateTimePicker.css';
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';
import 'react-select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

const CallMeeting = () => {

    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedAttendees, setSelectedAttendees] = useState([]);
    const [selectedEmails, setSelectedEmails] = useState([]);

    const attendeesOptions = [
        { value: 'teachers', label: 'Teachers' },
        { value: 'students', label: 'Students' },
        { value: 'staffs', label: 'Staffs' },
    ];

    const emailsOptions = [
        { value: 'teacher', label: 'Teachers' },
        { value: 'students', label: 'Students' },
        { value: 'staffs', label: 'Staffs' },
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        // Add your form submission logic here
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-white">
            <div className="w-full max-w-screen-lg p-8 bg-gray-100 shadow-md">
                <p className="text-center text-black  text-2xl font-bold mb-8 font-bangla">Call A Meeting</p>
                <form onSubmit={handleSubmit} className="flex flex-col items-center justify-center">
                    <div className="grid w-full max-w-sm items-center gap-1.5 font-bangla ">
                        <Label htmlFor="number">Meeting Id</Label>
                        <Input type="number" id="meetingId" placeholder="number" />
                    </div>
                    <div className="grid w-full max-w-sm items-center gap-1.5 mt-4">
                        <Label htmlFor="text">Meeting Type</Label>
                        <Input type="text" id="meetingType" placeholder="text" />
                    </div>


                    <div className="grid w-full max-w-sm items-center gap-1.5 mt-4">
                        <Label>Date and Time</Label>


                        <DateTimePicker
                            onChange={setSelectedDate}
                            value={selectedDate}
                            style={{
                                width: '100%',
                                padding: '0.5rem',
                                border: '1px solid',
                                borderRadius: '4px',
                                boxSizing: 'border-box',
                            }}
                        />


                    </div>
                    <div className="grid w-full max-w-sm items-center gap-1.5 mt-4">
                        <Label htmlFor="message">Agenda</Label>
                        <Textarea placeholder="Subject" id="message" />
                    </div>
                    <div className="grid w-full max-w-sm items-center gap-1.5 mt-4">
                        <Label htmlFor="text">Room Name</Label>
                        <Input type="text" id="roomName" placeholder="name" />
                    </div>
                    <div className="grid w-full max-w-sm items-center gap-1.5 mt-4">
                        <Label htmlFor="picture">Signature</Label>
                        <Input id="signature" type="file" />
                    </div>
                    <div className="grid w-full max-w-sm items-center gap-1.5 mt-4">
                        <Label htmlFor="text">Who can attend?</Label>
                        <Select
                            isMulti
                            options={attendeesOptions}
                            value={selectedAttendees}
                            onChange={(selectedOptions) => setSelectedAttendees(selectedOptions)}
                            placeholder="Select attendees"
                        />
                    </div>
                    <div className="grid w-full max-w-sm items-center gap-1.5 mt-4">
                        <Label htmlFor="text">Send Email Invitation</Label>
                        <Select
                            isMulti
                            options={emailsOptions}
                            value={selectedEmails}
                            onChange={(selectedOptions) => setSelectedEmails(selectedOptions)}
                            placeholder="Select emails"
                        />
                    </div>
                    <div className='grid grid-cols-2 gap-5 mt-10'>
                        <Button>Create Meeting</Button>
                        <Button style={{
                            borderRadius: 'var(--Radii-radius-button, 6px)',
                            border: '1px solid var(--color-border, #E4E4E7)',
                            background: 'var(--color-bg, #FFF)',
                            boxShadow: '0px 1px 2px 0px rgba(16, 24, 40, 0.05)',
                            color: 'var(--color-text-error, #DC2626)'
                        }}>Preview</Button>

                    </div>



                </form>

            </div>
        </div>
    );
};

export default CallMeeting;
