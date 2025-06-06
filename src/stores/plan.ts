import type { StateCreator } from "zustand";
import type { PlanResponse } from "../dtos/PlanDTO";

interface PlanSlice {
  plans: PlanResponse[] | undefined;
  setPlans: (
    plans:
      | ((plans: PlanResponse[] | undefined) => PlanResponse[] | undefined)
      | PlanResponse[]
      | undefined
  ) => void;
}

const createPlanSlice: StateCreator<PlanSlice> = (set) => ({
  plans: undefined,
  setPlans: (plans) => {
    set((state) => {
      if (typeof plans === "function") {
        return { plans: plans(state.plans) };
      }
      return { plans };
    });
  },
});

export { createPlanSlice };
export type { PlanSlice };
