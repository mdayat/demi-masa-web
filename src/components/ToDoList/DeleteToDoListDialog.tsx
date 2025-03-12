import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@components/shadcn/AlertDialog";
import { Button, buttonVariants } from "@components/shadcn/Button";
import { useToast } from "@hooks/shadcn/useToast";
import { useStore } from "@hooks/useStore";
import { cn } from "@libs/shadcn";
import { useState, type Dispatch, type SetStateAction } from "react";
import { useAuthContext } from "../../contexts/AuthProvider";
import axiosRetry from "axios-retry";
import type { AxiosError } from "axios";

interface DeleteToDoListDialogProps {
  id: string;
  name: string;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

function DeleteToDoListDialog({
  id,
  name,
  open,
  setOpen,
}: DeleteToDoListDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const setToDoLists = useStore((state) => state.setToDoLists);
  const { retryWithRefresh } = useAuthContext();
  const { toast } = useToast();

  const handleDeleteTask = async () => {
    setIsLoading(true);
    try {
      const res = await retryWithRefresh.delete(`/tasks/${id}`);
      if (res.status === 200) {
        toast({
          description: "Berhasil menghapus ibadah.",
          variant: "default",
        });

        setToDoLists((toDoLists) => {
          const idx = toDoLists!.findIndex((item) => item.id === id);
          toDoLists!.splice(idx, 1);
          return toDoLists;
        });
        setOpen(false);
      }
    } catch (error) {
      const status = (error as AxiosError).response?.status;
      if (
        axiosRetry.isNetworkError(error as AxiosError) ||
        (status || 0) >= 500
      ) {
        toast({
          description: "Gagal menghapus ibadah.",
          variant: "destructive",
        });
      }

      console.error(new Error("failed to delete to-do list", { cause: error }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent className="max-w-sm">
        <AlertDialogHeader>
          <AlertDialogTitle>
            Apakah kamu yakin ingin menghapus ibadah <strong>{name}</strong>?
          </AlertDialogTitle>

          <AlertDialogDescription>
            Ibadah <strong>{name}</strong> akan dihapus secara permanen.
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

          <Button
            disabled={isLoading}
            onClick={handleDeleteTask}
            type="button"
            variant="outline"
            className="bg-transparent hover:bg-transparent border-[#D9534F] text-[#D9534F] hover:text-[#D9534F] w-full"
          >
            {isLoading ? "Loading..." : "Hapus"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export { DeleteToDoListDialog };
