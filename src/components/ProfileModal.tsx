import React, { useState } from "react";
import {
  X,
  User,
  Mail,
  Phone,
  GraduationCap,
  Building,
  Calendar,
  ShieldCheck,
  LogOut,
  LogIn,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  QrCode,
  Award,
  IdCard,
  Edit3,
} from "lucide-react";
import { UserProfile } from "../types";

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onUpdateProfile: (updated: UserProfile) => void;
  onLogout: () => void;
  onLogin: (name: string, email: string, phone: string, institution: string) => void;
  totalQuestions: number;
  totalConversations: number;
}

const AVATAR_COLORS = [
  { id: "indigo", bg: "bg-indigo-600", border: "border-indigo-600", text: "text-indigo-600", light: "bg-indigo-50 dark:bg-indigo-950/60" },
  { id: "emerald", bg: "bg-emerald-600", border: "border-emerald-600", text: "text-emerald-600", light: "bg-emerald-50 dark:bg-emerald-950/60" },
  { id: "violet", bg: "bg-violet-600", border: "border-violet-600", text: "text-violet-600", light: "bg-violet-50 dark:bg-violet-950/60" },
  { id: "amber", bg: "bg-amber-500", border: "border-amber-500", text: "text-amber-600", light: "bg-amber-50 dark:bg-amber-950/60" },
  { id: "rose", bg: "bg-rose-600", border: "border-rose-600", text: "text-rose-600", light: "bg-rose-50 dark:bg-rose-950/60" },
  { id: "cyan", bg: "bg-cyan-600", border: "border-cyan-600", text: "text-cyan-600", light: "bg-cyan-50 dark:bg-cyan-950/60" },
];

