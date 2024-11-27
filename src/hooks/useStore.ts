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
  upgradedAt: string;
  expiredAt: string;
}

type PaymentStatus = "paid" | "unpaid";

interface TxHistory {
  orderID: string;
  status: PaymentStatus;
  amount: number;
  subscriptionDuration: number;
  paidAt: string;
}

interface States {
  user: User | undefined;
  txHistories: TxHistory[] | undefined;
}

interface Actions {
  setUser: (
    user: ((user: User | undefined) => User | undefined) | User | undefined
  ) => void;
  setTxHistories: (
    txHistory:
      | ((txHistories: TxHistory[] | undefined) => TxHistory[] | undefined)
      | TxHistory[]
      | undefined
  ) => void;
}

const useStore = create<States & Actions>((set) => ({
  user: undefined,
  txHistories: undefined,
  setUser: (user) => {
    set((state) => {
      if (typeof user === "function") {
        return { user: user(state.user) };
      }
      return { user };
    });
  },
  setTxHistories: (txHistories) => {
    set((state) => {
      if (typeof txHistories === "function") {
        return { txHistories: txHistories(state.txHistories) };
      }
      return { txHistories };
    });
  },
}));

export { useStore };
export type { User, AccountType, TxHistory, PaymentStatus };
