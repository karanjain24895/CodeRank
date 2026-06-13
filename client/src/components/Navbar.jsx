import { useState, useRef, useEffect } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { Code2, ListChecks, LogOut, ChevronDown, Sparkles, Sun, Moon } from "lucide-react";
import useAuthStore from "../store/useAuthStore";
import axiosInstance from "../lib/axios";
import GenerateTestModal from "./GenerateTestModal";

const Navbar = () => {
  const navigate = useNavigate();
  const { authUser, setAuthUser } = useAuthStore();
  const [open, setOpen] = useState(false);
  const [showGenerateTest, setShowGenerateTest] = useState(false);
  const [generateMode, setGenerateMode] = useState("coding");
  const dropdownRef = useRef(null);

  const [theme, setTheme] = useState(() => {
    // Default is always "light" for new visitors.
    // Only honour an explicitly saved user preference.
    const saved = localStorage.getItem("theme");
    return saved === "dark" || saved === "light" ? saved : "light";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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

  const navLinkClass = ({ isActive }) =>
    `rounded-xl px-3 h-9 min-h-0 text-sm btn border-none transition-all duration-200 ${isActive ? "bg-primary text-primary-content" : "btn-ghost"
    }`;

  const openGenerateModal = (mode) => {
    setGenerateMode(mode);
    setShowGenerateTest(true);
  };

  // initials for avatar
  const getInitials = (name = "") =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();

  return (
    <div className="sticky top-0 z-50 backdrop-blur bg-base-100/80 border-b border-base-300">
      <div className="w-full px-4 h-14 flex items-center justify-between">

        {/* Logo */}
        <Link
          to={authUser ? "/new-tests" : "/"}
          className="text-2xl font-extrabold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
        >
          CodeRank
        </Link>

        {/* Right Side */}
        <div className="flex items-center gap-2">

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="btn btn-ghost btn-circle w-9 h-9 min-h-0 text-base-content/80 hover:bg-base-200 transition-colors"
            title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {!authUser ? (
            <>
              <Link to="/login" className="btn btn-ghost rounded-xl px-4 h-9 text-sm">
                Login
              </Link>

              <Link to="/signup" className="btn btn-primary rounded-xl px-4 h-9 text-sm">
                Sign Up
              </Link>
            </>
          ) : (
            <>
              <NavLink to="/new-tests" className={navLinkClass}>
                Home
              </NavLink>

              {/* Generate Test Dropdown */}
              <div className="dropdown dropdown-bottom dropdown-end">
                <button
                  tabIndex={0}
                  role="button"
                  className="btn btn-primary rounded-xl px-4 h-9 min-h-0 text-sm gap-1.5 bg-gradient-to-r from-primary to-secondary text-primary-content border-none shadow-md shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center"
                >
                  <Sparkles size={14} className="animate-pulse" />
                  Generate with AI
                  <ChevronDown size={14} className="opacity-80" />
                </button>
                <ul
                  tabIndex={0}
                  className="dropdown-content menu p-1.5 shadow-2xl bg-base-100 border border-base-300 rounded-2xl w-52 mt-1.5 z-[60] gap-0.5"
                >
                  <li>
                    <button
                      type="button"
                      onClick={() => openGenerateModal("coding")}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-base-200 text-left text-sm font-semibold"
                    >
                      <Code2 size={16} className="text-primary" />
                      Coding Test
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => openGenerateModal("mcq")}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-base-200 text-left text-sm font-semibold"
                    >
                      <ListChecks size={16} className="text-secondary" />
                      MCQ Test
                    </button>
                  </li>
                </ul>
              </div>

              {/* PROFILE DROPDOWN */}
              <div className="relative" ref={dropdownRef}>
                {/* Avatar Button */}
                <button
                  onClick={() => setOpen(!open)}
                  className="w-9 h-9 rounded-full bg-gradient-to-r from-primary to-secondary text-white flex items-center justify-center font-bold shadow-md"
                >
                  {getInitials(authUser?.name || authUser?.username)}
                </button>

                {/* Dropdown */}
                {open && (
                  <div className="absolute right-0 mt-2 w-56 bg-base-100 border border-base-300 shadow-xl rounded-2xl overflow-hidden z-50">

                    <div className="p-3 border-b border-base-300">
                      <p className="text-sm font-bold">
                        {authUser?.name}
                      </p>
                      <p className="text-xs text-base-content/60">
                        @{authUser?.username}
                      </p>
                    </div>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-3 text-sm hover:bg-base-200 text-red-500"
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      <GenerateTestModal
        isOpen={showGenerateTest}
        mode={generateMode}
        onClose={() => setShowGenerateTest(false)}
      />
    </div>
  );
};

export default Navbar;
