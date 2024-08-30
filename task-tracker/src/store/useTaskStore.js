import { create } from "zustand";
import useMessageStore from "./useMessageStore";

const useTaskStore = create((set) => ({
  tasks: [],
  addTask: (task) => {
    set((state) => ({ tasks: [...state.tasks, task] }));
  },
  removeTask: (id) => {
    set((state) => ({ tasks: state.tasks.filter((task) => task.id !== id) }));
  },
  toggleTask: (id) => {
    set((state) => {
      const updatedTasks = state.tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      );
      // Sort tasks: incomplete tasks first, completed tasks last
      updatedTasks.sort((a, b) => a.completed - b.completed);
      return { tasks: updatedTasks };
    });
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
