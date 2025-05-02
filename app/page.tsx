import { Button } from "@/components/ui/button";
import Link from "next/link";



export default function Home() {

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <Link className="" href="/terminal">
        <Button>Access Terminal</Button>
      </Link>
    </div>
  );
}
