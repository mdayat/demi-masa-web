import { useState, type Dispatch, type SetStateAction } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@components/shadcn/AlertDialog";
import { buttonVariants } from "@components/shadcn/Button";
import { useToast } from "@hooks/shadcn/useToast";
import { useAxios } from "@hooks/useAxios";
import { useStore } from "@hooks/useStore";
import { auth } from "@libs/firebase";
import { cn } from "@libs/shadcn";

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
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent className="max-w-sm">
        <AlertDialogHeader>
          <AlertDialogTitle>
            Apakah kamu yakin ingin menghapus akun?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Kami akan menghapus semua data kamu secara permanen.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="gap-4">
          <AlertDialogCancel
            disabled={isLoading}
            className={cn(
              buttonVariants({ variant: "default" }),
              "bg-[#363636] hover:bg-[#363636] hover:text-white w-full"
            )}
            type="button"
          >
            Batal
          </AlertDialogCancel>

          <AlertDialogAction
            disabled={isLoading}
            onClick={handleDeleteAccount}
            className={cn(
              buttonVariants({ variant: "outline" }),
              "bg-transparent hover:bg-transparent border-[#D9534F] text-[#D9534F] hover:text-[#D9534F] w-full"
            )}
            type="button"
          >
            {isLoading ? "Loading..." : "Hapus"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export { DeleteAccountDialog };
