import Topbar from "@/components/Topbar";

export default function Layout({ children }: { children: React.ReactNode }) {

    return (
        <div className="h-dvh flex flex-col bg-mine-shaft-900">
            <Topbar />
            <div className="overflow-hidden border-6 border-mine-shaft-900 rounded-xl flex-1 bg-white">
                {children}
            </div>
        </div>
    );
}