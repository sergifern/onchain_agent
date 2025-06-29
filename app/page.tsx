import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";


export default function Home() {

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <Image src="/img/ethy-icon.png" alt="Ethy AI" width={100} height={100} />
      <h1 className="text-3xl font-bold mt-4">Welcome to Ethy AI</h1>
      <p className="text-muted-foreground text-xl mt-2">Your Personal Onchain Agent</p>
      <Link className="mt-6" href="/terminal">
        <Button variant="outline" className="border border-violeta text-violeta bg-transparent hover:bg-violeta/50">Access Terminal</Button>
      </Link>
    </div>
  );
}
