import React, { useState, useEffect } from "react";
import { Eye, EyeOff, Lock, AlertTriangle } from "lucide-react";
import useConfirmStore from "../store/useConfirmStore";

const ConfirmModal = () => {
  const { isOpen, message, confirm, cancel } = useConfirmStore();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      setPassword("");
      setShowPassword(false);
      setError("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!password) {
      setError("Password is required");
      return;
    }

    const success = confirm(password);
    if (!success) {
      setError("Incorrect password. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 bg-neutral-focus/60 dark:bg-black/70 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
      <div 
        className="bg-base-100 border border-base-300 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-300 scale-100 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Header Icon & Title */}
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-error/10 text-error flex items-center justify-center shrink-0">
              <AlertTriangle size={24} />
            </div>
            <h3 className="text-xl font-bold text-base-content">
              Security Confirmation
            </h3>
            <p className="text-sm text-base-content/75 px-2">
              {message || "Are you sure you want to perform this action? This operation is permanent."}
            </p>
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-base-content/70 uppercase tracking-wider block">
              Enter Admin Password
            </label>
            <div className="relative flex items-center">
              <div className="absolute left-3.5 text-base-content/40">
                <Lock size={18} />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`input input-bordered w-full pl-10 pr-10 rounded-xl h-11 min-h-0 bg-base-200 border-base-300 focus:outline-none focus:border-primary text-sm ${
                  error ? "border-error focus:border-error" : ""
                }`}
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 text-base-content/40 hover:text-base-content/70 transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {error && (
              <span className="text-xs font-medium text-error block mt-1 animate-pulse">
                {error}
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end pt-2">
            <button
              type="button"
              onClick={cancel}
              className="btn btn-ghost flex-1 rounded-xl h-11 min-h-0 text-sm font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-error flex-1 text-white rounded-xl h-11 min-h-0 text-sm font-semibold shadow-md hover:shadow-lg transition-all"
            >
              Confirm Delete
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ConfirmModal;
