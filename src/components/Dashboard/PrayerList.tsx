import { Skeleton } from "@components/shadcn/Skeleton";
import { useToast } from "@hooks/shadcn/useToast";
import { useAxios } from "@hooks/useAxios";
import { useStore, type Prayer } from "@hooks/useStore";
import { getCurrentTime } from "@utils/index";
import { lazy, useEffect, useMemo, useState } from "react";

const PrayerItem = lazy(() =>
  import("@components/Dashboard/PrayerItem").then(({ PrayerItem }) => ({
    default: PrayerItem,
  }))
);

interface PrayerCompletionIndicatorProps
  extends Pick<Prayer, "status" | "unix_time"> {
  currentUnixTime: number;
}

function PrayerCompletionIndicator({
  currentUnixTime,
  status,
  unix_time,
}: PrayerCompletionIndicatorProps) {
  const boxColor = useMemo((): string => {
    if (currentUnixTime > unix_time && status !== undefined) {
      if (status === "ON_TIME") {
        return "bg-[#238471]";
      } else if (status === "LATE") {
        return "bg-[#F0AD4E]";
      } else {
        return "bg-[#D9534F]";
      }
    } else {
      return "bg-[#ECECEC]";
    }
  }, [status, unix_time, currentUnixTime]);

  return <div className={`${boxColor} w-12 h-6`}></div>;
}

function PrayerList() {
  const user = useStore((state) => state.user);
  const prayers = useStore((state) => state.prayers);
  const setPrayers = useStore((state) => state.setPrayers);

  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const createAxiosInstance = useAxios();

  const currentUnixTime = useMemo((): number => {
    return Math.round(
      getCurrentTime(user!.timeZone as string).getTime() / 1000
    );
  }, [user]);

  useEffect(() => {
    if (prayers !== undefined) return;
    (async () => {
      setIsLoading(true);
      try {
        const resp = await createAxiosInstance().get<Prayer[]>(
          `/prayers/today?time_zone=${user!.timeZone}`,
          { headers: { Authorization: `Bearer ${user!.idToken}` } }
        );

        if (resp.status === 200) {
          setPrayers(resp.data);
        } else {
          throw new Error(`unknown response status code ${resp.status}`);
        }
      } catch (error) {
        console.error(
          new Error("failed to get today prayer", { cause: error })
        );

        toast({
          description: "Gagal menampilkan daftar ibadah salat hari ini.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    })();
  }, [prayers, setPrayers, user, toast, createAxiosInstance]);

  if (isLoading) {
    return (
      <div className="animate-pulse border border-[#E1E1E1] rounded-3xl flex flex-col gap-6 p-6 mx-6">
        <div className="animate-pulse border border-[#E1E1E1] rounded-lg flex flex-col gap-6 p-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-48" />
        </div>

        <div className="animate-pulse flex justify-between items-center gap-2">
          <Skeleton className="w-12 h-6 rounded-none" />
          <Skeleton className="w-12 h-6 rounded-none" />
          <Skeleton className="w-12 h-6 rounded-none" />
          <Skeleton className="w-12 h-6 rounded-none" />
          <Skeleton className="w-12 h-6 rounded-none" />
        </div>
      </div>
    );
  }

  if (prayers === undefined || prayers.length === 0) {
    return (
      <p className="text-[#7B7B7B] text-center font-medium border border-[#C2C2C2] rounded-2xl p-6 mx-6">
        Tidak dapat menampilkan daftar salat hari ini.
      </p>
    );
  }

  return (
    <div className="border border-[#E1E1E1] rounded-3xl p-6 mx-6">
      <h2 className="text-[#1A6355] font-bold text-xl mb-3">Daftar Salat</h2>

      <div className="flex flex-col gap-3 mb-6">
        {prayers.map((item) => (
          <PrayerItem
            key={item.id + ":prayer"}
            id={item.id}
            name={item.name}
            status={item.status}
            unix_time={item.unix_time}
            currentUnixTime={currentUnixTime}
          />
        ))}
      </div>

      <h3 className="text-[#363636] font-medium mb-3">
        Ketepatan salat hari ini
      </h3>

      <div className="flex justify-between items-center gap-2">
        {prayers.map((item) => (
          <PrayerCompletionIndicator
            key={item.id + ":completion"}
            currentUnixTime={currentUnixTime}
            status={item.status}
            unix_time={item.unix_time}
          />
        ))}
      </div>
    </div>
  );
}

export { PrayerList };
