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

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  duration_in_months: number;
}

type SubscriptionPlanMap = Map<string, SubscriptionPlan[]>;

interface States {
  user: User | undefined;
  txHistories: TxHistory[] | undefined;
  subscriptionPlans: SubscriptionPlanMap | undefined;
}

interface Actions {
  setUser: (
    user: ((user: User | undefined) => User | undefined) | User | undefined
  ) => void;
  setTxHistories: (
    txHistories:
      | ((txHistories: TxHistory[] | undefined) => TxHistory[] | undefined)
      | TxHistory[]
      | undefined
  ) => void;
  setSubscriptionPlans: (
    subscriptionPlans:
      | ((
          subscriptionPlans: SubscriptionPlanMap | undefined
        ) => SubscriptionPlanMap | undefined)
      | SubscriptionPlanMap
      | undefined
  ) => void;
}

const useStore = create<States & Actions>((set) => ({
  user: undefined,
  txHistories: undefined,
  subscriptionPlans: undefined,
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
  setSubscriptionPlans: (subscriptionPlans) => {
    set((state) => {
      if (typeof subscriptionPlans === "function") {
        return {
          subscriptionPlans: subscriptionPlans(state.subscriptionPlans),
        };
      }
      return { subscriptionPlans };
    });
  },
}));

export { useStore };
export type {
  User,
  AccountType,
  TxHistory,
  PaymentStatus,
  SubscriptionPlan,
  SubscriptionPlanMap,
};
