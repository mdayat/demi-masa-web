import { Button } from "@components/shadcn/Button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@components/shadcn/Dialog";
import { Skeleton } from "@components/shadcn/Skeleton";
import { useToast } from "@hooks/shadcn/useToast";
import { useAxios } from "@hooks/useAxios";
import {
  useStore,
  type SubscriptionPlanMap,
  type Transaction,
} from "@hooks/useStore";
import { CheckIcon } from "@radix-ui/react-icons";
import { useState, type Dispatch, type SetStateAction } from "react";

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

interface SubscriptionPlanButtonProps {
  id: string;
  price: number;
  durationInMonths: number;
  couponCode: string;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

function SubscriptionPlanButton({
  id,
  price,
  durationInMonths,
  couponCode,
  setOpen,
}: SubscriptionPlanButtonProps) {
  const user = useStore((state) => state.user);
  const setTransactions = useStore((state) => state.setTransactions);

  const [isLoading, setIsLoading] = useState(false);
  const [dialogOpened, setDialogOpened] = useState(false);

  const { toast } = useToast();
  const createAxiosInstance = useAxios();

  const handleCreateTx = async () => {
    setIsLoading(true);
    try {
      const resp = await createAxiosInstance().post<Transaction>(
        "/transactions",
        {
          subscription_plan_id: id,
          coupon_code: couponCode,
          customer_name: user?.name,
          customer_email: user?.email,
          customer_phone: user?.phoneNumber,
        },
        {
          headers: {
            Authorization: `Bearer ${user!.idToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (resp.status === 201) {
        setOpen(false);
        setDialogOpened(false);
        setTransactions((transactions) => {
          if (transactions === undefined) {
            return new Array<Transaction>(resp.data);
          } else {
            return [...transactions, resp.data];
          }
        });

        toast({
          description: "Berhasil membuat transaksi",
          variant: "default",
        });
      } else {
        throw new Error(`unknown response status code ${resp.status}`);
      }
    } catch (error) {
      console.error(
        new Error("failed to create transaction", { cause: error })
      );

      toast({
        description: "Gagal membuat transaksi",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        key={id}
        disabled={isLoading}
        onClick={() => setDialogOpened(true)}
        type="button"
        className="bg-[#BF8E50] rounded-lg py-2"
      >
        <span className="text-[#363636] block font-bold text-center">
          Pilih Paket
        </span>

        <span className="text-white flex justify-center items-center gap-0.5">
          <span className="font-medium text-xs">Rp</span>
          <span className="font-bold text-[26px]">
            {Intl.NumberFormat("id-ID").format(price)}-
          </span>
          <span className="font-medium text-xs">/{durationInMonths} Bulan</span>
        </span>
      </button>

      <Dialog open={dialogOpened} onOpenChange={setDialogOpened}>
        <DialogContent className="max-w-sm mx-auto">
          <DialogHeader>
            <DialogTitle>
              Apakah kamu yakin ingin berlangganan {durationInMonths} bulan?
            </DialogTitle>

            <DialogDescription>
              <div>
                <p className="font-bold mb-2 mt-6">Catatan:</p>
                <ul className="list-disc text-sm flex flex-col gap-2 ml-6">
                  <li>Pembayaran hanya melalui QRIS.</li>

                  <li>
                    Pembayaran hanya dapat dilakukan dalam satu jam setelah
                    transaksi, setelah itu transaksi hangus.
                  </li>

                  <li>
                    Status akun akan diperbarui menjadi premium setelah
                    pembayaran berhasil.
                  </li>

                  <li>
                    Jika status akun tidak diperbarui 10 menit setelah
                    pembayaran, hubungi kami.
                  </li>
                </ul>
              </div>
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              disabled={isLoading}
              onClick={handleCreateTx}
              className="bg-[#BF8E50] hover:bg-[#BF8E50]/90 text-white hover:text-white w-full"
            >
              {isLoading ? "Loading..." : "Proses Transaksi"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

interface SubscriptionPlansProps {
  subscriptionPlans: SubscriptionPlanMap | undefined;
  couponCode: string;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

function SubscriptionPlans({
  subscriptionPlans,
  couponCode,
  setOpen,
}: SubscriptionPlansProps) {
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
              <SubscriptionPlanButton
                key={item.id}
                id={item.id}
                price={item.price}
                durationInMonths={item.duration_in_months}
                couponCode={couponCode}
                setOpen={setOpen}
              />
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
