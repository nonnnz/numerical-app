import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Heading } from "./_components/heading";
import { Heroes } from "./_components/heroes";
import { Footer } from "./_components/footer";

const HomePage = () => {
  return ( 
    <div className="h-full mt-[30vh] flex flex-col">
      <div className="flex flex-col h-full items-center justify-center md:justify-start text-center gap-y-8 flex-1 px-6 pb-10">
        <Heading />
      </div>
    </div>
   );
}
 
export default HomePage;
