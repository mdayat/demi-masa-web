import { Button } from "@components/shadcn/Button";
import { useToast } from "@hooks/shadcn/useToast";
import { useAxios } from "@hooks/useAxios";
import { useStore, type ToDoList } from "@hooks/useStore";
import {
  BoxIcon,
  CheckboxIcon,
  Pencil1Icon,
  TrashIcon,
} from "@radix-ui/react-icons";
import { lazy, useState } from "react";

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
  const user = useStore((state) => state.user);
  const setToDoLists = useStore((state) => state.setToDoLists);

  const [isLoading, setIsLoading] = useState(false);
  const [updateDialogOpened, setUpdateDialogOpened] = useState(false);
  const [deleteDialogOpened, setDeleteDialogOpened] = useState(false);

  const { toast } = useToast();
  const createAxiosInstance = useAxios();

  const handleToggleToDoList = async () => {
    setIsLoading(true);
    try {
      const resp = await createAxiosInstance().put(
        `/tasks/${id}`,
        {
          name: name,
          description: description,
          checked: checked ? false : true,
        },
        {
          headers: {
            Authorization: `Bearer ${user!.idToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (resp.status === 200) {
        toast({
          description: "Berhasil mencentang ibadah.",
          variant: "default",
        });

        setToDoLists((toDoLists) => {
          const idx = toDoLists!.findIndex((item) => item.id === id);
          toDoLists![idx].checked = checked ? false : true;
          return toDoLists;
        });
      } else if (resp.status === 400) {
        throw new Error("invalid request body");
      } else {
        throw new Error(`unknown response status code ${resp.status}`);
      }
    } catch (error) {
      console.error(new Error("failed to update to-do list", { cause: error }));
      toast({
        description: "Gagal mencentang ibadah.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center">
        <h3>{name}</h3>
        <Button
          disabled={isLoading}
          onClick={handleToggleToDoList}
          type="button"
        >
          {checked ? (
            <CheckboxIcon className="w-6 h-6" />
          ) : (
            <BoxIcon className="w-6 h-6" />
          )}
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <Button
          onClick={() => setUpdateDialogOpened(true)}
          type="button"
          className="flex justify-between items-center gap-1"
        >
          <Pencil1Icon className="w-4 h-4" />
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

        <Button
          onClick={() => setDeleteDialogOpened(true)}
          type="button"
          className="flex justify-between items-center gap-1"
        >
          <TrashIcon className="w-4 h-4" />
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

      <p>{description}</p>
    </div>
  );
}

export { ToDoListItem };
