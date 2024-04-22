

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";


const Header = () => {
  return (
    <header className="flex items-center md:flex-row justify-between bg-gray-800 p-4">
      {/* Left side: Project name */}
  

      {/* Middle: Navigation menu */}
      <NavigationMenu>
        <NavigationMenuList>
          {/* Home */}

          {/* Meeting */}
          <NavigationMenuItem className="md:flex">
            <p className="text-white">A Navbar from web portal</p>
            
          </NavigationMenuItem>

        
          
          {/* Add more menu items as needed */}
        </NavigationMenuList>
      </NavigationMenu>

  
    
    </header>
  );
};

export default Header;
