import type { Dispatch, SetStateAction } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@components/shadcn/Dialog";
import { WhatsAppVerification } from "@components/WhatsAppVerification";

interface UpdateWhatsAppDialogProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

function UpdateWhatsAppDialog({ open, setOpen }: UpdateWhatsAppDialogProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Edit Nomor WhatsApp</DialogTitle>
        </DialogHeader>
        <WhatsAppVerification setOpen={setOpen} />
      </DialogContent>
    </Dialog>
  );
}

export { UpdateWhatsAppDialog };
