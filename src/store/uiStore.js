import { create } from "zustand";

const useUIStore = create((set) => ({
  searchTerm: "",
  selectedCategory: "All Categories",
  isSidebarOpen: true,

  setSearchTerm: (term) => set({ searchTerm: term }),
  setSelectedCategory: (category) => set({ selectedCategory: category }),
  toggleSidebar: () =>
    set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  openSidebar: () => set({ isSidebarOpen: true }),
  closeSidebar: () => set({ isSidebarOpen: false }),

  // Reset filters
  resetFilters: () =>
    set({ searchTerm: "", selectedCategory: "All Categories" }),
}));

export default useUIStore;
