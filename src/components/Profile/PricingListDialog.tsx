import { Button } from "@components/shadcn/Button";
import { Input } from "@components/shadcn/Input";
import { Label } from "@components/shadcn/Label";
import { CheckIcon, Cross2Icon } from "@radix-ui/react-icons";
import { useState, type Dispatch, type SetStateAction } from "react";
import { Dialog, DialogContent } from "@components/shadcn/Dialog";

interface PricingListDialogProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

function PricingListDialog({ open, setOpen }: PricingListDialogProps) {
  const [couponCode, setCouponCode] = useState("");

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

          <div className="border border-[#C2C2C2] rounded-2xl px-5 py-3 mb-6">
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

            <Button
              disabled={couponCode === ""}
              type="button"
              variant="outline"
              className="w-fit"
            >
              Masukkan
            </Button>
          </div>

          <div className="border border-[#BF8E50] rounded-2xl overflow-hidden pb-6">
            <h3 className="bg-[#BF8E50] text-white font-bold text-center text-xl py-3 mb-6">
              Premium
            </h3>

            <div className="flex flex-col gap-4 mb-4 mx-6">
              <button type="button" className="bg-[#BF8E50] rounded-lg py-2">
                <span className="text-[#363636] block font-bold text-center">
                  Pilih Paket
                </span>

                <span className="text-white flex justify-center items-center gap-0.5">
                  <span className="font-medium text-xs">Rp</span>
                  <span className="font-bold text-[26px]">35.000,-</span>
                  <span className="font-medium text-xs">/Bln</span>
                </span>
              </button>

              <button type="button" className="bg-[#BF8E50] rounded-lg py-2">
                <span className="text-[#363636] block font-bold text-center">
                  Pilih Paket
                </span>

                <span className="text-white flex justify-center items-center gap-0.5">
                  <span className="font-medium text-xs">Rp</span>
                  <span className="font-bold text-[26px]">105.000,-</span>
                  <span className="font-medium text-xs">/3 Bln</span>
                </span>
              </button>
            </div>

            <hr className="border-[#C2C2C2] my-7" />

            <ul className="flex flex-col gap-4 mx-6">
              <li className="text-[#363636] text-sm flex items-center gap-3">
                <CheckIcon className="text-[#F0AD4E] shrink-0 w-6 h-6" />{" "}
                Pengingat salat 5 waktu melalui WhatsApp
              </li>
              <li className="text-[#363636] text-sm flex items-center gap-3">
                <CheckIcon className="text-[#F0AD4E] shrink-0 w-6 h-6" />{" "}
                Notifikasi saat masuk waktu salat
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
                <CheckIcon className="text-[#F0AD4E] shrink-0 w-6 h-6" />{" "}
                Laporan kemajuan ibadah tak terbatas
              </li>
            </ul>
          </div>

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
