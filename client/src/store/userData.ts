import { create } from "zustand";
import { persist } from "zustand/middleware";

type UserData = {
  userName: string | null;
  email: string | null;
  id: string | null;
  photo: string | null;

  setUserName: (userName: string | null) => void;
  setEmail: (email: string | null) => void;
  setId: (id: string | null) => void;
  setPhoto: (photo: string | null) => void;

  setUser: (data: {
    userName: string;
    email: string;
    id: string;
    photo: string;
  }) => void;

  clearUserData: () => void;
};

export const useUserData = create<UserData>()(
  persist(
    (set) => ({
      userName: null,
      email: null,
      id: null,
      photo: null,

      setUserName: (userName) => set({ userName }),
      setEmail: (email) => set({ email }),
      setId: (id) => set({ id }),
      setPhoto: (photo) => set({ photo }),

      // helper مهم جدًا بعد login
      setUser: (data) =>
        set({
          userName: data.userName,
          email: data.email,
          id: data.id,
          photo: data.photo,
        }),

      clearUserData: () =>
        set({
          userName: null,
          email: null,
          id: null,
          photo: null,
        }),
    }),
    {
      name: "user-data", // localStorage key
    }
  )
);