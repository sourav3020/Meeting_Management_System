
import { Link } from 'react-router-dom';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Button } from '@/components/ui/button';

const Header = () => {
  return (
    <header className="flex items-center md:flex-row justify-between bg-gray-800 p-4">
      {/* Left side: Project name */}
      <span className="text-white text-lg font-bold md:mb-0">Meeting Management</span>

      {/* Middle: Navigation menu */}
      <NavigationMenu>
        <NavigationMenuList>
          {/* Home */}
          <NavigationMenuItem className="md:flex">
            <Link to="/" className="block px-4 py-2  text-sm text-gray-300 hover:bg-gray-700">
              Home
            </Link>
          </NavigationMenuItem>

          {/* Meeting */}
          <NavigationMenuItem className="md:flex">
            <Link to="/meeting" className="block px-4 py-2  text-sm text-gray-300 hover:bg-gray-700">
              Meeting
            </Link>
          </NavigationMenuItem>

          {/* Profile */}
          <NavigationMenuItem>
            <Link to="/profile" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700">
              Profile
            </Link>
          </NavigationMenuItem>
          
          {/* Add more menu items as needed */}
        </NavigationMenuList>
      </NavigationMenu>

      {/* Right side: Notification icon and Logout button */}
      <div className="flex items-center gap-5">
        {/* Notification icon (replace with your icon component) */}
         <span className="text-white ml-4">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M10.3 21C10.4674 21.3044 10.7135 21.5583 11.0125 21.7352C11.3116 21.912 11.6526 22.0053 12 22.0053C12.3475 22.0053 12.6885 21.912 12.9876 21.7352C13.2866 21.5583 13.5327 21.3044 13.7 21M6 8C6 6.4087 6.63214 4.88258 7.75736 3.75736C8.88258 2.63214 10.4087 2 12 2C13.5913 2 15.1174 2.63214 16.2426 3.75736C17.3679 4.88258 18 6.4087 18 8C18 15 21 17 21 17H3C3 17 6 15 6 8Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>

        {/* Logout button (replace with your logout button component) */}
        <Button><Link to="/logout">
          Logout
        </Link></Button>
      </div>
    </header>
  );
};

export default Header;
