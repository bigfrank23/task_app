import { create } from "zustand";

const useTaskUIStore = create((set) => ({
  checkedTasks: {},
  searchQuery: '',
  
  //Toggle CheckBox
  toggleChecked: (id) =>
    set((state) => ({
      checkedTasks: {
        ...state.checkedTasks,
        [id]: !state.checkedTasks[id],
      },
    })),

     // Set search query
  setSearchQuery: (query) => set({ searchQuery: query }),
  
  // Clear search
  clearSearch: () => set({ searchQuery: "" }),
}));

export default useTaskUIStore;
