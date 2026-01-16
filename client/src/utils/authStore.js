import { create } from 'zustand'
import { devtools, persist } from "zustand/middleware";

// const useAuthStore = create(devtools((set) => ({
//   user: null,
//   setCurrentUser: () => set((newUser) => ({ currentUser: newUser })),
// }),{ name: 'MyZustandStore' }))

// export default useAuthStore

const useAuthStore = create(
  devtools(
    persist(
      (set) => ({
        user: null,
        hasHydrated: false,

        // For login / register (FULL user object)
        setUser: (user) =>
          set({ user }, false, "auth/setUser"),

        // For partial updates (profile, avatar, cover)
        updateUser: (fields) =>
          set(
            (state) => ({
              user: { ...(state.user || {}), ...fields },
            }),
            false,
            "auth/updateUser"
          ),

        logout: () =>
          set({ user: null }, false, "auth/logout"),
      }),
      {
        name: "auth-store", // key in localStorage
        onRehydrateStorage: () => (state) => {
          state.hasHydrated = true;
        },
      }
    )
  )
);

export default useAuthStore;
