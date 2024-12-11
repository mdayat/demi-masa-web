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
import { cn } from "@libs/shadcn";
import { useState, type Dispatch, type SetStateAction } from "react";

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
  const user = useStore((state) => state.user);
  const setToDoLists = useStore((state) => state.setToDoLists);

  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const createAxiosInstance = useAxios();

  const handleDeleteTask = async () => {
    setIsLoading(true);
    try {
      const resp = await createAxiosInstance().delete(`/tasks/${id}`, {
        headers: { Authorization: `Bearer ${user!.idToken}` },
      });

      if (resp.status === 200) {
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
      } else {
        throw new Error(`unknown response status code ${resp.status}`);
      }
    } catch (error) {
      console.error(new Error("failed to delete to-do list", { cause: error }));
      toast({
        description: "Gagal menghapus ibadah.",
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

          <AlertDialogAction
            disabled={isLoading}
            onClick={handleDeleteTask}
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

export { DeleteToDoListDialog };
