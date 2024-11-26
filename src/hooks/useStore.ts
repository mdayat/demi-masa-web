import { create } from "zustand";

type AccountType = "free" | "premium";

interface User {
  idToken: string;
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  phoneVerified: boolean;
  accountType: AccountType;
  expiredAt: string;
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
export type { User, AccountType };
