import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  LogIn,
  UserPlus,
  Camera,
  GraduationCap,
  MapPin,
  Building2,
  Sparkles
} from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_20%_10%,#f0fdfa_0%,#ecfeff_25%,#f8fafc_60%,#ffffff_100%)] text-slate-900">
      <header className="border-b border-teal-100/70 bg-white/70 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4">
          <h1 className="flex items-center gap-2 text-2xl font-display font-extrabold tracking-tight">
            <ShieldCheck className="text-teal-600" />
            Smart <span className="text-teal-700">Attendance</span>
          </h1>
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              <LogIn size={16} />
              Login
            </Link>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-teal-700"
            >
              <UserPlus size={16} />
              Register
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl px-6 py-12 md:py-16">
        <section className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 rounded-3xl border border-teal-100 bg-white/80 p-8 shadow-[0_20px_60px_-35px_rgba(13,148,136,0.45)]">
            <p className="inline-flex items-center gap-2 rounded-full bg-teal-100 px-3 py-1 text-xs font-bold tracking-wider text-teal-800">
              <Sparkles size={13} />
              FACE RECOGNITION ATTENDANCE
            </p>
            <h2 className="mt-4 text-4xl font-display font-extrabold leading-tight text-slate-900 md:text-5xl">
              Trinity Academy of Engineering, Pune
            </h2>
            <p className="mt-4 max-w-3xl text-lg text-slate-600">
              Department focused deployment for <span className="font-semibold text-slate-800">Master of Computer Applications (MCA)</span>.
              Register students, manage leaves, and monitor attendance analytics from a single portal.
            </p>

            <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Institute</p>
                <p className="mt-2 flex items-center gap-2 text-sm font-semibold text-slate-800">
                  <Building2 size={16} className="text-teal-600" />
                  Trinity Academy of Engineering
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Location</p>
                <p className="mt-2 flex items-center gap-2 text-sm font-semibold text-slate-800">
                  <MapPin size={16} className="text-teal-600" />
                  Pune, Maharashtra
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Department</p>
                <p className="mt-2 flex items-center gap-2 text-sm font-semibold text-slate-800">
                  <GraduationCap size={16} className="text-teal-600" />
                  MCA Only
                </p>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/login"
                className="rounded-lg bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Open Login Portal
              </Link>
              <Link
                to="/register"
                className="rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Register MCA Student
              </Link>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-xl font-display font-bold text-slate-800">Quick Access</h3>
            <p className="mt-1 text-sm text-slate-500">Direct actions for campus admin flow</p>
            <div className="mt-5 space-y-3">
              <Link
                to="/login"
                className="block rounded-xl border border-slate-200 p-4 transition hover:border-teal-300 hover:bg-teal-50"
              >
                <p className="font-semibold">HOD / Student Login</p>
                <p className="text-sm text-slate-500">Access dashboards and leave management</p>
              </Link>
              <Link
                to="/register"
                className="block rounded-xl border border-slate-200 p-4 transition hover:border-teal-300 hover:bg-teal-50"
              >
                <p className="font-semibold">MCA Face Registration</p>
                <p className="text-sm text-slate-500">Add student profile and biometric face map</p>
              </Link>
              <Link
                to="/scanner"
                className="block rounded-xl border border-slate-200 p-4 transition hover:border-teal-300 hover:bg-teal-50"
              >
                <p className="flex items-center gap-2 font-semibold">
                  <Camera size={16} />
                  Attendance Scanner
                </p>
                <p className="text-sm text-slate-500">Open live camera to mark attendance</p>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;
