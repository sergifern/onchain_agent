import { Button } from "@/components/ui/button";
import Link from "next/link";



export default function Home() {

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h2 className="text-2xl font-bold font-funnel">Terminal opening soon</h2>
      <Link className="hidden" href="/terminal">
        <Button>Access Terminal</Button>
      </Link>
    </div>
  );
}
