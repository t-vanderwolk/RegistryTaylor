import "./layout.css";
import { DashboardNav } from "../../components/DashboardNav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="dashboard-shell min-h-screen bg-tmIvory">
      <DashboardNav />
      <main className="mx-auto grid max-w-6xl gap-8 px-6 py-10">
        {children}
      </main>
    </div>
  );
}
