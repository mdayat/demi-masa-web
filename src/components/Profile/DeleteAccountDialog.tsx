import { useState, type Dispatch, type SetStateAction } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@components/shadcn/Dialog";
import { Button } from "@components/shadcn/Button";
import { useToast } from "@hooks/shadcn/useToast";
import { useAxios } from "@hooks/useAxios";
import { useStore } from "@hooks/useStore";
import { auth } from "@libs/firebase";

interface DeleteAccountDialogProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

function DeleteAccountDialog({ open, setOpen }: DeleteAccountDialogProps) {
  const user = useStore((state) => state.user);
  const [isLoading, setIsLoading] = useState(false);

  const { toast } = useToast();
  const createAxiosInstance = useAxios();

  const handleDeleteAccount = async () => {
    setIsLoading(true);
    try {
      const resp = await createAxiosInstance().delete(`/users/${user?.id}`, {
        headers: { Authorization: `Bearer ${user!.idToken}` },
      });

      if (resp.status === 200) {
        setOpen(false);
        toast({
          description:
            "Akun berhasil dihapus, kamu akan diarahkan ke halaman login dalam 3 detik.",
          variant: "default",
        });

        setTimeout(() => {
          auth.signOut();
        }, 3000);
      } else {
        throw new Error("user not found");
      }
    } catch (error) {
      console.error(
        new Error("failed to delete user account", { cause: error })
      );

      toast({
        description: "Gagal menghapus akun",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Hapus Akun</DialogTitle>
          <DialogDescription>
            Kami akan menghapus semua data kamu secara permanen. Apakah kamu
            yakin ingin menghapus akun?
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="gap-6">
          <Button
            disabled={isLoading}
            onClick={() => setOpen(false)}
            type="button"
            className="bg-[#363636] hover:bg-[#363636] w-full"
          >
            {isLoading ? "Loading..." : "Batalkan"}
          </Button>

          <Button
            disabled={isLoading}
            onClick={handleDeleteAccount}
            type="button"
            variant="outline"
            className="text-[#D9534F] border-[#D9534F] hover:text-[#D9534F] w-full"
          >
            {isLoading ? "Loading..." : "Hapus"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export { DeleteAccountDialog };
