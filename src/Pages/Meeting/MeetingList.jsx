import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"


const MeetingList = () => {
    return (
        <div className="p-6 ">
             <p className="text-center text-black  text-2xl font-bold mb-8">Meeting List</p>

            <Table>

                <TableHeader>
                    <TableRow>
                        <TableHead>Meeting Id</TableHead>
                        <TableHead>Meeting Type</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Time</TableHead>
                        <TableHead className="text-right">Cancel Meeting</TableHead>

                    </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow>
                        <TableCell className="font-medium">845</TableCell>
                        <TableCell>Academic</TableCell>
                        <TableCell>24/3/2</TableCell>
                        <TableCell>9:00 am</TableCell>
                        <TableCell className="text-right"><Button>Cancel</Button></TableCell>
                    </TableRow>
                </TableBody>

            </Table>

        </div>
    );
};

export default MeetingList;