import { create } from "zustand";

interface User {
  id: string;
  name: string;
  email: string;
  avatarURL: string;
  idToken: string;
  phoneVerified: boolean;
}

interface States {
  user: User | undefined;
}

interface Actions {
  setUser: (
    user: ((user: User | undefined) => User | undefined) | User | undefined
  ) => void;
}

const useStore = create<States & Actions>((set) => ({
  user: undefined,
  setUser: (user) => {
    set((state) => {
      if (typeof user === "function") {
        return { user: user(state.user) };
      }
      return { user };
    });
  },
}));

export { useStore };
export type { User };
