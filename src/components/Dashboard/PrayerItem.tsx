import { Button } from "@components/shadcn/Button";
import { useToast } from "@hooks/shadcn/useToast";
import { useAxios } from "@hooks/useAxios";
import { useStore, type Prayer, type PrayerStatus } from "@hooks/useStore";
import { BoxIcon, CheckboxIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import { getCurrentUnixTime } from "./PrayerList";

interface PrayerItemProps extends Omit<Prayer, "status"> {
  currentUnixTime: number;
}

function PrayerItem({
  currentUnixTime,
  id,
  name,
  unix_time,
  checked_at,
}: PrayerItemProps) {
  const user = useStore((state) => state.user);
  const setPrayers = useStore((state) => state.setPrayers);

  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const createAxiosInstance = useAxios();

  const handleCheckPrayer = async () => {
    setIsLoading(true);
    try {
      const checkedAt = getCurrentUnixTime(user!.timeZone as string);
      const resp = await createAxiosInstance().put<{ status: PrayerStatus }>(
        `/prayers/${id}`,
        {
          prayer_name: name,
          prayer_unix_time: unix_time,
          time_zone: user!.timeZone,
          checked_at: checkedAt,
          account_type: user!.accountType,
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
          description: `Berhasil mencentang ibadah salat ${name}.`,
          variant: "default",
        });

        setPrayers((prayers) => {
          const idx = prayers!.findIndex((item) => item.id === id);

          prayers![idx].status = resp.data.status;
          prayers![idx].checked_at = checkedAt;
          return prayers;
        });
      } else if (resp.status === 400) {
        throw new Error("invalid request body");
      } else {
        throw new Error(`unknown response status code ${resp.status}`);
      }
    } catch (error) {
      console.error(new Error("failed to update prayer", { cause: error }));
      toast({
        description: `Gagal mencentang ibadah salat ${name}.`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="break-words border border-[#E1E1E1] rounded-lg p-3">
      <div className="flex justify-between items-center">
        <h4 className="text-[#363636] font-bold text-lg">Salat {name}</h4>
        <Button
          disabled={
            isLoading || currentUnixTime < unix_time || checked_at !== undefined
          }
          onClick={handleCheckPrayer}
          type="button"
          variant="link"
          className="[&_svg]:size-6"
        >
          {checked_at !== undefined ? (
            <CheckboxIcon className="text-[#1F1F1F]" />
          ) : (
            <BoxIcon className="text-[#1F1F1F]" />
          )}
        </Button>
      </div>

      <span className="text-[#363636] text-sm font-medium">{name}</span>
    </div>
  );
}

export { PrayerItem };
