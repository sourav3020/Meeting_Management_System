import { Button } from "@/components/ui/button";
import DatePicker from "react-datepicker";
import { Calendar } from "lucide-react";
import "react-datepicker/dist/react-datepicker.css";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BeatLoader, BounceLoader } from "react-spinners";

const base_url = import.meta.env.VITE_API_URL;

const MeetingList = () => {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState(""); // For the input field
  const [filteredQuery, setFilteredQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
 
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMeetings = async () => {
      try {

        var token= localStorage.getItem("authToken") ;
        //console.log(token);
        const userResponse = await axios.get(`${base_url}/api/myInfo`, {
          headers: {
            Authorization: `Bearer ${token}`, 
          },
        });
        //console.log("User Response:", userResponse.data); 
      
        const user_id = userResponse.data?.user?.user_id; 

        const response = await axios.get(`${base_url}/api/meeting/user-meeting-info/${user_id}`);
        if (response.data && Array.isArray(response.data)) {
          const sortedMeetings = response.data.sort(
            (a, b) => new Date(b.meeting_time) - new Date(a.meeting_time)
          );
          setMeetings(sortedMeetings);
          setLoading(false);
        } else {
          console.error("Invalid data structure returned:", response.data);
          setError(new Error("Invalid data structure returned"));
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching meetings:", error);
        setError(error);
        setLoading(false);
      }
    };

    fetchMeetings();
  }, []);

  const handleSearch = () => {
    // Update filteredQuery when search is clicked
    setFilteredQuery(searchQuery);
  };

  // Filter meetings by search query and selected date
  const filteredMeetings = meetings.filter((meeting) => {
    const meetingId = String(meeting.meeting_id).toLowerCase();
    const meetingType = meeting.meeting_type.toLowerCase();
    const query = filteredQuery.toLowerCase(); // Normalize the filtered query to lowercase

    const matchesQuery =
      meetingId.includes(query) || meetingType.includes(query);

    // Filter by selected date if one is chosen
    const meetingDate = new Date(meeting.meeting_time).setHours(0, 0, 0, 0);
    const selectedMeetingDate = selectedDate
      ? selectedDate.setHours(0, 0, 0, 0)
      : null;

    const matchesDate =
      !selectedMeetingDate || meetingDate === selectedMeetingDate;

    return matchesQuery && matchesDate;
  });

  if (loading) {
    return <div className="flex items-center justify-center h-screen"><BeatLoader
    color="#354992"  size={50}/></div>;
  }

  if (error) {
    return <p>Error fetching meetings: {error.message}</p>;
  }

  if (meetings.length === 0) {
    return <p>No meetings found.</p>;
  }

  const openSecondPDFViewer = (meetingId) => {
    window.open(`/main/secondpdf-viewer/${meetingId}`);
  };

  return (
    <div className="p-6">
      <p className="text-center text-black text-2xl font-bold mb-8">
        Meeting Information
      </p>
      <div className="mb-4 flex justify-between">
        {" "}
        {/* DatePicker for selecting a specific meeting date */}
        <div className="flex items-center space-x-2">
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            placeholderText="Select a Date"
            className="border p-2"
          />
          <Calendar className=" text-blue-900" />
        </div>{" "}
        <div>
          <input
            type="text"
            placeholder="Search by ID or Type"
            value={searchQuery} // Single input for both ID and type
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border p-2"
          />
          <Button onClick={handleSearch} className="ml-2">
            Search
          </Button>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Meeting Id</TableHead>
            <TableHead>Meeting Type</TableHead>
            <TableHead>Meeting Held On</TableHead>
            <TableHead className="text-right">Meeting Minutes</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredMeetings.map((meeting) => (
            <TableRow key={meeting.meeting_id}>
              <TableCell>{meeting.meeting_id}</TableCell>
              <TableCell>{meeting.meeting_type}</TableCell>
              <TableCell>{formatDate(meeting.meeting_time)}</TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end">
                  <Button
                    onClick={() => openSecondPDFViewer(meeting.meeting_id)}
                  >
                    View PDF
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

// Helper function to format date
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export default MeetingList;
