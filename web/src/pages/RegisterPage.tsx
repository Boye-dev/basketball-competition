import { useState, useRef } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Plus,
  Trash2,
  CheckCircle,
  Upload,
} from "lucide-react";
import api from "../lib/api";
import ReCAPTCHA from "react-google-recaptcha";

const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY || "";

const nigerianPhoneRegex = /^(\+234|0)(7[0-9]|8[0-9]|9[0-9])\d{8}$/;

const positions = [
  "Point Guard",
  "Shooting Guard",
  "Small Forward",
  "Power Forward",
  "Center",
];

const schema = z
  .object({
    teamName: z.string().min(2, "Team name must be at least 2 characters"),
    email: z.string().email("Must be a valid email address"),
    phoneNumber: z
      .string()
      .regex(
        nigerianPhoneRegex,
        "Must be a valid Nigerian phone number (e.g. 08012345678)",
      ),
    players: z
      .array(
        z.object({
          fullName: z.string().min(2, "Player name is required"),
          position: z.string().min(1, "Position is required"),
          phoneNumber: z
            .string()
            .optional()
            .refine(
              (val) => !val || nigerianPhoneRegex.test(val),
              "Must be a valid Nigerian phone number",
            ),
        }),
      )
      .min(4, "Minimum 4 players required")
      .max(5, "Maximum 5 players allowed"),
    threePointContest: z
      .string()
      .min(1, "3-Point Contest representative is required"),
    freeThrowContest: z
      .string()
      .min(1, "Free Throw Contest representative is required"),
  })
  .refine((data) => data.threePointContest !== data.freeThrowContest, {
    message: "Contest representatives must be two different players",
    path: ["freeThrowContest"],
  });

type FormData = z.infer<typeof schema>;

const STEPS = ["Team Info", "Players", "Contests", "Payment"];

