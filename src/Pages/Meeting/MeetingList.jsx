import { Button } from "@/components/ui/button";
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

const base_url = import.meta.env.VITE_API_URL;

const MeetingList = () => {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const response = await axios.get(`${base_url}/api/meeting/meetingInfo`);
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

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error fetching meetings: {error.message}</p>;
  }

  if (meetings.length === 0) {
    return <p>No meetings found.</p>;
  }

  return (
    <div className="p-6">
      <p className="text-center text-black text-2xl font-bold mb-8">
        Meeting Information
      </p>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Meeting Id</TableHead>
            <TableHead>Meeting Type</TableHead>
            <TableHead>Meeting Held On</TableHead>
            <TableHead>Result</TableHead>
            <TableHead className="text-right">Meeting Minutes</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {meetings.map((meeting) => (
            <TableRow key={meeting.meeting_id}>
              <TableCell>{meeting.meeting_id}</TableCell>
              <TableCell>{meeting.meeting_type}</TableCell>
              <TableCell>{formatDate(meeting.meeting_time)}</TableCell>
              <TableCell>{meeting.result}</TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end">
                  {meeting.pdf_url ? (
                    <Button href={meeting.pdf_url} target="_blank">
                      View PDF
                    </Button>
                  ) : (
                    <span>No PDF available</span>
                  )}
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
