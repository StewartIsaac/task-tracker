import { create } from "zustand";
import useMessageStore from "./useMessageStore";

const useTaskStore = create((set) => ({
  tasks: [],
  addTask: (task) => {
    try {
      if (!task.title.trim()) {
        throw new Error("Task name cannot be empty");
      }
      set((state) => ({ tasks: [...state.tasks, task] }));
      useMessageStore
        .getState()
        .setMessage("Task added successfully", "success");
    } catch (error) {
      useMessageStore.getState().setMessage(error.message, "error");
    }
  },
  removeTask: (id) => {
    try {
      set((state) => ({ tasks: state.tasks.filter((task) => task.id !== id) }));
      useMessageStore
        .getState()
        .setMessage("Task removed successfully", "success");
    } catch (error) {
      useMessageStore.getState().setMessage("Error removing task", "error");
    }
  },
  toggleTask: (id) => {
    try {
      set((state) => {
        const updatedTasks = state.tasks.map((task) =>
          task.id === id ? { ...task, completed: !task.completed } : task
        );
        // Sort tasks: incomplete tasks first, completed tasks last
        updatedTasks.sort((a, b) => a.completed - b.completed);
        return { tasks: updatedTasks };
      });
      useMessageStore
        .getState()
        .setMessage("Task toggled successfully", "success");
    } catch (error) {
      useMessageStore.getState().setMessage("Error toggling task", "error");
    }
  },
  fetchTasks: async () => {
    try {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/todos"
      );
      const data = await response.json();
      set({ tasks: data.slice(0, 5) });
      useMessageStore
        .getState()
        .setMessage("Tasks fetched successfully", "success");
    } catch (error) {
      console.error("Error fetching tasks:", error);
      useMessageStore.getState().setMessage("Error fetching tasks", "error");
    }
  },
}));

export default useTaskStore;