export default function RegisterPage() {
  const [step, setStep] = useState(0);
  const [paymentFile, setPaymentFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    control,
    watch,
    trigger,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      teamName: "",
      email: "",
      phoneNumber: "",
      players: [
        { fullName: "", position: "", phoneNumber: "" },
        { fullName: "", position: "", phoneNumber: "" },
        { fullName: "", position: "", phoneNumber: "" },
        { fullName: "", position: "", phoneNumber: "" },
      ],
      threePointContest: "",
      freeThrowContest: "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "players",
  });
  const players = watch("players");
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);

  const nextStep = async () => {
    let valid = false;
    if (step === 0) valid = await trigger(["teamName", "email", "phoneNumber"]);
    else if (step === 1) valid = await trigger("players");
    else if (step === 2)
      valid = await trigger(["threePointContest", "freeThrowContest"]);
    else valid = true;

    if (valid) {
      setError("");
      setStep((s) => Math.min(s + 1, STEPS.length - 1));
    }
  };

  const prevStep = () => setStep((s) => Math.max(s - 1, 0));

  const onSubmit = async (data: FormData) => {
    if (!paymentFile) {
      setError("Please upload proof of payment");
      return;
    }

    if (RECAPTCHA_SITE_KEY && !recaptchaToken) {
      setError("Please complete the reCAPTCHA verification");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const formData = new FormData();

      formData.append("teamName", data.teamName);
      formData.append("email", data.email);
      formData.append("phoneNumber", data.phoneNumber);
      formData.append("players", JSON.stringify(data.players));
      if (recaptchaToken) {
        formData.append("recaptchaToken", recaptchaToken);
      }
      formData.append("threePointContest", data.threePointContest);
      formData.append("freeThrowContest", data.freeThrowContest);
      formData.append("paymentProof", paymentFile);

      await api.post("/registration", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSubmitted(true);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "Something went wrong. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-navy-900 px-6">
        <motion.div
          className="text-center max-w-md"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <CheckCircle className="w-20 h-20 text-accent-green mx-auto mb-6" />
          <h2 className="font-heading text-3xl font-black mb-4">
            Registration Submitted!
          </h2>
          <p className="text-gray-400 mb-8">
            Awaiting payment confirmation. You will receive an email once your
            payment is verified.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-accent-yellow text-navy-900 font-bold rounded-xl hover:bg-yellow-400 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </motion.div>
      </div>
    );
  }

  const inputClass =
    "w-full bg-navy-800/60 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-accent-sky/50 focus:ring-1 focus:ring-accent-sky/30 transition";
  const labelClass = "block text-sm font-semibold text-gray-300 mb-1.5";
  const errorClass = "text-red-400 text-sm mt-1";

  return (
    <div className="min-h-screen bg-navy-900 py-12 px-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link to="/" className="text-gray-400 hover:text-white transition">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="font-heading text-3xl font-black">
            Team Registration
          </h1>
        </div>

        {/* Progress bar */}
        <div className="flex items-center gap-2 mb-10">
          {STEPS.map((s, i) => (
            <div key={s} className="flex-1 flex flex-col items-center gap-1">
              <div
                className={`h-1.5 w-full rounded-full transition-colors duration-300 ${
                  i <= step ? "bg-accent-green" : "bg-white/10"
                }`}
              />
              <span
                className={`text-xs font-medium ${i <= step ? "text-accent-green" : "text-gray-500"}`}
              >
                {s}
              </span>
            </div>
          ))}
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <AnimatePresence mode="wait">
            {/* Step 0: Team Info */}
            {step === 0 && (
              <motion.div
                key="step0"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.3 }}
                className="space-y-5"
              >
                <div>
                  <label className={labelClass}>Team Name</label>
                  <input
                    {...register("teamName")}
                    placeholder="Enter your team name"
                    className={inputClass}
                  />
                  {errors.teamName && (
                    <p className={errorClass}>{errors.teamName.message}</p>
                  )}
                </div>
                <div>
                  <label className={labelClass}>Email Address</label>
                  <input
                    {...register("email")}
                    type="email"
                    placeholder="team@example.com"
                    className={inputClass}
                  />
                  {errors.email && (
                    <p className={errorClass}>{errors.email.message}</p>
                  )}
                </div>
                <div>
                  <label className={labelClass}>Phone Number</label>
                  <input
                    {...register("phoneNumber")}
                    type="tel"
                    placeholder="08012345678"
                    className={inputClass}
                  />
                  {errors.phoneNumber && (
                    <p className={errorClass}>{errors.phoneNumber.message}</p>
                  )}
                </div>
              </motion.div>
            )}

            {/* Step 1: Players */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <p className="text-gray-400 text-sm mb-2">
                  Add 4 to 5 players to your roster.
                </p>
                {fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="space-y-2 p-4 bg-navy-800/30 rounded-xl border border-white/5"
                  >
                    <div className="flex gap-3 items-start">
                      <div className="flex-1">
                        <input
                          {...register(`players.${index}.fullName`)}
                          placeholder={`Player ${index + 1} full name`}
                          className={inputClass}
                        />
                        {errors.players?.[index]?.fullName && (
                          <p className={errorClass}>
                            {errors.players[index]?.fullName?.message}
                          </p>
                        )}
                      </div>
                      <div className="w-44">
                        <select
                          {...register(`players.${index}.position`)}
                          className={inputClass}
                        >
                          <option value="">Position</option>
                          {positions.map((p) => (
                            <option key={p} value={p}>
                              {p}
                            </option>
                          ))}
                        </select>
                        {errors.players?.[index]?.position && (
                          <p className={errorClass}>
                            {errors.players[index]?.position?.message}
                          </p>
                        )}
                      </div>
                      {fields.length > 4 && (
                        <button
                          type="button"
                          onClick={() => remove(index)}
                          className="p-3 text-red-400 hover:text-red-300 transition"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                    <div>
                      <input
                        {...register(`players.${index}.phoneNumber`)}
                        type="tel"
                        placeholder="Phone number (optional)"
                        className={inputClass}
                      />
                      {errors.players?.[index]?.phoneNumber && (
                        <p className={errorClass}>
                          {(errors.players[index]?.phoneNumber as any)?.message}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
                {fields.length < 5 && (
                  <button
                    type="button"
                    onClick={() =>
                      append({ fullName: "", position: "", phoneNumber: "" })
                    }
                    className="flex items-center gap-2 text-accent-green hover:text-green-400 text-sm font-semibold transition"
                  >
                    <Plus className="w-4 h-4" /> Add Player
                  </button>
                )}
                {errors.players?.message && (
                  <p className={errorClass}>{errors.players.message}</p>
                )}
              </motion.div>
            )}

            {/* Step 2: Contest Reps */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.3 }}
                className="space-y-5"
              >
                <p className="text-gray-400 text-sm mb-2">
                  Select one player for each contest. They must be different
                  players.
                </p>
                <div>
                  <label className={labelClass}>
                    3-Point Contest Representative
                  </label>
                  <select
                    {...register("threePointContest")}
                    className={inputClass}
                  >
                    <option value="">Select a player</option>
                    {players
                      .filter((p) => p.fullName)
                      .map((p, i) => (
                        <option key={i} value={p.fullName}>
                          {p.fullName}
                        </option>
                      ))}
                  </select>
                  {errors.threePointContest && (
                    <p className={errorClass}>
                      {errors.threePointContest.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className={labelClass}>
                    Free Throw Contest Representative
                  </label>
                  <select
                    {...register("freeThrowContest")}
                    className={inputClass}
                  >
                    <option value="">Select a player</option>
                    {players
                      .filter((p) => p.fullName)
                      .map((p, i) => (
                        <option key={i} value={p.fullName}>
                          {p.fullName}
                        </option>
                      ))}
                  </select>
                  {errors.freeThrowContest && (
                    <p className={errorClass}>
                      {errors.freeThrowContest.message}
                    </p>
                  )}
                </div>
              </motion.div>
            )}

            {/* Step 3: Payment */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="p-6 bg-accent-yellow/10 border border-accent-yellow/20 rounded-2xl">
                  <h3 className="font-heading text-lg font-bold text-accent-yellow mb-3">
                    Payment Details
                  </h3>
                  <div className="space-y-2 text-sm">
                    <p>
                      <span className="text-gray-400">Payment Method:</span>{" "}
                      <span className="font-semibold text-white">Palmpay</span>
                    </p>
                    <p>
                      <span className="text-gray-400">Account Name:</span>{" "}
                      <span className="font-semibold text-white">Maryam</span>
                    </p>
                    <p>
                      <span className="text-gray-400">Account Number:</span>{" "}
                      <span className="font-semibold text-white font-mono">
                        8140368679
                      </span>
                    </p>
                    <p>
                      <span className="text-gray-400">Amount:</span>{" "}
                      <span className="font-semibold text-accent-yellow">
                        ₦5,000
                      </span>
                    </p>
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Upload Proof of Payment</label>
                  <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-white/10 rounded-2xl cursor-pointer hover:border-accent-sky/30 transition">
                    <Upload className="w-8 h-8 text-gray-500 mb-2" />
                    <span className="text-sm text-gray-400">
                      {paymentFile
                        ? paymentFile.name
                        : "Click to upload (JPG, PNG, or PDF)"}
                    </span>
                    <input
                      type="file"
                      accept=".jpg,.jpeg,.png,.pdf"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) setPaymentFile(file);
                      }}
                    />
                  </label>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* reCAPTCHA checkbox */}
          {step === STEPS.length - 1 && RECAPTCHA_SITE_KEY && (
            <div className="mt-6 flex justify-center">
              <ReCAPTCHA
                ref={recaptchaRef}
                sitekey={RECAPTCHA_SITE_KEY}
                theme="dark"
                onChange={(token) => setRecaptchaToken(token)}
                onExpired={() => setRecaptchaToken(null)}
              />
            </div>
          )}

          {/* Navigation buttons */}
          <div className="flex justify-between mt-10">
            {step > 0 ? (
              <button
                type="button"
                onClick={prevStep}
                className="flex items-center gap-2 px-6 py-3 text-gray-400 hover:text-white font-semibold transition"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
            ) : (
              <div />
            )}

            {step < STEPS.length - 1 ? (
              <button
                type="button"
                onClick={nextStep}
                className="flex items-center gap-2 px-8 py-3 bg-accent-green text-white font-bold rounded-xl hover:bg-green-500 transition shadow-lg shadow-accent-green/20"
              >
                Next <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={submitting}
                className="flex items-center gap-2 px-8 py-3 bg-accent-yellow text-navy-900 font-bold rounded-xl hover:bg-yellow-400 transition shadow-lg shadow-accent-yellow/20 disabled:opacity-50"
              >
                {submitting ? "Submitting..." : "Submit Registration"}
                <CheckCircle className="w-4 h-4" />
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
