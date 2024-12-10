import { Button } from "@components/shadcn/Button";
import { lazy, useState } from "react";

const CreateToDoListDialog = lazy(() =>
  import("@components/ToDoList/CreateToDoListDialog").then(
    ({ CreateToDoListDialog }) => ({
      default: CreateToDoListDialog,
    })
  )
);

export default function ToDoList() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)} type="button">
        Buat Ibadah
      </Button>

      {open ? <CreateToDoListDialog open={open} setOpen={setOpen} /> : <></>}
    </>
  );
}
