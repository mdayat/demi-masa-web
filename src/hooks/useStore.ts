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
  setUser: (user: User | undefined) => void;
}

const useStore = create<States & Actions>((set) => ({
  user: undefined,
  setUser: (user) => set(() => ({ user })),
}));

export { useStore };
export type { User };
