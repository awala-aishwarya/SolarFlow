
import NewLead from "./NewLead";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Users,
  FileText,
  Calculator,
  FolderKanban,
  Settings,
  Sun,
  Bell,
  Search,
  Zap,
  IndianRupee,
  Clock,
  Plus,
  RefreshCw,
} from "lucide-react";

import { Routes, Route } from "react-router-dom";
import TrackProject from "./TrackProject";

const API_URL = "http://127.0.0.1:8000";

interface Lead {
  id: number;
  lead_id: string;
  name: string;
  phone?: string;
  ownership?: string;
  roof_type?: string;
  roof_area?: number;
  monthly_bill: number;
  pincode: string;
  avg_units?: number | null;
  recommended_kw?: number | null;
  score: string;
  status: string;
}

interface Project {
  id: number;
  project_id: string;
  lead_id: string;
  customer_name: string;
  system_capacity_kw: number;
  project_status: string;
  subsidy_status: string;
  advance_paid?: number;
  installation_cost?: number;
}

function Dashboard() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboard = async () => {
    setLoading(true);
    setError("");

    try {
      const [leadsResponse, projectsResponse] = await Promise.all([
        fetch(`${API_URL}/leads/`),
        fetch(`${API_URL}/projects/`),
      ]);

      if (!leadsResponse.ok || !projectsResponse.ok) {
        throw new Error("Unable to retrieve dashboard data.");
      }

      const leadsData = await leadsResponse.json();
      const projectsData = await projectsResponse.json();

      setLeads(Array.isArray(leadsData) ? leadsData : []);
      setProjects(Array.isArray(projectsData) ? projectsData : []);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not connect to the backend."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const qualifiedLeads = leads.filter(
    (lead) =>
      lead.score?.toLowerCase() === "high" ||
      lead.score?.toLowerCase() === "medium"
  ).length;

  const activeProjects = projects.filter(
    (project) =>
      project.project_status !== "Installation Completed" &&
      project.project_status !== "Subsidy Credited"
  ).length;

  const totalPipeline = projects.reduce(
    (total, project) =>
      total + (Number(project.installation_cost) || 0),
    0
  );

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);

  const stats = [
    {
      title: "Total Leads",
      value: leads.length.toString(),
      note: "Total records in database",
      icon: Users,
    },
    {
      title: "Qualified Leads",
      value: qualifiedLeads.toString(),
      note: "High and medium priority",
      icon: Zap,
    },
    {
      title: "Projects Created",
      value: projects.length.toString(),
      note: "Projects in the system",
      icon: FileText,
    },
    {
      title: "Active Projects",
      value: activeProjects.toString(),
      note: "Projects in progress",
      icon: FolderKanban,
    },
  ];

  return (
    <div className="min-h-screen bg-[#f7f9f7] text-slate-800 flex">
      <aside className="w-64 bg-white border-r border-slate-200 p-5 hidden md:flex flex-col">
        <div className="flex items-center gap-3 mb-10">
          <div className="bg-green-700 text-white p-2 rounded-xl">
            <Sun size={25} />
          </div>
          <div>
            <h1 className="text-xl font-bold">SolarFlow</h1>
            <p className="text-xs text-slate-500">Solar Management</p>
          </div>
        </div>

        <p className="text-xs font-semibold text-slate-400 mb-3">
          WORKSPACE
        </p>

        <nav className="space-y-2">
          {[
            [LayoutDashboard, "Dashboard"],
            [Users, "Leads"],
            [FileText, "Quotations"],
            [Calculator, "Calculator"],
            [FolderKanban, "Projects"],
          ].map(([Icon, label], index) => {
            const ItemIcon = Icon as typeof LayoutDashboard;

            return (
              <button
                key={String(label)}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm text-left ${
                  index === 0
                    ? "bg-green-50 text-green-800 font-semibold"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <ItemIcon size={19} />
                {String(label)}
              </button>
            );
          })}
        </nav>

        <div className="mt-auto">
          <button className="flex items-center gap-3 px-3 py-3 text-sm text-slate-600">
            <Settings size={19} /> Settings
          </button>

          <div className="mt-5 p-3 bg-green-50 rounded-xl">
            <p className="text-sm font-semibold text-green-900">
              SolarFlow Pro
            </p>
            <p className="text-xs text-green-700 mt-1">
              Smart solar operations
            </p>
          </div>
        </div>
      </aside>

      <main className="flex-1 min-w-0">
        <header className="h-20 bg-white border-b border-slate-200 px-5 md:px-8 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500">
              Workspace / Overview
            </p>
            <h2 className="text-xl font-bold mt-1">Dashboard</h2>
          </div>

          <div className="flex items-center gap-4">
            <button className="text-slate-500">
              <Search size={20} />
            </button>

            <button className="text-slate-500 relative">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>

            <div className="w-9 h-9 bg-green-100 text-green-800 rounded-full flex items-center justify-center font-semibold">
              A
            </div>
          </div>
        </header>

        <div className="p-5 md:p-8 max-w-7xl mx-auto">
          <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
            <div>
              <h3 className="text-2xl font-bold">
                Good morning, Admin 👋
              </h3>
              <p className="text-sm text-slate-500 mt-1">
                Here's what's happening with your solar business.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={loadDashboard}
                className="border border-slate-200 bg-white hover:bg-slate-50 px-4 py-3 rounded-xl flex items-center gap-2 text-sm font-semibold"
              >
                <RefreshCw size={17} /> Refresh
              </button>

              <button
  onClick={() => window.location.assign("/new-lead")}
  className="bg-green-700 hover:bg-green-800 text-white px-5 py-3 rounded-xl flex items-center gap-2 text-sm font-semibold"
>
  <Plus size={18} /> Add New Lead
</button>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 text-red-700 border border-red-200 text-sm">
              {error}
              <p className="mt-1 text-xs">
                Make sure your FastAPI backend is running on port 8000.
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
            {stats.map((stat) => {
              const Icon = stat.icon;

              return (
                <div
                  key={stat.title}
                  className="bg-white p-5 rounded-2xl border border-slate-200"
                >
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-slate-500">
                      {stat.title}
                    </p>

                    <div className="p-2 bg-green-50 text-green-700 rounded-lg">
                      <Icon size={19} />
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold mt-4">
                    {loading ? "..." : stat.value}
                  </h3>

                  <p className="text-xs text-slate-400 mt-2">
                    {stat.note}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mt-7">
            <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-5">
              <div className="flex justify-between items-center mb-5">
                <div>
                  <h3 className="font-bold text-lg">Recent Leads</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Latest customer enquiries from your database
                  </p>
                </div>

                <button
                  onClick={loadDashboard}
                  className="text-sm text-green-700 font-semibold"
                >
                  Refresh
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left min-w-[550px]">
                  <thead className="text-xs text-slate-400 border-b">
                    <tr>
                      <th className="py-3">CUSTOMER</th>
                      <th>MONTHLY BILL</th>
                      <th>SYSTEM</th>
                      <th>SCORE</th>
                      <th>STATUS</th>
                    </tr>
                  </thead>

                  <tbody>
                    {!loading && leads.length === 0 && (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-slate-400">
                          No leads found. Add your first lead.
                        </td>
                      </tr>
                    )}

                    {leads.slice(-5).reverse().map((lead) => (
                      <tr
                        key={lead.lead_id}
                        className="border-b last:border-0"
                      >
                        <td className="py-4">
                          <p className="font-semibold">{lead.name}</p>
                          <p className="text-xs text-slate-400">
                            {lead.lead_id} · {lead.pincode}
                          </p>
                        </td>

                        <td>{formatCurrency(lead.monthly_bill || 0)}</td>

                        <td>
                          {lead.recommended_kw
                            ? `${lead.recommended_kw} kW`
                            : "—"}
                        </td>

                        <td>
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              lead.score?.toLowerCase() === "high"
                                ? "bg-green-50 text-green-700"
                                : lead.score?.toLowerCase() === "medium"
                                ? "bg-yellow-50 text-yellow-700"
                                : "bg-orange-50 text-orange-700"
                            }`}
                          >
                            {lead.score || "Pending"}
                          </span>
                        </td>

                        <td className="text-slate-600">
                          {lead.status || "New"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-green-900 text-white rounded-2xl p-6">
              <div className="flex justify-between items-center">
                <Zap size={24} />
                <span className="text-xs bg-white/15 px-3 py-1 rounded-full">
                  Live overview
                </span>
              </div>

              <h3 className="text-lg font-semibold mt-7">
                Solar Performance
              </h3>
              <p className="text-green-200 text-sm mt-1">
                Operational snapshot
              </p>

              <div className="mt-7">
                <p className="text-sm text-green-200">
                  Projects in database
                </p>
                <h2 className="text-4xl font-bold mt-2">
                  {loading ? "..." : projects.length}
                </h2>
              </div>

              <div className="mt-6 pt-5 border-t border-white/20">
                <p className="text-sm text-green-200">
                  Total recorded project value
                </p>
                <p className="text-2xl font-bold mt-1">
                  {loading ? "..." : formatCurrency(totalPipeline)}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-7">
            <div className="bg-white border border-slate-200 rounded-2xl p-5">
              <div className="flex items-center gap-3">
                <Clock className="text-orange-500" />
                <h3 className="font-bold">Pending Follow-ups</h3>
              </div>

              <p className="text-3xl font-bold mt-5">
                {loading
                  ? "..."
                  : leads.filter(
                      (lead) =>
                        lead.status?.toLowerCase() === "new" ||
                        lead.status?.toLowerCase() === "review"
                    ).length}
              </p>
              <p className="text-sm text-slate-500 mt-1">
                Leads awaiting further sales action
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5">
              <div className="flex items-center gap-3">
                <IndianRupee className="text-green-700" />
                <h3 className="font-bold">Project Status</h3>
              </div>

              <p className="text-3xl font-bold mt-5">
                {loading ? "..." : activeProjects}
              </p>
              <p className="text-sm text-slate-500 mt-1">
                Projects currently in progress
              </p>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 mt-7">
            <h3 className="font-bold text-lg mb-1">Recent Projects</h3>
            <p className="text-xs text-slate-500 mb-5">
              Project progress from your database
            </p>

            {projects.length === 0 && !loading ? (
              <p className="text-sm text-slate-400 py-4">
                No projects created yet.
              </p>
            ) : (
              <div className="space-y-4">
                {projects.slice(-5).reverse().map((project) => (
                  <div
                    key={project.project_id}
                    className="flex flex-wrap justify-between gap-3 border-b last:border-0 pb-3 last:pb-0"
                  >
                    <div>
                      <p className="font-semibold text-sm">
                        {project.customer_name}
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        {project.project_id} · {project.system_capacity_kw} kW
                      </p>
                    </div>

                    <span className="text-xs bg-green-50 text-green-700 px-3 py-2 rounded-full h-fit">
                      {project.project_status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/track/:token" element={<TrackProject />} />
      <Route path="/new-lead" element={<NewLead />} />
    </Routes>
  );
}

export default App;
