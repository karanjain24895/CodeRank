import React from "react";
import { AlertTriangle } from "lucide-react";

const ConfirmBox = ({
  isOpen,
  title = "Confirmation",
  message = "Are you sure?",
  confirmText = "OK",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">

      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* Modal */}
      <div className="relative w-[90%] max-w-md bg-base-100 rounded-2xl border border-base-300 shadow-2xl p-6 animate-in fade-in zoom-in duration-200">

        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center">
            <AlertTriangle
              size={24}
              className="text-warning"
            />
          </div>

          <div>
            <h2 className="text-lg font-bold">
              {title}
            </h2>
          </div>
        </div>

        <p className="text-base-content/70 text-sm leading-relaxed mb-6">
          {message}
        </p>

        <div className="flex justify-end gap-3">

          <button
            onClick={onCancel}
            className="btn btn-outline rounded-xl"
          >
            {cancelText}
          </button>

          <button
            onClick={onConfirm}
            className="btn btn-primary rounded-xl"
          >
            {confirmText}
          </button>

        </div>
      </div>
    </div>
  );
};

export default ConfirmBox;