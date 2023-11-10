import { Navbar } from "./_components/navbar";
import { Footer } from "./_components/footer";

const MainLayout = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    return ( 
        <div className=" dark:bg-[#191919]">
            <Navbar />
            <main className="flex-1 min-h-screen overflow-y-auto pt-24">
                {children}
            </main>
            <Footer />
        </div>
     );
}
 
export default MainLayout;