import { create } from "zustand";

const useConfirmStore = create((set, get) => ({
  isOpen: false,
  message: "",
  resolve: null,

  showConfirm: (message) => {
    return new Promise((resolve) => {
      set({
        isOpen: true,
        message,
        resolve,
      });
    });
  },

  confirm: (password) => {
    const deletePassword = import.meta.env.VITE_DELETE_PASSWORD || "";
    if (password === deletePassword) {
      const { resolve } = get();
      if (resolve) resolve(true);
      set({ isOpen: false, message: "", resolve: null });
      return true;
    }
    return false;
  },

  cancel: () => {
    const { resolve } = get();
    if (resolve) resolve(false);
    set({ isOpen: false, message: "", resolve: null });
  },
}));

export default useConfirmStore;
