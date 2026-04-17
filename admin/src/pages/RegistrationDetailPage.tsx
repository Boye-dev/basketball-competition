import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, CheckCircle, XCircle, FileText, Users } from "lucide-react";
import api from "../lib/api";

interface Team {
  _id: string;
  teamName: string;
  email: string;
  phoneNumber: string;
  status: "pending" | "confirmed" | "rejected";
  players: { fullName: string; position: string; phoneNumber?: string }[];
  contestRepresentatives: {
    threePointContest: string;
    freeThrowContest: string;
  };
  paymentProof: string;
  rejectionReason?: string;
  createdAt: string;
}

export default function RegistrationDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [team, setTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectModal, setShowRejectModal] = useState(false);

  useEffect(() => {
    fetchTeam();
  }, [id]);

  const fetchTeam = async () => {
    try {
      const { data } = await api.get(`/admin/registrations/${id}`);
      setTeam(data.data);
    } catch {
      navigate("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async () => {
    setActionLoading(true);
    try {
      await api.patch(`/admin/registrations/${id}/confirm`);
      fetchTeam();
    } catch {
      // error handled
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    setActionLoading(true);
    try {
      await api.patch(`/admin/registrations/${id}/reject`, {
        reason: rejectReason,
      });
      setShowRejectModal(false);
      fetchTeam();
    } catch {
      // error handled
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-navy-900 text-gray-500">
        Loading...
      </div>
    );
  }

  if (!team) return null;

  const statusColor = {
    pending: "text-yellow-400 bg-yellow-500/20",
    confirmed: "text-green-400 bg-green-500/20",
    rejected: "text-red-400 bg-red-500/20",
  }[team.status];

  return (
    <div className="min-h-screen bg-navy-900 py-8 px-6">
      <div className="max-w-3xl mx-auto">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition mb-6"
        >
          <ArrowLeft className="w-5 h-5" /> Back to Dashboard
        </Link>

        <div className="bg-navy-800/60 border border-white/5 rounded-2xl p-8">
          {/* Header */}
          <div className="flex items-start justify-between mb-8">
            <div>
              <h1 className="font-heading text-2xl font-black">
                {team.teamName}
              </h1>
              <p className="text-gray-400 text-sm mt-1">{team.email}</p>
              <p className="text-gray-400 text-sm mt-0.5">{team.phoneNumber}</p>
              <p className="text-gray-500 text-xs mt-1">
                Registered: {new Date(team.createdAt).toLocaleString()}
              </p>
            </div>
            <span
              className={`px-3 py-1.5 rounded-full text-sm font-bold capitalize ${statusColor}`}
            >
              {team.status}
            </span>
          </div>

          {/* Players */}
          <div className="mb-8">
            <h2 className="font-heading text-lg font-bold mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-accent-sky" /> Players (
              {team.players.length})
            </h2>
            <div className="grid gap-2">
              {team.players.map((p, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between bg-navy-900/50 rounded-xl px-4 py-3"
                >
                  <div>
                    <span className="font-semibold">{p.fullName}</span>
                    {p.phoneNumber && (
                      <span className="text-xs text-gray-500 ml-2">
                        {p.phoneNumber}
                      </span>
                    )}
                  </div>
                  <span className="text-sm text-gray-400">{p.position}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Contest Reps */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-accent-yellow/10 border border-accent-yellow/20 rounded-xl p-4">
              <p className="text-xs text-gray-400 mb-1">3-Point Contest</p>
              <p className="font-bold text-accent-yellow">
                {team.contestRepresentatives.threePointContest}
              </p>
            </div>
            <div className="bg-accent-green/10 border border-accent-green/20 rounded-xl p-4">
              <p className="text-xs text-gray-400 mb-1">Free Throw Contest</p>
              <p className="font-bold text-accent-green">
                {team.contestRepresentatives.freeThrowContest}
              </p>
            </div>
          </div>

          {/* Payment Proof */}
          <div className="mb-8">
            <h2 className="font-heading text-lg font-bold mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-accent-yellow" /> Payment Proof
            </h2>
            {team.paymentProof.endsWith(".pdf") ? (
              <a
                href={team.paymentProof}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-accent-sky/10 border border-accent-sky/20 rounded-xl text-accent-sky hover:bg-accent-sky/20 transition text-sm font-semibold"
              >
                <FileText className="w-4 h-4" /> View PDF
              </a>
            ) : (
              <img
                src={team.paymentProof}
                alt="Payment proof"
                className="max-w-full max-h-80 rounded-xl border border-white/10"
              />
            )}
          </div>

          {/* Rejection reason */}
          {team.status === "rejected" && team.rejectionReason && (
            <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
              <p className="text-sm font-semibold text-red-400 mb-1">
                Rejection Reason
              </p>
              <p className="text-sm text-gray-300">{team.rejectionReason}</p>
            </div>
          )}

          {/* Actions */}
          {team.status === "pending" && (
            <div className="flex gap-4">
              <button
                onClick={handleConfirm}
                disabled={actionLoading}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-accent-green text-white font-bold rounded-xl hover:bg-green-500 transition disabled:opacity-50"
              >
                <CheckCircle className="w-5 h-5" /> Confirm Payment
              </button>
              <button
                onClick={() => setShowRejectModal(true)}
                disabled={actionLoading}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-red-500/20 text-red-400 font-bold rounded-xl hover:bg-red-500/30 transition disabled:opacity-50"
              >
                <XCircle className="w-5 h-5" /> Reject
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-6">
          <div className="bg-navy-800 border border-white/10 rounded-2xl p-6 max-w-md w-full">
            <h3 className="font-heading text-lg font-bold mb-4">
              Reject Registration
            </h3>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Reason for rejection (optional)"
              rows={3}
              className="w-full bg-navy-900/60 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-accent-sky/50 transition mb-4 resize-none"
            />
            <div className="flex gap-3">
              <button
                onClick={() => setShowRejectModal(false)}
                className="flex-1 py-2.5 border border-white/10 rounded-xl text-gray-400 hover:text-white transition font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                disabled={actionLoading}
                className="flex-1 py-2.5 bg-red-500 text-white rounded-xl hover:bg-red-600 transition font-bold disabled:opacity-50"
              >
                {actionLoading ? "Rejecting..." : "Reject"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