const PRESET_STUDENTS = [
  {
    name: "Richa Khobragade",
    email: "richakhobragade16@gmail.com",
    phone: "+91 98765 43210",
    institution: "National Institute of Technology",
    major: "Computer Science & Engineering",
    year: "3rd Year",
    avatarColor: "indigo",
  },
  {
    name: "Aarav Sharma",
    email: "aarav.sharma@collegemail.edu",
    phone: "+91 91234 56780",
    institution: "Indian Institute of Technology",
    major: "Data Science & AI",
    year: "4th Year (Final)",
    avatarColor: "emerald",
  },
  {
    name: "Elena Rostova",
    email: "elena.tech@university.ac.uk",
    phone: "+44 7911 123456",
    institution: "Imperial College London",
    major: "Software Systems Engineering",
    year: "Graduate / Masters",
    avatarColor: "violet",
  },
];

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  onUpdateProfile,
  onLogout,
  onLogin,
  totalQuestions,
  totalConversations,
}) => {
  const [activeTab, setActiveTab] = useState<"profile" | "card" | "auth">("profile");

  // Form State for editing
  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);
  const [phone, setPhone] = useState(profile.phone);
  const [institution, setInstitution] = useState(profile.institution);
  const [major, setMajor] = useState(profile.major);
  const [year, setYear] = useState(profile.year);
  const [avatarColor, setAvatarColor] = useState(profile.avatarColor || "indigo");

  // Auth Form State
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPhone, setLoginPhone] = useState("");
  const [loginName, setLoginName] = useState("");
  const [loginInstitution, setLoginInstitution] = useState("");

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  if (!isOpen) return null;

  // Validate email
  const isValidEmail = (val: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());
  };

  // Validate phone
  const isValidPhone = (val: string) => {
    const digits = val.replace(/\D/g, "");
    return digits.length >= 7 && digits.length <= 15;
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!name.trim()) {
      setFormError("Full name is required.");
      return;
    }
    if (!isValidEmail(email)) {
      setFormError("Please enter a valid email address (e.g. name@example.com).");
      return;
    }
    if (!isValidPhone(phone)) {
      setFormError("Please enter a valid contact phone number with country/area code.");
      return;
    }

    const updated: UserProfile = {
      ...profile,
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      institution: institution.trim() || "University Student",
      major: major.trim() || "General Studies",
      year: year.trim() || "Undergraduate",
      avatarColor,
      isLoggedIn: true,
    };

    onUpdateProfile(updated);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handlePerformLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!loginEmail.trim() || !isValidEmail(loginEmail)) {
      setFormError("Please enter a valid email address.");
      return;
    }
    if (!loginPhone.trim() || !isValidPhone(loginPhone)) {
      setFormError("Please enter a valid mobile number.");
      return;
    }

    const assignedName = loginName.trim() || loginEmail.split("@")[0] || "Student";
    const assignedInst = loginInstitution.trim() || "College / University";

    onLogin(assignedName, loginEmail.trim(), loginPhone.trim(), assignedInst);
    setName(assignedName);
    setEmail(loginEmail.trim());
    setPhone(loginPhone.trim());
    setInstitution(assignedInst);
    setActiveTab("profile");
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleQuickDemoLogin = (preset: typeof PRESET_STUDENTS[0]) => {
    setName(preset.name);
    setEmail(preset.email);
    setPhone(preset.phone);
    setInstitution(preset.institution);
    setMajor(preset.major);
    setYear(preset.year);
    setAvatarColor(preset.avatarColor);

    const updated: UserProfile = {
      ...profile,
      name: preset.name,
      email: preset.email,
      phone: preset.phone,
      institution: preset.institution,
      major: preset.major,
      year: preset.year,
      avatarColor: preset.avatarColor,
      isLoggedIn: true,
    };

    onUpdateProfile(updated);
    setActiveTab("profile");
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const currentColorConfig =
    AVATAR_COLORS.find((c) => c.id === avatarColor) || AVATAR_COLORS[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        id="profile-modal-card"
        className="w-full max-w-xl rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header with Student Banner */}
        <div className="relative px-6 pt-5 pb-4 bg-gradient-to-r from-neutral-900 via-indigo-950 to-neutral-900 text-white border-b border-neutral-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`w-12 h-12 rounded-2xl ${currentColorConfig.bg} text-white flex items-center justify-center font-bold text-lg shadow-md ring-2 ring-white/20`}
              >
                {name.trim() ? name.trim().charAt(0).toUpperCase() : "S"}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                    {name || "Student Profile"}
                  </h3>
                  {profile.isLoggedIn ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 border border-emerald-400/40 text-emerald-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Active Student
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/20 border border-amber-400/40 text-amber-300">
                      Guest Mode
                    </span>
                  )}
                </div>
                <p className="text-xs text-neutral-300 truncate">
                  {email || "No email registered"} • {phone || "No phone registered"}
                </p>
              </div>
            </div>

            <button
              id="close-profile-modal-btn"
              onClick={onClose}
              className="p-1.5 rounded-xl text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Close profile modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center gap-1 mt-4 pt-2 border-t border-white/10 text-xs">
            <button
              id="tab-profile-details"
              type="button"
              onClick={() => setActiveTab("profile")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors ${
                activeTab === "profile"
                  ? "bg-white/20 text-white font-semibold shadow-xs"
                  : "text-neutral-400 hover:text-white hover:bg-white/10"
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Edit Details</span>
            </button>
            <button
              id="tab-profile-card"
              type="button"
              onClick={() => setActiveTab("card")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors ${
                activeTab === "card"
                  ? "bg-white/20 text-white font-semibold shadow-xs"
                  : "text-neutral-400 hover:text-white hover:bg-white/10"
              }`}
            >
              <IdCard className="w-3.5 h-3.5" />
              <span>Student ID Card</span>
            </button>
            <button
              id="tab-profile-auth"
              type="button"
              onClick={() => setActiveTab("auth")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors ${
                activeTab === "auth"
                  ? "bg-white/20 text-white font-semibold shadow-xs"
                  : "text-neutral-400 hover:text-white hover:bg-white/10"
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{profile.isLoggedIn ? "Account & Logout" : "Sign In / Login"}</span>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs sm:text-sm">
          {/* Notification Banners */}
          {savedSuccess && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-medium animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Profile information successfully updated and saved!</span>
            </div>
          )}

          {formError && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-300 dark:border-red-800 text-red-800 dark:text-red-200 text-xs font-medium animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          {/* TAB 1: EDIT PROFILE DETAILS */}
          {activeTab === "profile" && (
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Student Full Name *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
                    <input
                      id="profile-name-input"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Richa Khobragade"
                      className="w-full pl-9 pr-3 py-2 rounded-xl text-xs sm:text-sm bg-neutral-50 dark:bg-neutral-800/80 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Email ID *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
                    <input
                      id="profile-email-input"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="student@example.com"
                      className="w-full pl-9 pr-3 py-2 rounded-xl text-xs sm:text-sm bg-neutral-50 dark:bg-neutral-800/80 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Phone Number (Mobile) *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
                    <input
                      id="profile-phone-input"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full pl-9 pr-3 py-2 rounded-xl text-xs sm:text-sm bg-neutral-50 dark:bg-neutral-800/80 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>
                </div>

                {/* College / University */}
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    University / College / Institute
                  </label>
                  <div className="relative">
                    <Building className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
                    <input
                      id="profile-institution-input"
                      type="text"
                      value={institution}
                      onChange={(e) => setInstitution(e.target.value)}
                      placeholder="e.g. National Institute of Technology"
                      className="w-full pl-9 pr-3 py-2 rounded-xl text-xs sm:text-sm bg-neutral-50 dark:bg-neutral-800/80 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                {/* Major / Discipline */}
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Major / Branch / Department
                  </label>
                  <div className="relative">
                    <GraduationCap className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
                    <input
                      id="profile-major-input"
                      type="text"
                      value={major}
                      onChange={(e) => setMajor(e.target.value)}
                      placeholder="e.g. Computer Science, Mechanical, Biology"
                      className="w-full pl-9 pr-3 py-2 rounded-xl text-xs sm:text-sm bg-neutral-50 dark:bg-neutral-800/80 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                {/* Academic Year */}
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Academic Year / Semester
                  </label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
                    <select
                      id="profile-year-select"
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 rounded-xl text-xs sm:text-sm bg-neutral-50 dark:bg-neutral-800/80 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="1st Year (Freshman)">1st Year (Freshman)</option>
                      <option value="2nd Year (Sophomore)">2nd Year (Sophomore)</option>
                      <option value="3rd Year (Junior)">3rd Year (Junior)</option>
                      <option value="4th Year (Senior / Final)">4th Year (Senior / Final)</option>
                      <option value="Postgraduate / Masters / PhD">Postgraduate / Masters / PhD</option>
                      <option value="Independent Self-Learner">Independent Self-Learner</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Avatar Color Choice */}
              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                  Student Avatar Theme Accent
                </label>
                <div className="flex items-center gap-2">
                  {AVATAR_COLORS.map((col) => (
                    <button
                      key={col.id}
                      type="button"
                      onClick={() => setAvatarColor(col.id)}
                      className={`w-7 h-7 rounded-full ${col.bg} transition-transform ${
                        avatarColor === col.id
                          ? "ring-2 ring-offset-2 ring-indigo-500 dark:ring-offset-neutral-900 scale-110"
                          : "opacity-80 hover:opacity-100"
                      }`}
                      title={col.id}
                    />
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2 flex items-center justify-between border-t border-neutral-200 dark:border-neutral-800">
                <span className="text-[11px] text-neutral-500 dark:text-neutral-400">
                  Data is safely synchronized with local storage.
                </span>
                <button
                  id="save-profile-btn"
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs sm:text-sm shadow-md transition-colors"
                >
                  Save Profile Changes
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: STUDENT ID CARD PREVIEW */}
          {activeTab === "card" && (
            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-900 via-indigo-950 to-neutral-900 text-white border border-indigo-500/30 shadow-xl relative overflow-hidden">
                {/* Hologram Badge */}
                <div className="absolute top-0 right-0 w-36 h-36 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-white/10 border border-white/20">
                      <GraduationCap className="w-5 h-5 text-indigo-300" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm tracking-wide uppercase text-indigo-200">
                        EduMind Student ID
                      </h4>
                      <p className="text-[10px] text-neutral-400">Academic Verified Pass</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-mono text-indigo-300 block">ID: EDU-{Date.now().toString().slice(-6)}</span>
                    <span className="inline-block px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[9px] font-semibold uppercase">
                      Active
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4 my-3">
                  <div
                    className={`w-16 h-16 rounded-2xl ${currentColorConfig.bg} text-white flex items-center justify-center font-bold text-2xl shadow-inner ring-2 ring-white/30`}
                  >
                    {name.charAt(0).toUpperCase() || "S"}
                  </div>
                  <div className="space-y-0.5 min-w-0 flex-1">
                    <h5 className="font-bold text-base text-white truncate">{name}</h5>
                    <p className="text-xs text-indigo-200 truncate">{major}</p>
                    <p className="text-[11px] text-neutral-300 truncate">{institution}</p>
                    <p className="text-[10px] text-neutral-400">{year}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-3 mt-3 border-t border-white/10 text-[11px]">
                  <div>
                    <span className="text-neutral-400 block text-[10px]">Email ID:</span>
                    <span className="text-neutral-200 truncate block">{email}</span>
                  </div>
                  <div>
                    <span className="text-neutral-400 block text-[10px]">Phone Number:</span>
                    <span className="text-neutral-200 truncate block">{phone}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 mt-2 border-t border-white/10 text-[10px] text-neutral-400">
                  <div className="flex items-center gap-3">
                    <span>Questions Asked: <strong className="text-white">{totalQuestions}</strong></span>
                    <span>Sessions: <strong className="text-white">{totalConversations}</strong></span>
                  </div>
                  <div className="flex items-center gap-1 text-indigo-300">
                    <QrCode className="w-4 h-4" />
                    <span className="font-mono">VERIFIED</span>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setActiveTab("profile")}
                  className="inline-flex items-center gap-1.5 text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Update your ID details anytime</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: ACCOUNT, LOGIN & LOGOUT */}
          {activeTab === "auth" && (
            <div className="space-y-4">
              {profile.isLoggedIn ? (
                <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-neutral-900 dark:text-white text-sm">
                        Currently Signed In
                      </h4>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">
                        Active student session for <strong>{profile.email}</strong>
                      </p>
                    </div>
                    <div className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
                  </div>

                  <div className="p-3 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs space-y-1">
                    <p className="text-neutral-700 dark:text-neutral-300">
                      <strong>Name:</strong> {profile.name}
                    </p>
                    <p className="text-neutral-700 dark:text-neutral-300">
                      <strong>Phone:</strong> {profile.phone}
                    </p>
                    <p className="text-neutral-700 dark:text-neutral-300">
                      <strong>Status:</strong> Active Student Session
                    </p>
                  </div>

                  {!showLogoutConfirm ? (
                    <button
                      id="profile-logout-btn"
                      type="button"
                      onClick={() => setShowLogoutConfirm(true)}
                      className="w-full py-2.5 rounded-xl border border-red-300 dark:border-red-900 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 text-xs font-semibold transition-colors flex items-center justify-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Log Out of Student Account</span>
                    </button>
                  ) : (
                    <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-300 dark:border-red-900 space-y-2">
                      <p className="text-xs font-semibold text-red-800 dark:text-red-300">
                        Are you sure you want to log out?
                      </p>
                      <p className="text-[11px] text-red-700 dark:text-red-400">
                        Your study chat history and bookmarks will remain saved locally on this device.
                      </p>
                      <div className="flex gap-2">
                        <button
                          id="confirm-logout-btn"
                          type="button"
                          onClick={() => {
                            onLogout();
                            setShowLogoutConfirm(false);
                            onClose();
                          }}
                          className="flex-1 py-1.5 rounded-lg bg-red-600 text-white font-medium text-xs hover:bg-red-700"
                        >
                          Confirm Logout
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowLogoutConfirm(false)}
                          className="flex-1 py-1.5 rounded-lg bg-neutral-200 dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200 text-xs"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* LOGIN / SIGN IN FORM */
                <div className="space-y-4">
                  <div className="text-center py-1">
                    <h4 className="font-bold text-neutral-900 dark:text-white text-base">
                      Student Account Login
                    </h4>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      Sign in with your student email and phone number to sync your study profile.
                    </p>
                  </div>

                  <form onSubmit={handlePerformLogin} className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                        Student Email ID *
                      </label>
                      <input
                        type="email"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        placeholder="richa@example.com"
                        className="w-full px-3 py-2 rounded-xl text-xs sm:text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        value={loginPhone}
                        onChange={(e) => setLoginPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full px-3 py-2 rounded-xl text-xs sm:text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                        Full Name (Optional)
                      </label>
                      <input
                        type="text"
                        value={loginName}
                        onChange={(e) => setLoginName(e.target.value)}
                        placeholder="Your Name"
                        className="w-full px-3 py-2 rounded-xl text-xs sm:text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white"
                      />
                    </div>

                    <button
                      id="perform-login-btn"
                      type="submit"
                      className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs sm:text-sm shadow-md flex items-center justify-center gap-2"
                    >
                      <LogIn className="w-4 h-4" />
                      <span>Sign In as Student</span>
                    </button>
                  </form>

                  {/* Quick One-Click Demo Profiles */}
                  <div className="pt-3 border-t border-neutral-200 dark:border-neutral-800">
                    <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-2">
                      Or One-Click Demo Profiles:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {PRESET_STUDENTS.map((preset) => (
                        <button
                          key={preset.email}
                          type="button"
                          onClick={() => handleQuickDemoLogin(preset)}
                          className="p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:border-indigo-400 text-left bg-neutral-50 dark:bg-neutral-800/40 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition-colors"
                        >
                          <span className="font-semibold text-neutral-900 dark:text-white block truncate text-xs">
                            {preset.name}
                          </span>
                          <span className="text-[10px] text-neutral-500 dark:text-neutral-400 block truncate">
                            {preset.major}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
