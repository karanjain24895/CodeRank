import React from "react";

import {
  NavLink,
  Link,
  useNavigate,
} from "react-router-dom";

import {
  LogOut,
} from "lucide-react";

import useAuthStore from "../store/useAuthStore";
import axiosInstance from "../lib/axios";

const Navbar = () => {

  const navigate =
    useNavigate();

  const {
    authUser,
    setAuthUser,
  } = useAuthStore();

  const handleLogout = async () => {

    try {

      await axiosInstance.post("/auth/logout");

    } catch (error) {

      console.log(error);

    } finally {

      localStorage.clear();

      sessionStorage.clear();

      setAuthUser(null);

      navigate("/");
    }
  };

  const navLinkClass =
    ({ isActive }) =>
      `rounded-2xl px-5 btn border-none transition-all duration-200 ${isActive
        ? "bg-primary text-primary-content"
        : "btn-ghost"
      }`;

  return (

    <div className="sticky top-0 z-50 backdrop-blur bg-base-100/80 border-b border-base-300">

      <div className="w-full px-6 h-20 flex items-center justify-between">

        {/* Logo */}
        <Link
          to={
            authUser
              ? "/new-tests"
              : "/"
          }
          className="text-3xl font-extrabold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
        >
          CodeRank
        </Link>

        {/* Right Side */}
        <div className="flex items-center gap-3">

          {!authUser ? (
            <>
              {/* Login */}
              <Link
                to="/login"
                className="btn btn-ghost rounded-2xl px-6"
              >
                Login
              </Link>

              {/* Signup */}
              <Link
                to="/signup"
                className="btn btn-primary rounded-2xl px-6"
              >
                Sign Up
              </Link>
            </>
          ) : (
            <>
              {/* New Tests */}
              <NavLink
                to="/new-tests"
                className={navLinkClass}
              >
                New Tests
              </NavLink>

              {/* Attempted Tests */}
              <NavLink
                to="/attempted-tests"
                className={navLinkClass}
              >
                Attempted Tests
              </NavLink>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="btn btn-error rounded-2xl px-5"
              >
                <LogOut size={18} />

                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;