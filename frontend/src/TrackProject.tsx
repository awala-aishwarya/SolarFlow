
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  CheckCircle2,
  Circle,
  Clock,
  Sun,
  Zap,
  AlertCircle,
  Loader2
} from "lucide-react";

interface TimelineStage {
  stage: string;
  completed: boolean;
}

interface ProjectData {
  project_id: string;
  customer_name: string;
  system_capacity_kw: number;
  current_status: string;
  timeline: TimelineStage[];
  subsidy_status: string;
}

const API_URL = "http://127.0.0.1:8000";

export default function TrackProject() {
  const { token } = useParams<{ token: string }>();

  const [project, setProject] = useState<ProjectData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchProject() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_URL}/projects/track/${encodeURIComponent(token || "")}`
        );

        if (!response.ok) {
          throw new Error("Invalid or expired tracking link.");
        }

        const data: ProjectData = await response.json();
        setProject(data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load project details."
        );
      } finally {
        setLoading(false);
      }
    }

    if (token) {
      fetchProject();
    } else {
      setError("Tracking token is missing.");
      setLoading(false);
    }
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <Loader2 className="animate-spin mx-auto text-emerald-600" size={40} />
          <p className="mt-4 text-slate-600">Loading your solar project...</p>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
        <div className="bg-white rounded-2xl shadow-sm p-8 text-center max-w-md">
          <AlertCircle className="mx-auto text-red-500" size={44} />
          <h1 className="text-xl font-bold mt-4">Unable to load project</h1>
          <p className="text-slate-500 mt-2">
            {error || "Project information is unavailable."}
          </p>
        </div>
      </div>
    );
  }

  const completedStages = project.timeline.filter(
    (stage) => stage.completed
  ).length;

  const progress = Math.round(
    (completedStages / project.timeline.length) * 100
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-6 py-5 flex items-center gap-3">
          <div className="bg-emerald-100 p-2 rounded-xl">
            <Sun className="text-emerald-700" size={27} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              SolarFlow
            </h1>
            <p className="text-xs text-slate-500">
              Customer Project Tracking
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10">
        <div className="mb-8">
          <p className="text-emerald-700 font-semibold text-sm">
            YOUR SOLAR JOURNEY
          </p>
          <h2 className="text-3xl font-bold mt-2">
            Hello, {project.customer_name}!
          </h2>
          <p className="text-slate-500 mt-2">
            Track the progress of your rooftop solar installation.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-5 mb-8">
          <div className="bg-white p-6 rounded-2xl border border-slate-200">
            <p className="text-sm text-slate-500">Project ID</p>
            <h3 className="text-xl font-bold mt-2">
              {project.project_id}
            </h3>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200">
            <p className="text-sm text-slate-500">Solar capacity</p>
            <div className="flex items-center gap-2 mt-2">
              <Zap className="text-amber-500" />
              <h3 className="text-xl font-bold">
                {project.system_capacity_kw} kW
              </h3>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200">
            <p className="text-sm text-slate-500">Subsidy status</p>
            <h3 className="text-xl font-bold mt-2">
              {project.subsidy_status}
            </h3>
          </div>
        </div>

        <section className="bg-white rounded-2xl border border-slate-200 p-7 mb-8">
          <div className="flex flex-wrap justify-between gap-3 items-center">
            <div>
              <h3 className="text-xl font-bold">Installation progress</h3>
              <p className="text-sm text-slate-500 mt-1">
                Follow each stage of your solar installation.
              </p>
            </div>
            <span className="bg-emerald-50 text-emerald-700 px-4 py-2 rounded-full text-sm font-semibold">
              {progress}% completed
            </span>
          </div>

          <div className="w-full bg-slate-100 rounded-full h-3 mt-6">
            <div
              className="bg-emerald-500 h-3 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="mt-8">
            {project.timeline.map((item, index) => {
              const isCurrent = item.stage === project.current_status;

              return (
                <div key={item.stage} className="flex gap-4 relative pb-8 last:pb-0">
                  <div className="flex flex-col items-center">
                    {item.completed ? (
                      <CheckCircle2
                        className="text-emerald-600 bg-white"
                        size={27}
                      />
                    ) : isCurrent ? (
                      <Clock
                        className="text-amber-500 bg-white"
                        size={27}
                      />
                    ) : (
                      <Circle
                        className="text-slate-300 bg-white"
                        size={27}
                      />
                    )}

                    {index !== project.timeline.length - 1 && (
                      <div className={`w-0.5 flex-1 min-h-12 ${
                        item.completed ? "bg-emerald-400" : "bg-slate-200"
                      }`} />
                    )}
                  </div>

                  <div className="-mt-0.5">
                    <p className={`font-semibold ${
                      item.completed || isCurrent
                        ? "text-slate-900"
                        : "text-slate-400"
                    }`}>
                      {item.stage}
                    </p>

                    <p className="text-sm mt-1 text-slate-500">
                      {item.completed
                        ? "Stage completed"
                        : isCurrent
                          ? "Current project stage"
                          : "Upcoming stage"}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <div className="bg-emerald-900 text-white rounded-2xl p-7">
          <div className="flex items-center gap-3">
            <Sun size={30} />
            <div>
              <h3 className="font-bold text-lg">
                Your clean energy journey
              </h3>
              <p className="text-emerald-100 text-sm mt-1">
                Thank you for choosing solar energy with SolarFlow.
              </p>
            </div>
          </div>
        </div>

        <footer className="text-center text-slate-400 text-sm mt-8">
          SolarFlow · Solar Project Tracking Platform
        </footer>
      </main>
    </div>
  );
}
