import { Button } from "@components/shadcn/Button";
import { ToDoListItem } from "@components/ToDoList/ToDoListItem";
import { useToast } from "@hooks/shadcn/useToast";
import { useAxios } from "@hooks/useAxios";
import { useStore, type ToDoList } from "@hooks/useStore";
import { lazy, useEffect, useState } from "react";

const CreateToDoListDialog = lazy(() =>
  import("@components/ToDoList/CreateToDoListDialog").then(
    ({ CreateToDoListDialog }) => ({
      default: CreateToDoListDialog,
    })
  )
);

export default function ToDoList() {
  const user = useStore((state) => state.user);
  const toDoLists = useStore((state) => state.toDoLists);
  const setToDoLists = useStore((state) => state.setToDoLists);

  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { toast } = useToast();
  const createAxiosInstance = useAxios();

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      try {
        const resp = await createAxiosInstance().get<ToDoList[]>("/tasks", {
          headers: { Authorization: `Bearer ${user!.idToken}` },
        });

        if (resp.status === 200) {
          setToDoLists(resp.data);
        } else {
          throw new Error(`unknown response status code ${resp.status}`);
        }
      } catch (error) {
        console.error(new Error("failed to get to-do lists", { cause: error }));
        toast({
          description: "Gagal menampilkan daftar ibadah.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    })();
  }, [setToDoLists, createAxiosInstance, toast, user]);

  if (isLoading) {
    return (
      <div className="flex justify-between items-center">
        <h1>Daftar Ibadah</h1>
        <Button onClick={() => setOpen(true)} type="button">
          Buat Ibadah
        </Button>
        {open ? <CreateToDoListDialog open={open} setOpen={setOpen} /> : <></>}
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-between items-center">
        <h1>Daftar Ibadah</h1>
        <Button onClick={() => setOpen(true)} type="button">
          Buat Ibadah
        </Button>
        {open ? <CreateToDoListDialog open={open} setOpen={setOpen} /> : <></>}
      </div>

      {toDoLists !== undefined && toDoLists.length !== 0 ? (
        toDoLists.map((item) => (
          <ToDoListItem
            key={item.id}
            id={item.id}
            name={item.name}
            description={item.description}
            checked={item.checked}
          />
        ))
      ) : (
        <p>belum memiliki daftar ibadah</p>
      )}
    </>
  );
}
