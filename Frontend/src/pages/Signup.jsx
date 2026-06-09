import React, { useState } from "react";
import { Link } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";

const Signup = () => {
  const { signup, isSigningUp } = useAuthStore();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await signup(formData);
    setFormData({
      name: "",
      email: "",
      password: "",
    });
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-sky-50 px-4 py-10">
      <div className="w-full max-w-5xl overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-2xl shadow-indigo-100/70">
        <div className="grid md:grid-cols-2">
          <div className="hidden bg-gradient-to-br from-indigo-600 to-sky-500 p-10 text-white md:flex md:flex-col md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-indigo-100">Talkify</p>
              <h2 className="mt-4 text-3xl font-semibold">Create your account</h2>
              <p className="mt-3 text-sm text-indigo-100/90">
                Join Talkify and start chatting with friends in a polished and easy-to-use space.
              </p>
            </div>
            <div className="rounded-2xl border border-white/20 bg-white/10 p-4 text-sm backdrop-blur">
              <p className="font-medium">Start chatting instantly</p>
              <p className="mt-2 text-indigo-100/90">Fast sign-up, friendly UI, and reliable messaging.</p>
            </div>
          </div>

          <form className="flex flex-col p-8 sm:p-10" onSubmit={handleSubmit}>
            <div className="text-center md:text-left">
              <h2 className="text-3xl font-semibold text-gray-900">Sign Up</h2>
              <p className="mt-2 text-sm text-gray-500">Signup to your account.</p>
            </div>

            <div className="mt-8 space-y-5">
              <div>
                <label className="text-sm font-medium text-gray-700">Name</label>
                <input
                  placeholder="Please enter your name"
                  className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                  required
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Email</label>
                <input
                  placeholder="Please enter your email"
                  className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                  required
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Password</label>
                <input
                  placeholder="Please enter your password"
                  className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                  required
                  type="password"
                  name="password"
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
            </div>

            <button
              type="submit"
              className="mt-8 w-full rounded-xl bg-indigo-600 py-3 font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-70"
              disabled={isSigningUp}
            >
              {isSigningUp ? "Loading..." : "Sign up"}
            </button>

            <p className="mt-6 text-center text-sm text-gray-500">
              Already have an account?{" "}
              <Link to="/login" className="font-medium text-indigo-600 hover:underline">
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </main>
  );
};

export default Signup;
