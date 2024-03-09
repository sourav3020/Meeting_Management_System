import { Button } from "@/components/ui/button";
import {
    Table,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"


const MeetingList = () => {
    return (
        <div>
               <p className="text-3xl font-bold text-center mt-4">Meeting List</p>

            <Table>
                
                <TableHeader>
                    <TableRow>
                        <TableHead>Meeting Id</TableHead>
                        <TableHead>Meeting Type</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Time</TableHead>
                        <Button>Cancel</Button>

                    </TableRow>
                </TableHeader>
              
            </Table>

        </div>
    );
};

export default MeetingList;