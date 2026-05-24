import React from "react";

import {
  LayoutDashboard,
  FileCode,
  ClipboardList,
  LogOut,
  PlusCircle,
} from "lucide-react";

import {
  NavLink,
  useNavigate,
} from "react-router-dom";

const AdminNavbar = () => {

  const navigate =
    useNavigate();

  const handleLogout =
    () => {

      localStorage.clear();

      navigate("/login");
    };

  const navItems = [
    {
      name: "Dashboard",
      path: "/",
      icon: LayoutDashboard,
      end: true,
    },

    {
      name: "New Submissions",
      path: "/submissions",
      icon: ClipboardList,
      end: true,
    },

    {
      name: "Submission History",
      path: "/submissions/history",
      icon: FileCode,
      end: true,
    },

    {
      name: "Create Test",
      path: "/create-test",
      icon: PlusCircle,
      end: true,
    },
  ];

  return (

    <div className="w-72 h-screen sticky top-0 bg-base-200 border-r border-base-300 flex flex-col justify-between shadow-xl">

      <div>

        {/* Logo */}
        <div className="p-6 border-b border-base-300">

          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">

            CodeRank Admin

          </h1>

          <p className="text-sm text-base-content/60 mt-1">

            Manage coding evaluations

          </p>
        </div>

        {/* Nav Links */}
        <div className="p-4 space-y-3">

          {navItems.map((item) => {

            const Icon =
              item.icon;

            return (

              <NavLink
                key={item.path}

                to={item.path}

                end={item.end}

                className={({
                  isActive,
                }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
                    isActive
                      ? "bg-primary text-primary-content shadow-lg"
                      : "hover:bg-base-300"
                  }`
                }
              >

                <Icon size={20} />

                <span>
                  {item.name}
                </span>

              </NavLink>
            );
          })}
        </div>
      </div>

      {/* Logout */}
      <div className="p-4 border-t border-base-300">

        <button
          onClick={handleLogout}

          className="btn btn-error w-full text-white"
        >

          <LogOut size={18} />

          Logout

        </button>
      </div>
    </div>
  );
};

export default AdminNavbar;