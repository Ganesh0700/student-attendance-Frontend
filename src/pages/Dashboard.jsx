import React, { useState, useEffect, useRef } from "react";
import Webcam from "react-webcam";
import { markAttendance, getStats, getLogs } from "../api";
import { CheckCircle, Users, Activity, ShieldCheck, Clock } from "lucide-react";

const Dashboard = () => {
  const webcamRef = useRef(null);
  const [stats, setStats] = useState({ total_students: 0, present_today: 0 });
  const [logs, setLogs] = useState([]);
  const [isScanning, setIsScanning] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [cooldown, setCooldown] = useState(false);

  // 1. Fetch Data Function
  const fetchData = async () => {
    try {
      const s = await getStats();
      const l = await getLogs();
      setStats(s.data);
      setLogs(l.data);
    } catch (e) { console.error("API Error", e); }
  };

  // 2. Initial Load & Interval
  useEffect(() => {
    queueMicrotask(() => {
      void fetchData();
    });
    const interval = setInterval(fetchData, 3000); // Refresh logs every 3s
    return () => clearInterval(interval);
  }, []);

  // 3. Auto Scan Logic
  useEffect(() => {
    let scanInterval;
    if (isScanning && !cooldown) {
      scanInterval = setInterval(async () => {
        // Safe check for camera
        if (webcamRef.current) {
          const imageSrc = webcamRef.current.getScreenshot();

          // Only proceed if we actually got an image
          if (imageSrc) {
            try {
              const res = await markAttendance({ image: imageSrc });
              if (res.data.match) {
                // SUCCESS!
                setSuccessMsg(res.data.name);
                setCooldown(true);
                fetchData(); // Refresh logs immediately

                // 3 Second Pause
                setTimeout(() => {
                  setSuccessMsg("");
                  setCooldown(false);
                }, 3000);
              }
            } catch {
              // Quietly fail if face not found
            }
          }
        }
      }, 2000);
    }
    return () => clearInterval(scanInterval);
  }, [isScanning, cooldown]);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      {/* Navbar */}
      <nav className="bg-white shadow px-6 py-4 flex justify-between sticky top-0 z-50">
        <h1 className="text-xl font-bold flex items-center gap-2 text-slate-900">
          <ShieldCheck className="text-blue-600" /> Smart<span className="text-blue-600">Attendance</span>
        </h1>
        <div className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-xs font-bold tracking-wide">ADMIN PANEL</div>
      </nav>

      <div className="p-6 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* LEFT: Camera Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 relative overflow-hidden">
            {/* Header */}
            <div className="flex justify-between mb-4 px-2">
              <h2 className="font-bold text-slate-700 flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${isScanning ? 'bg-red-500 animate-pulse' : 'bg-slate-400'}`}></div>
                Live Feed
              </h2>
              <span className="text-xs font-mono text-slate-400">{isScanning ? "MONITORING ACTIVE" : "SYSTEM IDLE"}</span>
            </div>

            {/* Camera Box */}
            <div className="aspect-video bg-black rounded-xl overflow-hidden relative shadow-inner">
              <Webcam ref={webcamRef} screenshotFormat="image/jpeg" className="w-full h-full object-cover" />

              {/* Scanning Line */}
              {isScanning && !successMsg && (
                <div className="absolute top-0 left-0 w-full h-1 bg-blue-500 shadow-[0_0_20px_blue] animate-scan opacity-80"></div>
              )}

              {/* Success Overlay */}
              {successMsg && (
                <div className="absolute inset-0 bg-white/95 flex flex-col items-center justify-center z-10 animate-fade-in">
                  <CheckCircle size={64} className="text-green-500 mb-4 animate-bounce" />
                  <h2 className="text-3xl font-bold text-slate-800">Verified</h2>
                  <p className="text-slate-500 mt-2 text-lg">Marked Present: <span className="text-blue-600 font-bold">{successMsg}</span></p>
                </div>
              )}
            </div>

            {/* Main Button */}
            <button
              onClick={() => setIsScanning(!isScanning)}
              className={`w-full mt-6 py-4 rounded-xl font-bold text-lg transition-all shadow-md active:scale-95 
                    ${isScanning
                  ? 'bg-red-50 text-red-600 border border-red-100 hover:bg-red-100'
                  : 'bg-slate-900 text-white hover:bg-slate-800'}`}
            >
              {isScanning ? "STOP SURVEILLANCE" : "START ATTENDANCE SYSTEM"}
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col items-center">
              <div className="bg-blue-50 p-3 rounded-full mb-3"><Users className="text-blue-600" size={24} /></div>
              <div className="text-3xl font-bold text-slate-900">{stats.total_students}</div>
              <div className="text-xs font-bold text-slate-400 tracking-wider">TOTAL REGISTERED</div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col items-center">
              <div className="bg-green-50 p-3 rounded-full mb-3"><CheckCircle className="text-green-600" size={24} /></div>
              <div className="text-3xl font-bold text-slate-900">{stats.present_today}</div>
              <div className="text-xs font-bold text-slate-400 tracking-wider">PRESENT TODAY</div>
            </div>
          </div>
        </div>

        {/* RIGHT: Logs Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 h-[700px] flex flex-col">
          <div className="p-6 border-b border-slate-100">
            <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
              <Activity size={20} className="text-blue-500" /> Recent Activity
            </h3>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
            {logs.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-300">
                <Clock size={48} className="mb-4 opacity-50" />
                <p>No records yet</p>
              </div>
            ) : (
              logs.map((log, i) => (
                <div key={i} className="flex items-center gap-4 p-4 hover:bg-slate-50 rounded-xl transition-all border border-transparent hover:border-slate-100">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-full flex items-center justify-center font-bold shadow-md">
                    {log.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-slate-800">{log.name}</p>
                    <p className="text-xs text-slate-400">{log.date}</p>
                  </div>
                  <span className="text-xs font-mono font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded">
                    {log.time}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes scan { 0% {top:0%} 100% {top:100%} }
        .animate-scan { animation: scan 2s infinite linear; }
      `}</style>
    </div>
  );
};

export default Dashboard;
