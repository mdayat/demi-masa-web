import { Skeleton } from "@components/shadcn/Skeleton";
import type { SubscriptionPlanMap } from "@hooks/useStore";
import { CheckIcon } from "@radix-ui/react-icons";

function SubscriptionPlanSkeleton() {
  return (
    <div className="animate-pulse border rounded-2xl overflow-hidden flex flex-col space-y-6 my-6 pb-6">
      <Skeleton className="h-16" />
      <Skeleton className="h-8 w-32 mx-auto rounded-xl" />
      <div className="space-y-4 mx-6">
        <Skeleton className="h-4" />
        <Skeleton className="h-4" />
        <Skeleton className="h-4" />
        <Skeleton className="h-4" />
      </div>
    </div>
  );
}

interface SubscriptionPlansProps {
  subscriptionPlans: SubscriptionPlanMap | undefined;
}

function SubscriptionPlans({ subscriptionPlans }: SubscriptionPlansProps) {
  if (subscriptionPlans === undefined || subscriptionPlans.size === 0) {
    return <></>;
  }

  return Array.from(subscriptionPlans.entries()).map(([key, value]) => {
    return (
      <div
        key={key}
        className="border border-[#BF8E50] rounded-2xl overflow-hidden pb-6 mt-6"
      >
        <h3 className="bg-[#BF8E50] text-white font-bold text-center text-xl py-3 mb-6">
          {key}
        </h3>

        <div className="flex flex-col gap-4 mb-4 mx-6">
          {value.map((item) => {
            return (
              <button
                key={item.id}
                onClick={() => console.log(item.id)}
                type="button"
                className="bg-[#BF8E50] rounded-lg py-2"
              >
                <span className="text-[#363636] block font-bold text-center">
                  Pilih Paket
                </span>

                <span className="text-white flex justify-center items-center gap-0.5">
                  <span className="font-medium text-xs">Rp</span>
                  <span className="font-bold text-[26px]">
                    {Intl.NumberFormat("id-ID").format(item.price)}-
                  </span>
                  <span className="font-medium text-xs">
                    /{item.duration_in_months} Bulan
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        <hr className="border-[#C2C2C2] my-7" />

        <ul className="flex flex-col gap-4 mx-6">
          <li className="text-[#363636] text-sm flex items-center gap-3">
            <CheckIcon className="text-[#F0AD4E] shrink-0 w-6 h-6" /> Pengingat
            salat 5 waktu melalui WhatsApp
          </li>
          <li className="text-[#363636] text-sm flex items-center gap-3">
            <CheckIcon className="text-[#F0AD4E] shrink-0 w-6 h-6" /> Notifikasi
            saat masuk waktu salat
          </li>
          <li className="text-[#363636] text-sm flex items-center gap-3">
            <CheckIcon className="text-[#F0AD4E] shrink-0 w-6 h-6" />
            Notifikasi saat waktu salat tersisa 25%
          </li>
          <li className="text-[#363636] text-sm flex items-center gap-3">
            <CheckIcon className="text-[#F0AD4E] shrink-0 w-6 h-6" />
            Manajemen ibadah melalui to-do list
          </li>
          <li className="text-[#363636] text-sm flex items-center gap-3">
            <CheckIcon className="text-[#F0AD4E] shrink-0 w-6 h-6" /> Laporan
            kemajuan ibadah tak terbatas
          </li>
        </ul>
      </div>
    );
  });
}

export { SubscriptionPlans, SubscriptionPlanSkeleton };
