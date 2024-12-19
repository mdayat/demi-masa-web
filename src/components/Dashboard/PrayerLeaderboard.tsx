import { useStore, type PrayerName } from "@hooks/useStore";

interface PrayerStatus {
  prayerName: PrayerName;
  numOfStatus: number;
}

function getLargestPrayerStatus(
  prayerStatuses: PrayerStatus[]
): PrayerName | undefined {
  const largestPrayerStatus: PrayerStatus = {
    prayerName: "Subuh",
    numOfStatus: 0,
  };

  for (const prayerStatus of prayerStatuses) {
    if (prayerStatus.numOfStatus > largestPrayerStatus.numOfStatus) {
      largestPrayerStatus.prayerName = prayerStatus.prayerName;
      largestPrayerStatus.numOfStatus = prayerStatus.numOfStatus;
    }
  }

  return largestPrayerStatus.numOfStatus !== 0
    ? largestPrayerStatus.prayerName
    : undefined;
}

function PrayerLeaderboard() {
  const prayerStatistic = useStore((state) => state.prayerStatistic);

  const mostOnTimePrayer = getLargestPrayerStatus([
    {
      prayerName: "Subuh",
      numOfStatus: prayerStatistic!.get("Subuh")![2],
    },
    {
      prayerName: "Zuhur",
      numOfStatus: prayerStatistic!.get("Zuhur")![2],
    },
    {
      prayerName: "Asar",
      numOfStatus: prayerStatistic!.get("Asar")![2],
    },
    {
      prayerName: "Magrib",
      numOfStatus: prayerStatistic!.get("Magrib")![2],
    },
    {
      prayerName: "Isya",
      numOfStatus: prayerStatistic!.get("Isya")![2],
    },
  ]);

  const mostLatePrayer = getLargestPrayerStatus([
    {
      prayerName: "Subuh",
      numOfStatus: prayerStatistic!.get("Subuh")![1],
    },
    {
      prayerName: "Zuhur",
      numOfStatus: prayerStatistic!.get("Zuhur")![1],
    },
    {
      prayerName: "Asar",
      numOfStatus: prayerStatistic!.get("Asar")![1],
    },
    {
      prayerName: "Magrib",
      numOfStatus: prayerStatistic!.get("Magrib")![1],
    },
    {
      prayerName: "Isya",
      numOfStatus: prayerStatistic!.get("Isya")![1],
    },
  ]);

  const mostMissedPrayer = getLargestPrayerStatus([
    {
      prayerName: "Subuh",
      numOfStatus: prayerStatistic!.get("Subuh")![0],
    },
    {
      prayerName: "Zuhur",
      numOfStatus: prayerStatistic!.get("Zuhur")![0],
    },
    {
      prayerName: "Asar",
      numOfStatus: prayerStatistic!.get("Asar")![0],
    },
    {
      prayerName: "Magrib",
      numOfStatus: prayerStatistic!.get("Magrib")![0],
    },
    {
      prayerName: "Isya",
      numOfStatus: prayerStatistic!.get("Isya")![0],
    },
  ]);

  return (
    <div className="border border-[#C2C2C2] rounded-3xl py-5 px-4 mx-6 mb-16">
      <h2 className="text-[#363636] font-bold text-center text-2xl mb-8">
        Rangkuman
      </h2>

      <div className="flex justify-center items-end gap-2">
        <div className="bg-[#F0AD4E] rounded-t-3xl h-[140px] w-full max-w-24 p-3.5">
          <div className="bg-white flex flex-col justify-center items-center gap-1 rounded-2xl py-1.5">
            <div className="bg-[#F0AD4E] text-white font-bold rounded-full grid place-items-center text-xs w-6 h-6">
              2
            </div>

            <span className="text-[#363636] text-sm">
              {mostLatePrayer ?? "Kosong"}
            </span>
          </div>
        </div>

        <div className="bg-[#238471] rounded-t-3xl h-[160px] w-full max-w-24 p-3.5">
          <div className="bg-white flex flex-col justify-center items-center gap-1 rounded-2xl py-1.5">
            <div className="bg-[#238471] text-white font-bold rounded-full grid place-items-center text-xs w-6 h-6">
              1
            </div>

            <span className="text-[#363636] text-sm">
              {mostOnTimePrayer ?? "Kosong"}
            </span>
          </div>
        </div>

        <div className="bg-[#D9534F] rounded-t-3xl h-[140px] w-full max-w-24 p-3.5">
          <div className="bg-white flex flex-col justify-center items-center gap-1 rounded-2xl py-1.5">
            <div className="bg-[#D9534F] text-white font-bold rounded-full grid place-items-center text-xs w-6 h-6">
              3
            </div>

            <span className="text-[#363636] text-sm">
              {mostMissedPrayer ?? "Kosong"}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 mt-6">
        <div className="border border-[#C2C2C2] rounded-2xl flex items-center gap-3 py-3.5 px-5">
          <div className="bg-[#238471] text-white font-bold rounded-full grid place-items-center text-xs w-6 h-6">
            1
          </div>

          <div className="flex flex-col gap-0.5">
            <p className="text-[#7B7B7B] font-medium text-xs">
              Ibadah salat paling tepat waktu:
            </p>

            <p className="text-[#7B7B7B] font-bold text-sm">
              {mostOnTimePrayer ?? "Kosong"}
            </p>
          </div>
        </div>

        <div className="border border-[#C2C2C2] rounded-2xl flex items-center gap-3 py-3.5 px-5">
          <div className="bg-[#F0AD4E] text-white font-bold rounded-full grid place-items-center text-xs w-6 h-6">
            2
          </div>

          <div className="flex flex-col gap-0.5">
            <p className="text-[#7B7B7B] font-medium text-xs">
              Ibadah salat paling sering terlambat:
            </p>

            <p className="text-[#7B7B7B] font-bold text-sm">
              {mostLatePrayer ?? "Kosong"}
            </p>
          </div>
        </div>

        <div className="border border-[#C2C2C2] rounded-2xl flex items-center gap-3 py-3.5 px-5">
          <div className="bg-[#D9534F] text-white font-bold rounded-full grid place-items-center text-xs w-6 h-6">
            3
          </div>

          <div className="flex flex-col gap-0.5">
            <p className="text-[#7B7B7B] font-medium text-xs">
              Ibadah salat sering tidak terlaksana:
            </p>

            <p className="text-[#7B7B7B] font-bold text-sm">
              {mostMissedPrayer ?? "Kosong"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export { PrayerLeaderboard };
