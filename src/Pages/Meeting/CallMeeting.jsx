import { useState } from 'react';
import DateTimePicker from 'react-datetime-picker';
import Select from 'react-select';
import 'react-datetime-picker/dist/DateTimePicker.css';
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';
import 'react-select';

const CallMeeting = () => {
    
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedAttendees, setSelectedAttendees] = useState([]);

    const attendeesOptions = [
        { value: 'teachers', label: 'Teachers' },
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
                <p className="text-center text-black font-inter text-2xl font-bold mb-8">Call a Meeting</p>
                <form onSubmit={handleSubmit}>
                    <label className="form-control">
                        <div className="label">
                            <span className="label-text text-black">Meeting Id</span>
                        </div>
                        <input
                            type="number"
                            placeholder="Type here"
                            className="input text-black input-bordered w-full bg-white"
                           
                        />
                    </label>
                    <label className="form-control mt-4">
                        <div className="label">
                            <span className="label-text text-black">Meeting Type</span>
                        </div>
                        <input
                            type="text"
                            placeholder="Type here"
                            className="input text-black input-bordered w-full bg-white"
                           
                        />
                    </label>

                    <div className="mt-4 mb-4">
                        <label className="form-control">
                            <div className="label">
                                <span className="label-text text-black">Date and Time</span>
                            </div>
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
                        </label>
                    </div>
                    <label className="form-control">
                        <div className="label">
                            <span className="label-text text-black">Meeting Agenda</span>
                        </div>
                        <textarea className="textarea textarea-bordered text-black h-24 bg-white" placeholder="Subject"></textarea>
                    </label>
                    <label className="form-control mt-4">
                        <div className="label">
                            <span className="label-text text-black">Room Name</span>
                        </div>
                        <input
                            type="text"
                            placeholder="Type here"
                            className="input text-black input-bordered w-full bg-white"
                           
                        />
                    </label>
                    <label className="form-control w-full max-w-xs mt-4">
                        <div className="label">
                            <span className="label-text text-black">Attach Signature</span>
                        </div>
                        <input type="file" className="file-input file-input-bordered w-full max-w-xs bg-white" />
                    </label>
                    <div className="label mt-4">
                        <span className="label-text text-black">Who can attend?</span>
                    </div>
                    <Select
                        isMulti
                        options={attendeesOptions}
                        value={selectedAttendees}
                        onChange={(selectedOptions) => setSelectedAttendees(selectedOptions)}
                        placeholder="Select attendees"
                    />
                    {/* The button to open modal */}
                    <label htmlFor="my_modal_7" className="btn mt-4 text-white">Invite Via Email</label>

                    {/* Put this part before </body> tag */}
                    <input type="checkbox" id="my_modal_7" className="modal-toggle" />
                    <div className="modal" role="dialog">
                        <div className="modal-box">
                            {/* Add your modal content here */}
                        </div>
                        <label className="modal-backdrop" htmlFor="my_modal_7">Close</label>
                    </div>
                    <div className='grid grid-cols-2 gap-10 mt-10'>
                        <button className="btn btn-primary">Create Meeting</button>
                        <button className="btn btn-outline btn-error">Preview</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CallMeeting;
