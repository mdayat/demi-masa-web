import { History } from "@components/Icons/History";
import { Logout } from "@components/Icons/Logout";
import { PersonCircle } from "@components/Icons/PersonCircle";
import { ShoppingBag } from "@components/Icons/ShoppingBag";
import { Wallet } from "@components/Icons/Wallet";
import { WhatsApp } from "@components/Icons/WhatsApp";
import { Badge } from "@components/shadcn/Badge";
import { Button } from "@components/shadcn/Button";
import { useStore } from "@hooks/useStore";
import { auth } from "@libs/firebase";
import {
  ExclamationTriangleIcon,
  Pencil1Icon,
  TrashIcon,
} from "@radix-ui/react-icons";

export default function Profile() {
  const user = useStore((state) => state.user);
  const isPremium = true;
  const transactionHistory = [];

  return (
    <>
      <div className="border border-[#E1E1E1] rounded-b-[40px] py-2.5">
        <div className="flex justify-center items-center gap-2">
          <img
            src="demi-masa-logo.png"
            alt="Logo Aplikasi Demi Masa"
            className="w-9"
          />

          <h2 className="text-black font-bold text-xl">Demi Masa</h2>
        </div>
      </div>

      <h1 className="text-[#2F3D4A] text-xl font-bold m-6">Profil Pengguna</h1>

      <div className="flex justify-between items-center mb-3 mx-6">
        <div className="flex items-center gap-3">
          <PersonCircle className="text-[#333333] w-5 h-5" />
          <h2 className="text-[#7B7B7B] font-medium">Data Diri</h2>
        </div>

        <Button
          type="button"
          variant="default"
          className="bg-[#BF8E50] hover:bg-[#BF8E50]/90 flex justify-center items-center gap-2"
        >
          <Pencil1Icon className="text-white" />
          Edit
        </Button>
      </div>

      <div className="flex items-center gap-3 border border-[#C2C2C2] rounded-2xl p-3.5 mb-3.5 mx-6">
        <PersonCircle className="text-[#333333] w-8 h-8" />

        <div>
          <h3 className="text-[#7B7B7B] font-medium text-xs">
            Assalamu'alaikum
          </h3>
          <p className="text-[#7B7B7B] font-bold text-sm">{user?.email}</p>
        </div>
      </div>

      <div className="flex items-center gap-3 border border-[#C2C2C2] rounded-2xl p-3.5 mx-6">
        <WhatsApp className="fill-[#333333] w-8 h-8" />

        <div>
          <h3 className="text-[#7B7B7B] font-medium text-xs">WhatsApp</h3>
          <p className="text-[#7B7B7B] font-bold text-sm">
            {user?.phoneVerified}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 mt-6 mx-6 mb-3.5">
        <ShoppingBag className="fill-[#333333] w-5 h-5" />
        <h2 className="text-[#7B7B7B] font-medium">Paket Saya</h2>
      </div>

      {isPremium ? (
        <div className="bg-[#BF8E50] rounded-2xl p-6 mx-6">
          <Badge
            variant="default"
            className="bg-white hover:bg-white text-black"
          >
            Premium
          </Badge>

          <p className="text-white font-bold text-sm mt-3.5">
            Berlaku sampai 2 bulan lagi
          </p>

          <Button
            type="button"
            variant="default"
            className="bg-white hover:bg-white/90 text-[#363636] mt-3.5"
          >
            <Wallet className="fill-[#363636]" />
            Beli Paket
          </Button>
        </div>
      ) : (
        <div className="border border-[#C2C2C2] rounded-2xl p-6  mx-6">
          <Badge variant="outline" className="text-black border-[#E1E1E1]">
            Free
          </Badge>

          <p className="text-[#363636] font-bold text-sm mt-3.5">
            Beli Paket Premiun, Nikmati Semua Layanan
          </p>

          <Button
            type="button"
            variant="outline"
            className="text-[#363636] border-[#2F3D4A] mt-3.5"
          >
            <Wallet className="fill-[#363636]" />
            Beli Paket
          </Button>
        </div>
      )}

      <div className="flex items-center gap-3 mt-6 mb-3.5 mx-6">
        <History className="fill-[#333333] w-5 h-5" />
        <h2 className="text-[#7B7B7B] font-medium">Riwayat Transaksi</h2>
      </div>

      {transactionHistory.length !== 0 ? (
        <div className="border border-[#C2C2C2] rounded-2xl p-6 mx-6">
          <div className="flex items-center gap-3">
            <Badge
              variant="default"
              className="bg-[#BF8E50] hover:bg-[#BF8E50] text-white"
            >
              Premium
            </Badge>

            <Badge
              variant="outline"
              className="border-[#67ACE8] text-[#67ACE8]"
            >
              Sukses
            </Badge>
          </div>

          <p className="text-[#7B7B7B] font-medium my-3">
            2 Januari 2024 - 2 Februari 2024
          </p>

          <p className="text-[#363636] font-bold">Rp250.000</p>
        </div>
      ) : (
        <p className="text-[#7B7B7B] text-center font-medium border border-[#C2C2C2] rounded-2xl p-6 mx-6">
          Belum ada transaksi
        </p>
      )}

      <div className="flex items-center gap-3 mt-6 mb-3.5 mx-6">
        <TrashIcon className="text-[#333333] w-5 h-5" />
        <h2 className="text-[#7B7B7B] font-medium">Hapus Akun</h2>
      </div>

      <div className="bg-[#D9534F] rounded-2xl p-6 mx-6">
        <p className="text-white font-bold text-sm flex items-center gap-3.5 mb-4">
          <ExclamationTriangleIcon className="text-white w-6 h-6 shrink-0" />
          Ingin hapus akun? klik tombol di bawah ini
        </p>

        <Button
          type="button"
          variant="default"
          className="bg-white hover:bg-white/90 text-[#D9534F] w-full"
        >
          Hapus Akun
        </Button>
      </div>

      <div className="flex items-center gap-3 mt-6 mb-3.5 mx-6">
        <Logout className="fill-[#333333] w-5 h-5" />
        <h2 className="text-[#7B7B7B] font-medium">Keluar</h2>
      </div>

      <div className="border border-[#E1E1E1] rounded-2xl p-6 mx-6">
        <p className="text-black text-center text-sm mb-4">
          Ingin keluar akun? klik tombol di bawah ini
        </p>

        <Button
          onClick={() => auth.signOut()}
          type="button"
          variant="outline"
          className="text-[#2F3D4A] w-full"
        >
          Keluar
        </Button>
      </div>
    </>
  );
}
