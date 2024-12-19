import { Skeleton } from "@components/shadcn/Skeleton";
import { useToast } from "@hooks/shadcn/useToast";
import { useAxios } from "@hooks/useAxios";
import {
  useStore,
  type Prayer,
  type PrayerName,
  type PrayerStatistic as PrayerStatisticType,
} from "@hooks/useStore";
import { getCurrentTime } from "@utils/index";
import { lazy, useEffect, useState } from "react";

const PrayerLeaderboard = lazy(() =>
  import("@components/Dashboard/PrayerLeaderboard").then(
    ({ PrayerLeaderboard }) => ({
      default: PrayerLeaderboard,
    })
  )
);

const PrayerStatistic = lazy(() =>
  import("@components/Dashboard/PrayerStatistic").then(
    ({ PrayerStatistic }) => ({
      default: PrayerStatistic,
    })
  )
);

function createPrayerStatistic(
  prayers: Pick<Prayer, "id" | "name" | "status">[]
): PrayerStatisticType {
  const prayerStatistic = new Map<PrayerName, number[]>();
  prayerStatistic.set("Subuh", [0, 0, 0]);
  prayerStatistic.set("Zuhur", [0, 0, 0]);
  prayerStatistic.set("Asar", [0, 0, 0]);
  prayerStatistic.set("Magrib", [0, 0, 0]);
  prayerStatistic.set("Isya", [0, 0, 0]);

  for (const prayer of prayers) {
    const statistic = prayerStatistic.get(prayer.name)!;
    if (prayer.status === "ON_TIME") {
      statistic[2]++;
    } else if (prayer.status === "LATE") {
      statistic[1]++;
    } else {
      statistic[0]++;
    }

    prayerStatistic.set(prayer.name, statistic);
  }

  return prayerStatistic;
}

function PrayerReport() {
  const user = useStore((state) => state.user);
  const prayerStatistic = useStore((state) => state.prayerStatistic);
  const setPrayerStatistic = useStore((state) => state.setPrayerStatistic);

  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const createAxiosInstance = useAxios();

  useEffect(() => {
    if (prayerStatistic !== undefined) return;
    setIsLoading(true);
    const currentTime = getCurrentTime(user!.timeZone as string);

    (async () => {
      try {
        const resp = await createAxiosInstance().get<
          Pick<Prayer, "id" | "name" | "status">[]
        >(
          `/prayers?year=${currentTime.getFullYear()}&month=${currentTime.getMonth() + 1}`,
          { headers: { Authorization: `Bearer ${user!.idToken}` } }
        );

        if (resp.status === 200) {
          setPrayerStatistic(createPrayerStatistic(resp.data));
        } else if (resp.status === 400) {
          throw new Error("invalid query params");
        } else {
          throw new Error(`unknown response status code ${resp.status}`);
        }
      } catch (error) {
        console.error(
          new Error("failed to get this month prayers", { cause: error })
        );

        toast({
          description: "Gagal menampilkan statistik ibadah salat.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    })();
  }, [prayerStatistic, setPrayerStatistic, user, toast, createAxiosInstance]);

  if (isLoading) {
    return (
      <div className="animate-pulse border border-[#C2C2C2] rounded-3xl py-5 px-4 mx-6 mt-16">
        <div className="flex justify-between items-end gap-2">
          <Skeleton className="rounded-t-3xl h-[140px] w-full max-w-24" />
          <Skeleton className="rounded-t-3xl h-[160px] w-full max-w-24" />
          <Skeleton className="rounded-t-3xl h-[140px] w-full max-w-24" />
        </div>

        <div className="flex flex-col gap-4 mt-6">
          <div className="border border-[#C2C2C2] rounded-2xl flex items-center gap-3 py-3.5 px-5">
            <Skeleton className="shrink-0 rounded-full w-6 h-6"></Skeleton>

            <div className="flex flex-col gap-2 w-full">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-16" />
            </div>
          </div>

          <div className="border border-[#C2C2C2] rounded-2xl flex items-center gap-3 py-3.5 px-5">
            <Skeleton className="shrink-0 rounded-full w-6 h-6"></Skeleton>

            <div className="flex flex-col gap-2 w-full">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-16" />
            </div>
          </div>

          <div className="border border-[#C2C2C2] rounded-2xl flex items-center gap-3 py-3.5 px-5">
            <Skeleton className="shrink-0 rounded-full w-6 h-6"></Skeleton>

            <div className="flex flex-col gap-2 w-full">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-16" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (prayerStatistic === undefined || prayerStatistic.size === 0) {
    return (
      <p className="text-[#7B7B7B] text-center font-medium border border-[#C2C2C2] rounded-2xl p-6 mx-6 mt-16">
        Tidak dapat menampilkan statistik ibadah salat.
      </p>
    );
  }

  return (
    <div className="mt-16">
      <PrayerLeaderboard />
      <PrayerStatistic />
    </div>
  );
}

export { PrayerReport };
