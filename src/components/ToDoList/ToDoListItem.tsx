import { Button } from "@components/shadcn/Button";
import { useToast } from "@hooks/shadcn/useToast";
import { useStore, type ToDoList } from "@hooks/useStore";
import {
  BoxIcon,
  CheckboxIcon,
  Pencil1Icon,
  TrashIcon,
} from "@radix-ui/react-icons";
import { lazy, useState } from "react";
import { useAxiosContext } from "../../contexts/AxiosProvider";
import axiosRetry from "axios-retry";
import type { AxiosError } from "axios";

const UpdateToDoListDialog = lazy(() =>
  import("@components/ToDoList/UpdateToDoListDialog").then(
    ({ UpdateToDoListDialog }) => ({
      default: UpdateToDoListDialog,
    })
  )
);

const DeleteToDoListDialog = lazy(() =>
  import("@components/ToDoList/DeleteToDoListDialog").then(
    ({ DeleteToDoListDialog }) => ({
      default: DeleteToDoListDialog,
    })
  )
);

function ToDoListItem({ id, name, description, checked }: ToDoList) {
  const [isLoading, setIsLoading] = useState(false);
  const [updateDialogOpened, setUpdateDialogOpened] = useState(false);
  const [deleteDialogOpened, setDeleteDialogOpened] = useState(false);

  const setToDoLists = useStore((state) => state.setToDoLists);
  const { toast } = useToast();
  const { retryWithRefresh } = useAxiosContext();

  const handleToggleToDoList = async () => {
    setIsLoading(true);
    try {
      const res = await retryWithRefresh.put(
        `/tasks/${id}`,
        {
          name: name,
          description: description,
          checked: checked ? false : true,
        },
        { headers: { "Content-Type": "application/json" } }
      );

      if (res.status === 200) {
        toast({
          description: checked
            ? "Berhasil tidak mencentang ibadah."
            : "Berhasil mencentang ibadah.",
          variant: "default",
        });

        setToDoLists((toDoLists) => {
          const idx = toDoLists!.findIndex((item) => item.id === id);
          toDoLists![idx].checked = checked ? false : true;
          return toDoLists;
        });
      }
    } catch (error) {
      const status = (error as AxiosError).response?.status;
      if (
        axiosRetry.isNetworkError(error as AxiosError) ||
        (status || 0) >= 500
      ) {
        toast({
          description: checked
            ? "Gagal tidak mencentang ibadah."
            : "Gagal mencentang ibadah.",
          variant: "destructive",
        });
      }

      console.error(new Error("failed to update to-do list", { cause: error }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="break-words border border-[#C2C2C2] rounded-lg p-5">
      <div className="flex justify-between items-center">
        <h3 className="text-[#363636] font-bold text-lg">{name}</h3>
        <Button
          disabled={isLoading}
          onClick={handleToggleToDoList}
          type="button"
          variant="link"
          className="[&_svg]:size-6"
        >
          {checked ? <CheckboxIcon /> : <BoxIcon />}
        </Button>
      </div>

      <div className="flex items-center my-2">
        <Button
          onClick={() => setUpdateDialogOpened(true)}
          type="button"
          variant="link"
          className="text-[#7B7B7B] hover:no-underline font-semibold flex items-center gap-2 min-w-16 p-0"
        >
          <Pencil1Icon />
          Edit
        </Button>

        {updateDialogOpened ? (
          <UpdateToDoListDialog
            id={id}
            name={name}
            description={description}
            checked={checked}
            open={updateDialogOpened}
            setOpen={setUpdateDialogOpened}
          />
        ) : (
          <></>
        )}

        <div className="bg-[#7B7B7B] w-0.5 h-5 mx-4"></div>

        <Button
          onClick={() => setDeleteDialogOpened(true)}
          type="button"
          variant="link"
          className="text-[#7B7B7B] hover:no-underline font-semibold flex items-center gap-2 min-w-16 p-0"
        >
          <TrashIcon />
          Hapus
        </Button>

        {deleteDialogOpened ? (
          <DeleteToDoListDialog
            id={id}
            name={name}
            open={deleteDialogOpened}
            setOpen={setDeleteDialogOpened}
          />
        ) : (
          <></>
        )}
      </div>

      <p className="text-[#7B7B7B]">{description}</p>
    </div>
  );
}

export { ToDoListItem };
