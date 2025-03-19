import { useMemo, type Dispatch, type SetStateAction } from "react";
import { useAxiosContext } from "../../contexts/AxiosProvider";
import { InvoiceModel } from "../../models/InvoiceModel";
import { usePlanButtonViewModel } from "../../viewmodels/profile/usePlanButtonViewModel";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@components/shadcn/AlertDialog";
import { Button } from "@components/shadcn/Button";
import type { PlanResponse } from "../../dtos/PlanDTO";

interface PlanButtonViewProps {
  plan: PlanResponse;
  couponCode: string;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

function PlanButtonView({ plan, couponCode, setIsOpen }: PlanButtonViewProps) {
  const { retryWithRefresh } = useAxiosContext();
  const invoiceModel = useMemo((): InvoiceModel => {
    return new InvoiceModel(retryWithRefresh);
  }, [retryWithRefresh]);

  const planButtonViewModel = usePlanButtonViewModel(invoiceModel);

  return (
    <>
      <button
        disabled={planButtonViewModel.isLoading}
        onClick={() => planButtonViewModel.setIsAlertDialogOpen(true)}
        type="button"
        className="bg-[#BF8E50] rounded-lg py-2"
      >
        <span className="text-[#363636] block font-bold text-center mx-6 mb-2">
          {plan.name}
        </span>

        <span className="text-white flex justify-center items-center gap-0.5">
          <span className="font-medium text-xs">Rp</span>
          <span className="font-bold text-[26px]">
            {Intl.NumberFormat("id-ID").format(plan.price)}-
          </span>

          <span className="font-medium text-xs">
            /{plan.duration_in_months} Bulan
          </span>
        </span>
      </button>

      <AlertDialog
        open={planButtonViewModel.isAlertDialogOpen}
        onOpenChange={planButtonViewModel.setIsAlertDialogOpen}
      >
        <AlertDialogContent className="max-w-sm mx-auto">
          <AlertDialogHeader>
            <AlertDialogTitle>
              Beli paket {plan.name} dan berlangganan selama&nbsp;
              {plan.duration_in_months} bulan?
            </AlertDialogTitle>

            <AlertDialogDescription asChild>
              <div>
                <p className="font-bold mb-2">Catatan:</p>
                <ul className="list-disc text-sm flex flex-col gap-2 ml-6">
                  <li>Pembayaran hanya melalui QRIS.</li>

                  <li>
                    Tagihan akan hangus jika melewati batas waktu yang telah
                    ditentukan.
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
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter className="gap-4">
            <AlertDialogCancel
              disabled={planButtonViewModel.isLoading}
              type="button"
              className="w-full"
            >
              Batal
            </AlertDialogCancel>

            <Button
              disabled={planButtonViewModel.isLoading}
              onClick={() =>
                planButtonViewModel.createInvoice(plan, setIsOpen, couponCode)
              }
              type="button"
              className="bg-[#BF8E50] hover:bg-[#BF8E50]/90 text-white hover:text-white w-full"
            >
              {planButtonViewModel.isLoading
                ? "Loading..."
                : "Proses Transaksi"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export { PlanButtonView };
