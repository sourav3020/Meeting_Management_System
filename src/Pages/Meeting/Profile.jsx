import { Bell } from "lucide-react";
import MeetingList from "./MeetingList";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"
import { Button } from "@/components/ui/button";
import Meeting from "./Meeting";



const Profile = () => {
    return (
        <div className="flex">
            <Meeting></Meeting>

        <div className="w-full">
            <div className="flex items-center  p-4">
                {/* Profile Image */}
            
                {/* Notification Bell */}
                <div className="ml-auto mr-5">
                    
                    <Drawer>
                        <DrawerTrigger><Bell></Bell></DrawerTrigger>
                        <DrawerContent>
                            <DrawerHeader>
                                <DrawerTitle>Your Upcoming Meeting</DrawerTitle>
                                <DrawerDescription>Meeting Type</DrawerDescription>
                            </DrawerHeader>
                            <DrawerFooter>
    
                                <DrawerClose>
                                    <Button variant="outline">Cancel</Button>
                                </DrawerClose>
                            </DrawerFooter>
                        </DrawerContent>
                    </Drawer>

                </div>
            </div>



            <MeetingList></MeetingList>
        </div>

        </div>
    );
};

export default Profile;