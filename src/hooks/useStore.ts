import { create } from "zustand";

type AccountType = "FREE" | "PREMIUM";

interface User {
  idToken: string;
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  phoneVerified: boolean;
  accountType: AccountType;
}

type TransactionStatus = "UNPAID" | "PAID" | "FAILED" | "EXPIRED" | "REFUND";

interface Transaction {
  id: string;
  status: TransactionStatus;
  qr_url: string;
  paid_at: string;
  expired_at: string;
  price: number;
  duration_in_months: number;
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
  transactions: Transaction[] | undefined;
  subscriptionPlans: SubscriptionPlanMap | undefined;
}

interface Actions {
  setUser: (
    user: ((user: User | undefined) => User | undefined) | User | undefined
  ) => void;
  setTransactions: (
    transactions:
      | ((transactions: Transaction[] | undefined) => Transaction[] | undefined)
      | Transaction[]
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
  transactions: undefined,
  subscriptionPlans: undefined,
  setUser: (user) => {
    set((state) => {
      if (typeof user === "function") {
        return { user: user(state.user) };
      }
      return { user };
    });
  },
  setTransactions: (transactions) => {
    set((state) => {
      if (typeof transactions === "function") {
        return { transactions: transactions(state.transactions) };
      }
      return { transactions };
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
  Transaction,
  TransactionStatus,
  SubscriptionPlan,
  SubscriptionPlanMap,
};
