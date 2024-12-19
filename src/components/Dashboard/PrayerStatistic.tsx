import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useStore } from "@hooks/useStore";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function PrayerStatistic() {
  const prayerStatistic = useStore((state) => state.prayerStatistic);

  return (
    <div className="mx-6">
      <h2 className="text-[#363636] font-bold text-center text-2xl mb-1">
        Statistik Ibadah Salat
      </h2>

      <p className="text-[#7B7B7B] text-center text-sm mb-8">
        Semangat meningkatkan ketepatan waktu Shalat!
      </p>

      <Line
        data={{
          labels: ["Tidak Terlaksana", "Terlambat", "Tepat Waktu"],
          datasets: [
            {
              label: "Subuh",
              data: prayerStatistic!.get("Subuh")!,
              borderColor: "#82A3D8",
              backgroundColor: "#82A3D8",
              fill: false,
            },
            {
              label: "Zuhur",
              data: prayerStatistic!.get("Zuhur")!,
              borderColor: "#F7EA78",
              backgroundColor: "#F7EA78",
              fill: false,
            },
            {
              label: "Asar",
              data: prayerStatistic!.get("Asar")!,
              borderColor: "#F1B25B",
              backgroundColor: "#F1B25B",
              fill: false,
            },
            {
              label: "Magrib",
              data: prayerStatistic!.get("Magrib")!,
              borderColor: "#BF7155",
              backgroundColor: "#BF7155",
              fill: false,
            },
            {
              label: "Isya",
              data: prayerStatistic!.get("Isya")!,
              borderColor: "#7866AE",
              backgroundColor: "#7866AE",
              fill: false,
            },
          ],
        }}
        options={{
          responsive: true,
          aspectRatio: 1,
          scales: {
            y: {
              beginAtZero: true,
              min: 0,
              max: 35,
              ticks: {
                autoSkip: false,
                stepSize: 5,
              },
            },
          },
        }}
      />
    </div>
  );
}

export { PrayerStatistic };
