import { Bell } from "lucide-react";
import MeetingList from "../Meeting/MeetingList";
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



const Profile = () => {
    return (
        <div>
            <div className="flex items-center p-4">
                {/* Profile Image */}
                <div className="rounded-full overflow-hidden border-2 border-blue-500 w-20 h-20">
                    <img
                        src="https://images.unsplash.com/photo-1573496799652-408c2ac9fe98?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                        alt="Teacher Profile"
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Profile Info */}
                <div className="ml-4">
                    <h2 className="text-2xl font-bold">Teacher Name</h2>
                    <p>teachername@gmail.com</p>
                    <p className="text-gray-500">Department Of Computer Science and Engineering</p>
                    <p className="text-gray-500">Professor</p>

                </div>

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
    );
};

export default Profile;