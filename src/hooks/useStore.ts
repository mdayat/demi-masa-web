import { create } from "zustand";

interface User {
  name: string;
  email: string;
  avatarURL: string;
  idToken: string;
}

interface States {
  loggedInWithGoogle: boolean;
  user: User | undefined;
}

interface Actions {
  setLoggedInWithGoogle: (value: boolean) => void;
  setUser: (user: User | undefined) => void;
}

const useStore = create<States & Actions>((set) => ({
  loggedInWithGoogle: false,
  user: undefined,
  setLoggedInWithGoogle: (value) => set(() => ({ loggedInWithGoogle: value })),
  setUser: (user) => set(() => ({ user })),
}));

export { useStore };
