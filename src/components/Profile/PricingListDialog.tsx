import { Button } from "@components/shadcn/Button";
import { Input } from "@components/shadcn/Input";
import { Label } from "@components/shadcn/Label";
import { CheckIcon, Cross2Icon } from "@radix-ui/react-icons";
import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { Dialog, DialogContent } from "@components/shadcn/Dialog";
import { useToast } from "@hooks/shadcn/useToast";
import { useAxios } from "@hooks/useAxios";
import { useStore, type SubscriptionPlan } from "@hooks/useStore";
import {
  SubscriptionPlans,
  SubscriptionPlanSkeleton,
} from "./SubscriptionPlan";

interface PricingListDialogProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

function PricingListDialog({ open, setOpen }: PricingListDialogProps) {
  const user = useStore((state) => state.user);
  const subscriptionPlans = useStore((state) => state.subscriptionPlans);
  const setSubscriptionPlans = useStore((state) => state.setSubscriptionPlans);

  const [couponCode, setCouponCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { toast } = useToast();
  const createAxiosInstance = useAxios();

  useEffect(() => {
    if (subscriptionPlans !== undefined) return;
    setIsLoading(true);

    (async () => {
      try {
        const resp = await createAxiosInstance().get<SubscriptionPlan[]>(
          "/subscription-plans",
          { headers: { Authorization: `Bearer ${user!.idToken}` } }
        );

        if (resp.status !== 200) {
          throw new Error(`unknown response status code ${resp.status}`);
        }

        if (resp.data.length !== 0) {
          const subsPlan = new Map<string, SubscriptionPlan[]>();

          for (let i = 0; i < resp.data.length; i++) {
            const subsPlanName = resp.data[i].name;
            const result = subsPlan.get(subsPlanName);

            if (result === undefined) {
              subsPlan.set(
                subsPlanName,
                new Array<SubscriptionPlan>(resp.data[i])
              );
            } else {
              subsPlan.set(subsPlanName, [...result, resp.data[i]]);
            }
          }

          setSubscriptionPlans(subsPlan);
        }
      } catch (error) {
        console.error(
          new Error("failed to get subscription plans", { cause: error })
        );

        toast({
          description: "Gagal menampilkan subscription plans",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    })();
  }, [
    toast,
    createAxiosInstance,
    user,
    setSubscriptionPlans,
    subscriptionPlans,
  ]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-sm mx-auto [&>*:last-child]:hidden">
        <div className="h-screen overflow-scroll no-scrollbar py-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-[#2F3D4A] font-bold text-xl">
              Pilih Jenis Reminder Anda
            </h1>

            <button onClick={() => setOpen(false)} type="button">
              <Cross2Icon className="text-[#333333] w-6 h-6" />
            </button>
          </div>

          <div className="border border-[#C2C2C2] rounded-2xl px-5 py-3">
            <Label
              htmlFor="coupon_code"
              className="text-black font-bold text-base mb-2 block"
            >
              Kode Influencer
            </Label>

            <Input
              value={couponCode}
              onChange={(event) => setCouponCode(event.currentTarget.value)}
              id="coupon_code"
              type="text"
              autoComplete="off"
              className="mb-4"
            />
          </div>

          {isLoading ? (
            <SubscriptionPlanSkeleton />
          ) : (
            <SubscriptionPlans
              subscriptionPlans={subscriptionPlans}
              couponCode={couponCode}
              setOpen={setOpen}
            />
          )}

          <div className="border border-[#C2C2C2] rounded-2xl py-6 mt-6">
            <h3 className="text-[#363636] font-bold text-center text-xl mb-2">
              Gratis
            </h3>

            <p className="text-[#7B7B7B] text-center text-sm mb-4">
              Akhir Bulan Tak Masalah
            </p>

            <Button
              disabled
              type="button"
              variant="outline"
              className="text-center block w-32 mx-auto"
            >
              Pilih Paket
            </Button>

            <hr className="border-[#C2C2C2] my-7" />

            <ul className="flex flex-col gap-4 mx-6">
              <li className="text-[#363636] text-sm flex items-center gap-3">
                <CheckIcon className="text-[#363636] shrink-0 w-6 h-6" />{" "}
                Pengingat salat 5 waktu melalui WhatsApp
              </li>
              <li className="text-[#363636] text-sm flex items-center gap-3">
                <CheckIcon className="text-[#363636] shrink-0 w-6 h-6" />{" "}
                Notifikasi saat masuk waktu salat
              </li>
              <li className="text-[#363636] text-sm flex items-center gap-3">
                <Cross2Icon className="text-[#363636] shrink-0 w-6 h-6" />
                Notifikasi saat waktu salat tersisa 25%
              </li>
              <li className="text-[#363636] text-sm flex items-center gap-3">
                <Cross2Icon className="text-[#363636] shrink-0 w-6 h-6" />
                Manajemen ibadah melalui to-do list
              </li>
              <li className="text-[#363636] text-sm flex items-center gap-3">
                <Cross2Icon className="text-[#363636] shrink-0 w-6 h-6" />{" "}
                Laporan kemajuan ibadah tak terbatas
              </li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export { PricingListDialog };
