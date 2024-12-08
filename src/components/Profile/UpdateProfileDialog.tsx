import type { Dispatch, SetStateAction } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@components/shadcn/Dialog";
import { WhatsAppVerification } from "@components/WhatsAppVerification";
import { TimeZoneForm } from "@components/TimeZoneForm";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@components/shadcn/Tabs";

interface UpdateWhatsAppDialogProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

function UpdateProfileDialog({ open, setOpen }: UpdateWhatsAppDialogProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Edit Akun</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="whatsapp">
          <TabsList className="block w-fit mx-auto">
            <TabsTrigger value="whatsapp">WhatsApp</TabsTrigger>
            <TabsTrigger value="timezone">Time Zone</TabsTrigger>
          </TabsList>

          <TabsContent value="whatsapp">
            <WhatsAppVerification setOpen={setOpen} />
          </TabsContent>

          <TabsContent value="timezone">
            <TimeZoneForm setOpen={setOpen} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

export { UpdateProfileDialog };
