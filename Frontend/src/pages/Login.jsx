import React, { useState } from "react";
import { Link } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";



const Login = () => {
  const {login , isLoggingIn } = useAuthStore();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
   
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
      await login(formData);
      setFormData({
    email: "",
    password: "",
  });
  };

  return (
    <main className="flex items-center justify-center w-full px-4">
      <form
        className="flex w-full flex-col max-w-96"
        onSubmit={handleSubmit}
      >
        <h2 className="text-4xl font-medium text-gray-900">Login</h2>

        <p className="mt-4 text-base text-gray-500/90">
          Login to your account.
        </p>


    
        <div className="mt-6">
          <label className="font-medium">Email</label>
          <input
            placeholder="Please enter your email"
            className="mt-2 rounded-md ring ring-gray-200 focus:ring-2 focus:ring-indigo-600 outline-none px-3 py-3 w-full"
            required
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

       
        <div className="mt-6">
          <label className="font-medium">Password</label>
          <input
            placeholder="Please enter your password"
            className="mt-2 rounded-md ring ring-gray-200 focus:ring-2 focus:ring-indigo-600 outline-none px-3 py-3 w-full"
            required
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
        </div>

        <button
          type="submit"
          className="mt-8 py-3 w-full cursor-pointer rounded-md bg-indigo-600 text-white transition hover:bg-indigo-700"
          disabled={isLoggingIn}
        >
          {isLoggingIn ? "Loading..." : "login"}
        </button>

        <p className="text-center py-8">
        Don't have an account?{" "}
          <Link
            to="/SignUp"
            className="text-indigo-600 hover:underline"
          >
            SignUp
          </Link>
        </p>
      </form>
    </main>
  );
};

export default Login;
