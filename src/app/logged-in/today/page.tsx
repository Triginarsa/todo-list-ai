import Today from "@/components/containers/today";
import MobileNavbar from "@/components/nav/mobile-navbar";
import Sidebar from "@/components/nav/sidebar";

export default function TodayPage() {
  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <Sidebar />
      <div className="flex flex-col">
        <MobileNavbar />
        <main className="flex flex-1 flex-col gap-4 p-4 lg:px-8">
          <Today />
        </main>
      </div>
    </div>
  );
}
