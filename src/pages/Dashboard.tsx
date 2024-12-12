import { useToast } from "@hooks/shadcn/useToast";
import { useAxios } from "@hooks/useAxios";
import { useStore, type Prayer } from "@hooks/useStore";
import { useCallback, useEffect, useState } from "react";

export default function Dashboard() {
  const user = useStore((state) => state.user);
  const prayers = useStore((state) => state.prayers);
  const setPrayers = useStore((state) => state.setPrayers);

  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const createAxiosInstance = useAxios();

  const getCurrentPrayer = useCallback((): Prayer | undefined => {
    if (prayers === undefined || prayers.length === 0) {
      return undefined;
    }

    let currentPrayer: Prayer | undefined;
    const timeUnixInSecs = Math.floor(new Date().getTime() / 1000);

    for (let i = 0; i < prayers.length; i++) {
      if (prayers[i].time > timeUnixInSecs) {
        break;
      } else {
        currentPrayer = prayers[i];
      }
    }

    return currentPrayer;
  }, [prayers]);

  useEffect(() => {
    if (prayers !== undefined) return;
    (async () => {
      setIsLoading(true);
      try {
        const resp = await createAxiosInstance().get<Prayer[]>("/prayers", {
          headers: { Authorization: `Bearer ${user!.idToken}` },
        });

        if (resp.status === 200) {
          setPrayers(resp.data);
        } else {
          throw new Error(`unknown response status code ${resp.status}`);
        }
      } catch (error) {
        console.error(new Error("failed to get to-do lists", { cause: error }));
        toast({
          description: "Gagal menampilkan daftar ibadah salat.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    })();
  }, [prayers, setPrayers, user, toast, createAxiosInstance]);

  if (isLoading) {
    return <p>LOADING...</p>;
  }

  return (
    <>
      <h1>Tandain ibadah hari ini yuk!</h1>
      <p>Hari ini sudah ibadah apa saja? yuk tandain ibadahmu!</p>

      <p>CURRENT IBADAH: {getCurrentPrayer()?.name}</p>
      {prayers !== undefined && prayers.length !== 0 ? (
        prayers.map((item) => {
          const timeUnixInSecs = Math.floor(new Date().getTime() / 1000);
          let boxColor = "";

          if (item.time > timeUnixInSecs) {
            boxColor = "gray";
          } else {
            if (item.status === "ON_TIME") {
              boxColor = "green";
            } else if (item.status === "LATE") {
              boxColor = "orange";
            } else {
              boxColor = "red";
            }
          }

          return <p>{boxColor}</p>;
        })
      ) : (
        <></>
      )}
    </>
  );
}
