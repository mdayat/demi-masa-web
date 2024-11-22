import { Button } from "@components/shadcn/Button";
import { CheckIcon, Cross2Icon } from "@radix-ui/react-icons";
import { Link } from "react-router-dom";

function PricingPlan() {
  return (
    <div className="my-32 mx-6 flex flex-col gap-10">
      <div className="border border-[#C2C2C2] rounded-2xl py-6">
        <h3 className="text-[#363636] font-bold text-center text-xl mb-2">
          Gratis
        </h3>

        <p className="text-[#7B7B7B] text-center text-sm mb-4">
          Akhir Bulan Tak Masalah
        </p>

        <Button
          asChild
          type="button"
          variant="outline"
          className="text-center block w-32 mx-auto"
        >
          <Link to="#login-section">Pilih Paket</Link>
        </Button>

        <hr className="border-[#C2C2C2] my-7" />

        <ul className="flex flex-col gap-4 mx-6">
          <li className="text-[#363636] text-sm flex items-center gap-3">
            <CheckIcon className="text-[#363636] shrink-0 w-6 h-6" /> Pengingat
            salat 5 waktu melalui WhatsApp
          </li>
          <li className="text-[#363636] text-sm flex items-center gap-3">
            <CheckIcon className="text-[#363636] shrink-0 w-6 h-6" /> Notifikasi
            saat masuk waktu salat
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
            <Cross2Icon className="text-[#363636] shrink-0 w-6 h-6" /> Laporan
            kemajuan ibadah tak terbatas
          </li>
        </ul>
      </div>

      <div className="border border-[#BF8E50] rounded-2xl pb-6 overflow-hidden">
        <h3 className="bg-[#BF8E50] text-white font-bold text-center text-xl py-3 mb-6">
          Premium
        </h3>

        <p className="text-[#7B7B7B] text-center text-sm mb-4">
          Menikmati Kebaikan dengan Tenang
        </p>

        <div className="flex flex-col gap-1 mb-4">
          <span className="flex justify-center items-center gap-0.5">
            <span className="text-[#363636] font-medium text-xs">Rp</span>
            <span className="text-[#363636] font-bold text-[26px]">
              35.000,-
            </span>
            <span className="text-[#363636] font-medium text-xs">/Bln</span>
          </span>

          <span className="flex justify-center items-center gap-0.5">
            <span className="text-[#363636] font-medium text-xs">Rp</span>
            <span className="text-[#363636] font-bold text-[26px]">
              105.000,-
            </span>
            <span className="text-[#363636] font-medium text-xs">/3 Bln</span>
          </span>
        </div>

        <Button
          asChild
          type="button"
          className="bg-[#BF8E50] hover:bg-[#BF8E50]/90 text-center block w-32 mx-auto"
        >
          <Link to="#login-section">Pilih Paket</Link>
        </Button>

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
    </div>
  );
}

export { PricingPlan };
