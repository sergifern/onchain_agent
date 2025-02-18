import Image from "next/image";
import { useSidebar } from "@/components/ui/sidebar";
import { SidebarMenuItem } from "@/components/ui/sidebar";

const SidebarLogo = () => {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <SidebarMenuItem className="">
      <div className="flex flex-row items-center">
        <div className="flex">
          {isCollapsed ?
          <Image 
            width={35} 
            height={35} 
            src="/img/ethy-icon.png"
            alt="Logo" 
            className="mt-2"
          /> :
          <Image 
            width={125} 
            height={100} 
            className={`transition-opacity duration-300 opacity-100 mt-1`}
            src="/img/ethy-logo-white.png" 
            alt="Logo" 
          />}
        </div>
      </div>
    </SidebarMenuItem>
  );
}

export default SidebarLogo;
