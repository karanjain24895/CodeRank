import React, { useState } from "react";

import {
  User,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import axiosInstance from "../../lib/axios";

import useAuthStore from "../../store/useAuthStore";

const Login = () => {

  const navigate =
    useNavigate();

  const setAuthUser =
    useAuthStore(
      (state) =>
        state.setAuthUser
    );

  const [
    showPassword,
    setShowPassword,
  ] = useState(false);

  const [
    formData,
    setFormData,
  ] = useState({
    username: "",
    password: "",
  });

  const [
    loading,
    setLoading,
  ] = useState(false);

  const handleChange = (
    e
  ) => {

    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });
  };

  const handleSubmit =
    async (e) => {

      e.preventDefault();

      try {

        setLoading(true);

        const response =
          await axiosInstance.post(
            "/auth/login",
            formData
          );

        const user =
          response.data;

        setAuthUser(user);

        navigate(
          "/new-tests"
        );

      } catch (error) {

        console.log(
          error.response
            ?.data
            ?.message
        );

      } finally {

        setLoading(false);
      }
    };

  return (

  <div className="min-h-screen bg-gradient-to-br from-base-300 via-base-200 to-base-100 flex items-center justify-center px-4 py-6">

    <div className="w-full max-w-sm bg-base-100 rounded-2xl shadow-xl border border-base-300 p-6">

      {/* Header */}
      <div className="text-center mb-6">

        <h1 className="text-3xl font-extrabold leading-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">

          Welcome Back

        </h1>

        <p className="text-base-content/70 mt-2 text-sm">

          Login to continue coding 🚀

        </p>
      </div>

      {/* Form */}
      <form
        onSubmit={
          handleSubmit
        }
        className="space-y-5"
      >

        {/* Username */}
        <div className="space-y-2">

          <label className="block text-sm font-semibold text-base-content">

            Username

          </label>

          <div className="w-full">

            <label className="input input-bordered w-full rounded-xl flex items-center gap-3 h-12 px-4">

              <User
                size={18}
                className="text-base-content/60 shrink-0"
              />

              <input
                type="text"
                name="username"
                placeholder="Enter username"
                className="grow bg-transparent text-sm"
                value={
                  formData.username
                }
                onChange={
                  handleChange
                }
                required
              />
            </label>
          </div>
        </div>

        {/* Password */}
        <div className="space-y-2">

          <label className="block text-sm font-semibold text-base-content">

            Password

          </label>

          <div className="w-full">

            <label className="input input-bordered w-full rounded-xl flex items-center gap-3 h-12 px-4">

              <Lock
                size={18}
                className="text-base-content/60 shrink-0"
              />

              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                name="password"
                placeholder="Enter password"
                className="grow bg-transparent text-sm"
                value={
                  formData.password
                }
                onChange={
                  handleChange
                }
                required
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(
                    !showPassword
                  )
                }
                className="cursor-pointer text-base-content/60 hover:text-base-content transition-colors"
              >

                {showPassword ? (

                  <EyeOff
                    size={18}
                  />

                ) : (

                  <Eye
                    size={18}
                  />
                )}
              </button>
            </label>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="btn btn-primary w-full rounded-xl h-12 min-h-0 text-base font-bold mt-1"
          disabled={
            loading
          }
        >

          {loading
            ? "Logging In..."
            : "Login"}

        </button>
      </form>

      {/* Footer */}
      <p className="text-center text-base-content/70 mt-6 text-sm">

        Don’t have an account?

        <Link
          to="/signup"
          className="text-primary font-bold ml-1 hover:underline"
        >
          Sign Up
        </Link>
      </p>
    </div>
  </div>
);
};

export default Login;