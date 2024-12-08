import { Badge } from "@components/shadcn/Badge";
import { Button } from "@components/shadcn/Button";
import { useToast } from "@hooks/shadcn/useToast";
import { useAxios } from "@hooks/useAxios";
import { useStore, type Transaction } from "@hooks/useStore";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function formatDate(isoString: string) {
  const date = new Date(isoString);
  const formattedDate = date.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  return formattedDate;
}

function TxHistory() {
  const user = useStore((state) => state.user);
  const transactions = useStore((state) => state.transactions);
  const setTransactions = useStore((state) => state.setTransactions);
  const [isLoading, setIsLoading] = useState(false);

  const { toast } = useToast();
  const createAxiosInstance = useAxios();

  useEffect(() => {
    if (transactions !== undefined) return;
    setIsLoading(true);

    (async () => {
      try {
        const resp = await createAxiosInstance().get<Transaction[]>(
          "/transactions",
          { headers: { Authorization: `Bearer ${user!.idToken}` } }
        );

        if (resp.status === 200) {
          setTransactions(resp.data);
        } else {
          throw new Error(`unknown response status code ${resp.status}`);
        }
      } catch (error) {
        console.error(
          new Error("failed to get transactions", { cause: error })
        );

        toast({
          description: "Gagal menampilkan daftar riwayat transaksi",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    })();
  }, [transactions, user, toast, createAxiosInstance, setTransactions]);

  if (isLoading) {
    return (
      <p className="text-[#7B7B7B] text-center font-bold italic border border-[#C2C2C2] rounded-2xl p-6 mx-6">
        Loading...
      </p>
    );
  }

  if (transactions === undefined || transactions.length === 0) {
    return (
      <p className="text-[#7B7B7B] text-center font-medium border border-[#C2C2C2] rounded-2xl p-6 mx-6">
        Belum ada transaksi
      </p>
    );
  }

  return transactions.map((item, index) => {
    const secondsInMonth = 60 * 60 * 24 * 30;
    const totalDurationInMs = secondsInMonth * item.duration_in_months * 1000;

    return (
      <div
        key={item.id}
        className={`${index === transactions.length - 1 ? "mb-0" : "mb-4"} border border-[#C2C2C2] rounded-2xl p-6 mx-6`}
      >
        <div className="flex items-center gap-3">
          <Badge className="bg-[#BF8E50] hover:bg-[#BF8E50] text-white">
            Premium
          </Badge>

          <Badge
            variant="outline"
            className={`${item.status === "PAID" ? "border-[#67ACE8] text-[#67ACE8]" : "border-[#E89895] text-[#E89895]"}`}
          >
            {item.status === "PAID" ? "Paid" : "Unpaid"}
          </Badge>
        </div>

        <p className="text-[#7B7B7B] font-medium text-sm my-4">
          Berlaku hingga:&nbsp;
          {item.status === "PAID"
            ? formatDate(
                new Date(
                  new Date(item.paid_at).getTime() + totalDurationInMs
                ).toISOString()
              )
            : formatDate(item.expired_at)}
        </p>

        <div className="flex justify-between items-center">
          <p className="text-[#363636] font-bold">
            Rp{Intl.NumberFormat("id-ID").format(item.price)}
          </p>

          {item.status === "PAID" ? (
            <></>
          ) : (
            <Button
              asChild
              className="text-white hover:text-white bg-[#BF8E50] hover:bg-[#BF8E50]/90 w-24"
            >
              <Link to={item.qr_url} target="_blank" rel="noopener">
                Bayar
              </Link>
            </Button>
          )}
        </div>
      </div>
    );
  });
}

export { TxHistory };
