import React, { useState, useRef } from "react";
import Webcam from "react-webcam";
import { registerStudent } from "../api";
import { UserPlus, Camera, CheckCircle, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Register = () => {
    const webcamRef = useRef(null);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({ name: "", email: "", dept: "MCA", password: "", confirmPassword: "" });
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null); // { type: 'success' | 'error', text: '' }

    // 1. Capture Photo
    const capture = () => {
        if (webcamRef.current) {
            const imageSrc = webcamRef.current.getScreenshot();
            setImage(imageSrc);
        }
    };

    // 2. Retake Photo
    const retake = () => {
        setImage(null);
        setMessage(null);
    };

    // 3. Submit Data
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!image) return setMessage({ type: "error", text: "Please capture a photo first!" });
        if (formData.password.length < 6) return setMessage({ type: "error", text: "Password must be at least 6 characters." });
        if (formData.password !== formData.confirmPassword) {
            return setMessage({ type: "error", text: "Password and confirm password do not match." });
        }

        setLoading(true);
        setMessage(null);

        try {
            await registerStudent({
                name: formData.name,
                email: formData.email,
                dept: formData.dept,
                password: formData.password,
                image,
            });
            setMessage({ type: "success", text: "Registration successful. You can login now." });

            // 2 Second baad Dashboard par bhej do
            setTimeout(() => navigate("/login"), 2000);

        } catch (error) {
            console.error("Registration Error:", error);
            let apiMessage = "Registration failed. Please retry with better lighting and a front face.";

            if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
                apiMessage = "Server timed out. The AI model is waking up, please try again.";
            } else if (error?.response?.data?.error) {
                apiMessage = error.response.data.error;
            } else if (error?.response?.data?.message) {
                apiMessage = error.response.data.message;
            }

            setMessage({ type: "error", text: apiMessage });
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-200 w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8">

                {/* LEFT: Form Section */}
                <div className="space-y-6">
                    <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                        <UserPlus className="text-blue-600" /> New Registration
                    </h1>
                    <p className="text-slate-500 text-sm">Enter student details and capture a clear face photo.</p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">Full Name</label>
                            <input
                                type="text" required
                                value={formData.name}
                                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="Enter Name with roll no"
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">Email ID</label>
                            <input
                                type="email" required
                                value={formData.email}
                                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="Ex: name@college.edu"
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">Department</label>
                            <input
                                type="text"
                                value="Master of Computer Applications (MCA)"
                                disabled
                                className="w-full p-3 border border-slate-300 rounded-lg outline-none bg-slate-100 text-slate-600"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">Password</label>
                            <input
                                type="password"
                                required
                                minLength={6}
                                value={formData.password}
                                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="Minimum 6 characters"
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">Confirm Password</label>
                            <input
                                type="password"
                                required
                                minLength={6}
                                value={formData.confirmPassword}
                                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="Re-enter password"
                                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                            />
                        </div>

                        {/* Status Messages */}
                        {message && (
                            <div className={`p-3 rounded-lg flex items-center gap-2 ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                {message.type === 'success' ? <CheckCircle size={18} /> : <XCircle size={18} />}
                                {message.text}
                            </div>
                        )}

                        {/* Buttons */}
                        <div className="pt-4 flex gap-4">
                            <button
                                type="button"
                                onClick={() => navigate("/")}
                                className="flex-1 py-3 text-slate-600 font-bold hover:bg-slate-100 rounded-xl transition"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit" disabled={loading}
                                className={`flex-1 py-3 text-white font-bold rounded-xl transition shadow-md flex justify-center items-center gap-2
                        ${loading ? 'bg-slate-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
                            >
                                {loading ? "Processing..." : "Register Now"}
                            </button>
                        </div>
                    </form>
                </div>

                {/* RIGHT: Camera Section */}
                <div className="flex flex-col items-center justify-center bg-slate-50 rounded-xl p-4 border border-slate-200">
                    <div className="relative w-full aspect-square md:aspect-video bg-black rounded-lg overflow-hidden shadow-inner mb-4">
                        {image ? (
                            <img src={image} alt="Captured" className="w-full h-full object-cover" />
                        ) : (
                            <Webcam
                                ref={webcamRef}
                                screenshotFormat="image/jpeg"
                                className="w-full h-full object-cover"
                            />
                        )}
                    </div>

                    {!image ? (
                        <button
                            type="button" onClick={capture}
                            className="w-full py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 flex items-center justify-center gap-2"
                        >
                            <Camera size={20} /> Capture Photo
                        </button>
                    ) : (
                        <button
                            type="button" onClick={retake}
                            className="w-full py-3 bg-white border-2 border-slate-300 text-slate-700 font-bold rounded-xl hover:bg-slate-100"
                        >
                            Retake Photo
                        </button>
                    )}
                    <p className="text-xs text-slate-400 mt-2 text-center">
                        Make sure lighting is good and face is clearly visible.
                    </p>
                </div>

            </div>
        </div>
    );
};

export default Register;
