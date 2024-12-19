import { create } from "zustand";

type IndonesiaTimeZone = "Asia/Jakarta" | "Asia/Makassar" | "Asia/Jayapura";
const WIBTimeZone: IndonesiaTimeZone = "Asia/Jakarta";
const WITATimeZone: IndonesiaTimeZone = "Asia/Makassar";
const WITTimeZone: IndonesiaTimeZone = "Asia/Jayapura";

type AccountType = "FREE" | "PREMIUM";

interface User {
  idToken: string;
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  phoneVerified: boolean;
  accountType: AccountType;
  timeZone: IndonesiaTimeZone | undefined;
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

interface ToDoList {
  id: string;
  name: string;
  description: string;
  checked: boolean;
}

type PrayerStatus = "ON_TIME" | "LATE" | "MISSED";
type PrayerName = "Subuh" | "Zuhur" | "Asar" | "Magrib" | "Isya";

interface Prayer {
  id: string;
  name: PrayerName;
  unix_time: number;
  status: PrayerStatus | undefined;
}

// the value of the map will only have 3 length
// the first index is the number of missed salat
// the second index is the number of late salat
// the third index is the number of on time salat
type PrayerStatistic = Map<PrayerName, number[]>;

interface States {
  user: User | undefined;
  transactions: Transaction[] | undefined;
  subscriptionPlans: SubscriptionPlanMap | undefined;
  toDoLists: ToDoList[] | undefined;
  prayers: Prayer[] | undefined;
  prayerStatistic: PrayerStatistic | undefined;
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
  setToDoLists: (
    toDoLists:
      | ((toDoLists: ToDoList[] | undefined) => ToDoList[] | undefined)
      | ToDoList[]
      | undefined
  ) => void;
  setPrayers: (
    prayers:
      | ((prayers: Prayer[] | undefined) => Prayer[] | undefined)
      | Prayer[]
      | undefined
  ) => void;
  setPrayerStatistic: (
    prayerStatistic:
      | ((
          prayerStatistic: PrayerStatistic | undefined
        ) => PrayerStatistic | undefined)
      | PrayerStatistic
      | undefined
  ) => void;
}

const useStore = create<States & Actions>((set) => ({
  user: undefined,
  transactions: undefined,
  subscriptionPlans: undefined,
  toDoLists: undefined,
  prayers: undefined,
  prayerStatistic: undefined,
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
  setToDoLists: (toDoLists) => {
    set((state) => {
      if (typeof toDoLists === "function") {
        return {
          toDoLists: toDoLists(state.toDoLists),
        };
      }
      return { toDoLists };
    });
  },
  setPrayers: (prayers) => {
    set((state) => {
      if (typeof prayers === "function") {
        return {
          prayers: prayers(state.prayers),
        };
      }
      return { prayers };
    });
  },
  setPrayerStatistic: (prayerStatistic) => {
    set((state) => {
      if (typeof prayerStatistic === "function") {
        return {
          prayerStatistic: prayerStatistic(state.prayerStatistic),
        };
      }
      return { prayerStatistic };
    });
  },
}));

export { useStore, WIBTimeZone, WITATimeZone, WITTimeZone };
export type {
  User,
  AccountType,
  Transaction,
  TransactionStatus,
  SubscriptionPlan,
  SubscriptionPlanMap,
  IndonesiaTimeZone,
  ToDoList,
  Prayer,
  PrayerStatus,
  PrayerStatistic,
  PrayerName,
};
