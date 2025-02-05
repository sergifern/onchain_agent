import Image from "next/image";
import { useSidebar } from "@/components/ui/sidebar";
import { SidebarMenuItem } from "@/components/ui/sidebar";

const SidebarLogo = () => {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <SidebarMenuItem className="py-4">
      <div className="flex flex-row items-center">
        <div className="flex">
          {isCollapsed ?
          <Image 
            width={35} 
            height={35} 
            src="/img/ethy-icon.png"
            alt="Logo" 
          /> :
          <Image 
            width={170} 
            height={100} 
            className={`transition-opacity duration-300 opacity-100`}
            src="/img/ethy-logo-trans.png" 
            alt="Logo" 
          />}
        </div>
      </div>
    </SidebarMenuItem>
  );
}

export default SidebarLogo;
