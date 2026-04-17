import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogOut, Users, Clock, CheckCircle, XCircle, Eye } from "lucide-react";
import api from "../lib/api";

interface Team {
  _id: string;
  teamName: string;
  email: string;
  phoneNumber: string;
  status: "pending" | "confirmed" | "rejected";
  createdAt: string;
  players: { fullName: string; position: string; phoneNumber?: string }[];
}

const statusStyles: Record<string, string> = {
  pending: "bg-yellow-500/20 text-yellow-400",
  confirmed: "bg-green-500/20 text-green-400",
  rejected: "bg-red-500/20 text-red-400",
};

const statusIcons: Record<string, typeof Clock> = {
  pending: Clock,
  confirmed: CheckCircle,
  rejected: XCircle,
};

export default function DashboardPage() {
  const navigate = useNavigate();
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      const { data } = await api.get("/admin/registrations");
      setTeams(data.data);
    } catch {
      // handled by interceptor
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("admin_token");
    navigate("/login");
  };

  const filtered =
    filter === "all" ? teams : teams.filter((t) => t.status === filter);

  const counts = {
    all: teams.length,
    pending: teams.filter((t) => t.status === "pending").length,
    confirmed: teams.filter((t) => t.status === "confirmed").length,
    rejected: teams.filter((t) => t.status === "rejected").length,
  };

  return (
    <div className="min-h-screen bg-navy-900">
      {/* Header */}
      <header className="border-b border-white/5 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="font-heading text-xl font-bold">
            Admin <span className="text-accent-yellow">Dashboard</span>
          </h1>
          <button
            onClick={logout}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition text-sm"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {(["all", "pending", "confirmed", "rejected"] as const).map((key) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`p-4 rounded-xl border transition text-left ${
                filter === key
                  ? "border-accent-sky/50 bg-accent-sky/10"
                  : "border-white/5 bg-navy-800/40 hover:border-white/10"
              }`}
            >
              <p className="text-2xl font-bold">{counts[key]}</p>
              <p className="text-sm text-gray-400 capitalize">
                {key === "all" ? "Total" : key}
              </p>
            </button>
          ))}
        </div>

        {/* Table */}
        {loading ? (
          <div className="text-center py-20 text-gray-500">
            Loading registrations...
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            No registrations found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5 text-left text-sm text-gray-400">
                  <th className="pb-3 font-medium">Team</th>
                  <th className="pb-3 font-medium">Email</th>
                  <th className="pb-3 font-medium">Phone</th>
                  <th className="pb-3 font-medium">Players</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium">Date</th>
                  <th className="pb-3 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((team) => {
                  const StatusIcon = statusIcons[team.status];
                  return (
                    <tr
                      key={team._id}
                      className="border-b border-white/5 hover:bg-white/[0.02] transition"
                    >
                      <td className="py-4 font-semibold">{team.teamName}</td>
                      <td className="py-4 text-gray-400 text-sm">
                        {team.email}
                      </td>
                      <td className="py-4 text-gray-400 text-sm">
                        {team.phoneNumber}
                      </td>
                      <td className="py-4">
                        <div className="flex items-center gap-1.5">
                          <Users className="w-4 h-4 text-gray-500" />
                          <span className="text-sm">{team.players.length}</span>
                        </div>
                      </td>
                      <td className="py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${statusStyles[team.status]}`}
                        >
                          <StatusIcon className="w-3.5 h-3.5" />
                          {team.status}
                        </span>
                      </td>
                      <td className="py-4 text-gray-400 text-sm">
                        {new Date(team.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-4">
                        <Link
                          to={`/dashboard/${team._id}`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-accent-sky hover:text-sky-300 transition"
                        >
                          <Eye className="w-4 h-4" /> View
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
