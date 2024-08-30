import { create } from "zustand";

const useMessageStore = create((set) => ({
  message: null,
  messageType: null,
  setMessage: (message, messageType) => set({ message, messageType }),
  clearMessage: () => set({ message: null, messageType: null }),
}));

export default useMessageStore;
