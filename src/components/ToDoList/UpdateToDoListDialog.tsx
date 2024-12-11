import { useState, type Dispatch, type SetStateAction } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@components/shadcn/Dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@components/shadcn/Form";
import { Input } from "@components/shadcn/Input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useStore } from "@hooks/useStore";
import { useToast } from "@hooks/shadcn/useToast";
import { useAxios } from "@hooks/useAxios";
import { Button } from "@components/shadcn/Button";
import { Textarea } from "@components/shadcn/Textarea";

interface UpdateToDoListDialogProps {
  id: string;
  name: string;
  description: string;
  checked: boolean;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const formSchema = z.object({
  name: z.string().min(1, { message: "Nama ibadah tidak boleh kosong." }),
  description: z.string(),
});

function UpdateToDoListDialog({
  id,
  name,
  description,
  checked,
  open,
  setOpen,
}: UpdateToDoListDialogProps) {
  const user = useStore((state) => state.user);
  const setToDoLists = useStore((state) => state.setToDoLists);

  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const createAxiosInstance = useAxios();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name, description },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      const resp = await createAxiosInstance().put(
        `/tasks/${id}`,
        { name: values.name, description: values.description, checked },
        {
          headers: {
            Authorization: `Bearer ${user!.idToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (resp.status === 200) {
        toast({
          description: "Berhasil mengubah ibadah.",
          variant: "default",
        });

        setToDoLists((toDoLists) => {
          const idx = toDoLists!.findIndex((item) => item.id === id);
          toDoLists![idx].name = values.name;
          toDoLists![idx].description = values.description;
          return toDoLists;
        });
        setOpen(false);
      } else if (resp.status === 400) {
        throw new Error("invalid request body");
      } else {
        throw new Error(`unknown response status code ${resp.status}`);
      }
    } catch (error) {
      console.error(new Error("failed to update to-do list", { cause: error }));
      toast({
        description: "Gagal mengubah ibadah.",
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
          <DialogTitle>Ubah Ibadah</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            autoComplete="off"
            className="space-y-8"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Ibadah</FormLabel>
                  <FormControl>
                    <Input disabled={isLoading} type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Deskripsi Ibadah</FormLabel>
                  <FormControl>
                    <Textarea disabled={isLoading} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button disabled={isLoading} type="submit" className="w-full">
              {isLoading ? "Loading..." : "Submit"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export { UpdateToDoListDialog };
