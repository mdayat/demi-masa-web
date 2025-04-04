import { useState } from "react";
import { useAxiosContext } from "../../contexts/AxiosProvider";
import { useStore } from "../../stores";
import { getCurrentDate } from "@utils/index";
import type { PrayerModel } from "../../models/PrayerModel";
import type { PrayerSchedule } from "./usePrayersViewModel";
import { useToast } from "@hooks/shadcn/useToast";
import type { PrayerStatus } from "../../dtos/PrayerDTO";

interface DeterminePrayerStatusParams {
  nextPrayer: PrayerSchedule;
  currentPrayer: PrayerSchedule;
  currentSunriseDate: Date;
}

function usePrayerViewModel(prayerModel: PrayerModel) {
  const [isLoading, setIsLoading] = useState(false);

  const user = useStore((state) => state.user);
  const setPrayers = useStore((state) => state.setPrayers);
  const setThisMonthPrayers = useStore((state) => state.setThisMonthPrayers);

  const { toast } = useToast();
  const { handleAxiosError } = useAxiosContext();

  const determinePrayerStatus = ({
    nextPrayer,
    currentPrayer,
    currentSunriseDate,
  }: DeterminePrayerStatusParams): PrayerStatus => {
    let nextPrayerTime = 0;
    if (currentPrayer.name === "subuh") {
      nextPrayerTime = currentSunriseDate.getTime() / 1000;
    } else if (currentPrayer.name === "isya") {
      const nextDate = new Date(currentPrayer.date);
      nextDate.setDate(currentPrayer.date.getDate() + 1);

      const nextPrayerTimes = prayerModel.getPrayerTimes(
        user?.latitude ?? 0,
        user?.longitude ?? 0,
        nextDate
      );

      nextPrayerTime = nextPrayerTimes.fajr.getTime() / 1000;
    } else {
      nextPrayerTime = nextPrayer.date.getTime() / 1000;
    }

    const currentPrayerTime = currentPrayer.date.getTime() / 1000;
    const prayerTimeDifference = nextPrayerTime - currentPrayerTime;
    const idealTime = prayerTimeDifference * 0.75;

    const checkedTime = getCurrentDate(user?.timezone ?? "").getTime() / 1000;
    const checkedTimeDifference = checkedTime - currentPrayerTime;

    let status: PrayerStatus = "pending";
    if (checkedTime > nextPrayerTime) {
      status = "missed";
    } else if (idealTime - checkedTimeDifference >= 0) {
      status = "on_time";
    } else if (idealTime - checkedTimeDifference < 0) {
      status = "late";
    }

    return status;
  };

  const checkPrayer = async (id: string, status: PrayerStatus) => {
    setIsLoading(true);
    try {
      const res = await prayerModel.updatePrayer(id, { status });
      if (res.status === 200) {
        toast({
          description: "Berhasil mencentang ibadah.",
          variant: "default",
        });

        setPrayers((prayers) => {
          if (prayers === undefined) {
            return prayers;
          }

          const idx = prayers.findIndex((item) => item.id === id);
          prayers[idx].status = status;
          return [...prayers];
        });

        setThisMonthPrayers((thisMonthPrayers) => {
          if (thisMonthPrayers === undefined) {
            return thisMonthPrayers;
          }

          const idx = thisMonthPrayers.findIndex((item) => item.id === id);
          thisMonthPrayers[idx].status = status;
          return [...thisMonthPrayers];
        });
      }
    } catch (error) {
      handleAxiosError(error as Error, (response) => {
        if (response.status === 400) {
          console.error(new Error("invalid request body"));
        } else if (response.status === 404) {
          toast({
            description: "Gagal mencentang ibadah. Ibadah tidak ditemukan.",
            variant: "destructive",
          });
        }
      });
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, determinePrayerStatus, checkPrayer };
}

export { usePrayerViewModel };
