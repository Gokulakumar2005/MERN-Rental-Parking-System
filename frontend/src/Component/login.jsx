
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { LoginUser, GoogleLoginUser } from "../slices/authSlices.jsx";
import { useState } from "react";
import { Link } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [error, setError] = useState({});
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const redirect = () => navigate("/dashboard");
  const loginRedirect = () => navigate("/login");

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = {};

    if (formData.email.trim().length === 0) {
      errors.email = "Email is Required";
    }
    if (formData.password.trim().length === 0) {
      errors.password = "Password is Required";
    }

    if (Object.keys(errors).length !== 0) {
      setError(errors);
      return;
    }

    dispatch(LoginUser({ formData, redirect, loginRedirect }));
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-slate-950 text-slate-100 overflow-x-hidden font-['Outfit',_sans-serif]">

      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 blur-[120px] rounded-full pointer-events-none -z-10 animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-green-600/20 blur-[120px] rounded-full pointer-events-none -z-10 animate-pulse delay-700" />

      <div className="flex-1 flex flex-col justify-center px-8 lg:px-20 py-12 lg:py-0">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/30 rounded-full text-blue-400 text-sm font-medium mb-6">
            <span className="w-2 h-2 bg-blue-500 rounded-full animate-ping" />
            Park with Confidence
          </div>
          <h1 className="text-5xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-blue-200 to-green-300 bg-clip-text text-transparent leading-tight">
            Seamless Parking <br /> 
            <span className="text-slate-100">for Modern Cities.</span>
          </h1>
          <p className="text-lg lg:text-xl text-slate-400 mb-10 leading-relaxed max-w-xl">
            We're revolutionizing urban movement. Our platform connects parking space owners with drivers for secure, affordable, and instant reservations.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="group p-6 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition">
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition">
                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Geo-Discovery</h3>
              <p className="text-sm text-slate-400">Discover spaces exactly where you need them with our smart location mapping.</p>
            </div>

            <div className="group p-6 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition">
              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition">
                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Secure Transactions</h3>
              <p className="text-sm text-slate-400">Integrated Razorpay payments ensure your money is safe and bookings are guaranteed.</p>
            </div>

            <div className="group p-6 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition">
              <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition">
                <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Instant Connect</h3>
              <p className="text-sm text-slate-400">Directly chat with space owners within the platform to resolve queries in real-time.</p>
            </div>

            <div className="group p-6 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition">
              <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition">
                <svg className="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Vendor Power</h3>
              <p className="text-sm text-slate-400">Scale your passive income by listing spaces and managing them via an intuitive dashboard.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="lg:w-[450px] flex items-center justify-center px-8 py-12 lg:py-0 bg-slate-900/50 backdrop-blur-3xl border-l border-white/5">
        <div className="w-full max-w-sm">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-3">Welcome Back</h2>
            <p className="text-slate-400">Login to manage your bookings and spaces.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300 ml-1">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  placeholder="name@example.com"
                  onChange={handleChange}
                  onBlur={() => {
                    if (formData.email.trim().length === 0) {
                      setError((prev) => ({ ...prev, email: "Email is Required" }));
                    }
                  }}
                  className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all outline-none"
                />
              </div>
              {error.email && <p className="text-red-400 text-xs mt-1 ml-1 font-medium">{error.email}</p>}
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-sm font-medium text-slate-300">Password</label>
                <Link to="/forgotpassword" data-id="forgot-password-link" className="text-xs font-medium text-blue-400 hover:text-blue-300 transition">Forgot Password?</Link>
              </div>
              <div className="relative">
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  placeholder="••••••••"
                  onChange={handleChange}
                  onBlur={() => {
                    if (formData.password.trim().length === 0) {
                      setError((prev) => ({ ...prev, password: "Password is Required" }));
                    }
                  }}
                  className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all outline-none"
                />
              </div>
              {error.password && <p className="text-red-400 text-xs mt-1 ml-1 font-medium">{error.password}</p>}
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-900/20 transition-all active:scale-[0.98]"
            >
              Access Account
            </button>

            <div className="relative my-4 flex items-center justify-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-800"></div>
              </div>
              <span className="relative bg-slate-900 px-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Or continue with</span>
            </div>

            <div className="flex justify-center w-full">
              <GoogleLogin
                onSuccess={(credentialResponse) => {
                  dispatch(GoogleLoginUser({ credential: credentialResponse.credential, redirect }));
                }}
                onError={() => {
                  console.log('Login Failed');
                }}
                theme="filled_black"
                width="100%"
              />
            </div>
          </form>

          <div className="mt-8 pt-8 border-t border-slate-800/50 text-center">
            <p className="text-slate-400 text-sm">
              Don't have an account?
              <Link to="/register" className="font-bold text-blue-400 hover:text-blue-300 transition">
                Create Account
              </Link>
            </p>
          </div>

          
        </div>
      </div>
    </div>
  );
}
