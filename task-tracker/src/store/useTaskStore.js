import { create } from "zustand";
import useMessageStore from "./useMessageStore";

// Helper function to load tasks from local storage
const loadTasksFromLocalStorage = () => {
  const tasks = localStorage.getItem("tasks");
  return tasks ? JSON.parse(tasks) : [];
};

// Helper function to save tasks to local storage
const saveTasksToLocalStorage = (tasks) => {
  localStorage.setItem("tasks", JSON.stringify(tasks));
};

const useTaskStore = create((set) => ({
  tasks: loadTasksFromLocalStorage(),
  addTask: (task) => {
    try {
      if (!task.title.trim()) {
        throw new Error("Task name cannot be empty");
      }
      set((state) => {
        const updatedTasks = [...state.tasks, task];
        saveTasksToLocalStorage(updatedTasks);
        return { tasks: updatedTasks };
      });
      useMessageStore
        .getState()
        .setMessage("Task added successfully", "success");
    } catch (error) {
      useMessageStore.getState().setMessage(error.message, "error");
    }
  },
  removeTask: (id) => {
    try {
      set((state) => {
        const updatedTasks = state.tasks.filter((task) => task.id !== id);
        saveTasksToLocalStorage(updatedTasks);
        return { tasks: updatedTasks };
      });
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
        saveTasksToLocalStorage(updatedTasks);
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
      const tasks = data.slice(0, 5);
      set({ tasks });
      saveTasksToLocalStorage(tasks);
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
