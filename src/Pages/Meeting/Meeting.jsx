import { FileText, SquarePen, User } from "lucide-react";
import { NavLink } from "react-router-dom";
import {  useLocation } from "react-router-dom";


const Meeting = () => {
    const location = useLocation();
    return (
        <aside className=" bg-gray-200 w-70 col-span-2 h-screen sticky top-0 left-0 overflow-auto p-4 lg:p-5">
            <p className="text-2xl font-extrabold mb-5">Meeting Management</p>
            <nav className="flex flex-col">
            <NavLink
    to='/' 
    className={({ isActive }) => 
        `p-3 gap-2 rounded-md hover:bg-slate-400 hover:text-white transition-all flex items-center mb-3 ${
            isActive || location.pathname === '/' ? 'bg-slate-400 text-white' : 'bg-gray'
        }`
    }
    end
>
    <SquarePen className="shrink-0"></SquarePen>
    <span>Call A Meeting</span>
</NavLink>
<NavLink 
    to='/generateminutes' 
    className={({ isActive }) => 
        `p-3 rounded-md gap-2 hover:bg-slate-400 hover:text-white transition-all flex items-center mb-3 ${
            isActive ? 'bg-slate-400 text-white' : 'bg-gray'
        }`
    }
>
    <FileText ></FileText>
    <span>Generate Minutes</span>
</NavLink>

<NavLink 
    to='/profile' 
    className={({ isActive }) => 
        `p-3 rounded-md gap-2 hover:bg-slate-400 hover:text-white transition-all flex items-center ${
            isActive ? 'bg-slate-400 text-white' : 'bg-gray'
        }`
    }
>
    <User className="shrink-0"></User>
    <span>Meeting Profile</span>
</NavLink>

            </nav>
        </aside>
    );
};

export default Meeting;