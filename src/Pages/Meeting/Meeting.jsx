import { FileText,SquarePen, User } from "lucide-react";
import { NavLink } from "react-router-dom";


const Meeting = () => {
    return (
       <aside className=" bg-gray-200 w-52 col-span-2 h-screen sticky top-0 left-0 overflow-auto p-4 lg:p-5">
        <p className="text-2xl font-extrabold mb-5">Meeting Management</p>
        <nav className="flex flex-col">
            <NavLink to='/callmeeting' className='p-3 gap-2 bg-gray rounded-md hover:bg-slate-400 hover:text-white transition-all flex items-center' >
                
                <SquarePen className="shrink-0"></SquarePen>
                <span>Call A Meeting</span>

            </NavLink>
            <NavLink to='/generateminutes' className='p-3 bg-gray rounded-md gap-2 hover:bg-slate-400 hover:text-white transition-all flex items-center' >
            
                <FileText ></FileText>
                <span>Gernerate Minutes</span>

            </NavLink>
            <NavLink to='/profile' className='p-3 bg-gray rounded-md gap-2 hover:bg-slate-400 hover:text-white transition-all flex items-center' >
                <User className="shrink-0"></User>
                <span>Meeting Profile</span>

            </NavLink>

        </nav>
       </aside>
    );
};

export default Meeting;