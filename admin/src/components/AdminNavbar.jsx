import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  FileCode,
  ClipboardList,
  PlusCircle,
  BookOpen,
  Sun,
  Moon,
  ChevronRight,
  Shield,
} from "lucide-react";

const AdminNavbar = () => {
  const [theme, setTheme] = useState(() => {
    // Default is always "light" for new visitors.
    // Only honour an explicitly saved user preference.
    const saved = localStorage.getItem("admin-theme");
    return saved === "dark" || saved === "light" ? saved : "light";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("admin-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const navSections = [
    {
      label: "Overview",
      items: [
        {
          name: "Dashboard",
          path: "/",
          icon: LayoutDashboard,
          end: true,
        },
      ],
    },
    {
      label: "Submissions",
      items: [
        {
          name: "New Submissions",
          path: "/submissions",
          icon: ClipboardList,
          end: true,
        },
        {
          name: "History",
          path: "/submissions/history",
          icon: FileCode,
          end: true,
        },
        {
          name: "Upload Result",
          path: "/submissions/upload-result",
          icon: PlusCircle,
          end: true,
        },
      ],
    },
    {
      label: "Tests",
      items: [
        {
          name: "Created Tests",
          path: "/created-tests",
          icon: LayoutDashboard,
          end: true,
        },
        {
          name: "Create Test",
          path: "/create-test",
          icon: PlusCircle,
          end: true,
        },
        {
          name: "Question Bank",
          icon: BookOpen,
          path: "/question-bank",
          end: true,
        },
      ],
    },
  ];

  return (
    <div className="w-64 h-screen sticky top-0 bg-base-200 border-r border-base-300 flex flex-col shadow-sm">

      {/* Logo / Brand */}
      <div className="px-5 py-6 border-b border-base-300">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-sm">
            <Shield size={18} className="text-primary-content" />
          </div>
          <div>
            <h1 className="text-base font-bold text-base-content leading-tight">
              CodeRank
            </h1>
            <p className="text-[11px] text-base-content/50 font-medium tracking-wide uppercase">
              Admin Panel
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
        {navSections.map((section) => (
          <div key={section.label}>
            <p className="text-[10px] font-bold text-base-content/40 uppercase tracking-widest px-3 mb-1.5">
              {section.label}
            </p>
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.end}
                    className={({ isActive }) =>
                      `group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 font-medium text-sm ${
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "text-base-content/70 hover:bg-base-300/60 hover:text-base-content"
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                            isActive
                              ? "bg-primary text-primary-content shadow-sm"
                              : "bg-base-300/60 text-base-content/60 group-hover:bg-base-300"
                          }`}
                        >
                          <Icon size={16} />
                        </div>
                        <span className="flex-1">{item.name}</span>
                        {isActive && (
                          <ChevronRight size={14} className="text-primary" />
                        )}
                      </>
                    )}
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-base-300">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          type="button"
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-base-content/70 hover:bg-base-300/60 hover:text-base-content transition-all duration-200"
        >
          <div className="w-8 h-8 rounded-lg bg-base-300/60 flex items-center justify-center">
            {theme === "dark" ? (
              <Sun size={16} className="text-warning" />
            ) : (
              <Moon size={16} className="text-primary" />
            )}
          </div>
          <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
        </button>
      </div>
    </div>
  );
};

export default AdminNavbar;
