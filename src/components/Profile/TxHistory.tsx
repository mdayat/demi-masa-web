import { Badge } from "@components/shadcn/Badge";
import { useToast } from "@hooks/shadcn/useToast";
import { useAxios } from "@hooks/useAxios";
import { useStore, type PaymentStatus } from "@hooks/useStore";
import { useEffect, useState } from "react";
import moment from "moment";

interface Order {
  id: string;
  payment_status: PaymentStatus;
  amount: number;
  subscription_duration: number;
  paid_at: string;
}

function formatDate(paidAt: string, subscriptionDuration: number): string {
  const startDate = moment(paidAt, "YYYY-MM-DD HH:mm:ss.SSSSSS Z", "en");
  let formattedStartDate = "";
  let formattedEndDate = "";
  let invalidDateFormatMsg = "";

  if (startDate.isValid()) {
    const endDate = startDate.clone().add(subscriptionDuration, "seconds");
    formattedStartDate = startDate.format("D MMMM YYYY");
    formattedEndDate = endDate.format("D MMMM YYYY");
  } else {
    const msg = "invalid date format";
    invalidDateFormatMsg = msg;
    console.error(new Error(msg));
  }

  return invalidDateFormatMsg === ""
    ? `${formattedStartDate} - ${formattedEndDate}`
    : invalidDateFormatMsg;
}

function TxHistory() {
  const user = useStore((state) => state.user);
  const txHistories = useStore((state) => state.txHistories);
  const setTxHistories = useStore((state) => state.setTxHistories);
  const [isLoading, setIsLoading] = useState(false);

  const { toast } = useToast();
  const createAxiosInstance = useAxios();

  useEffect(() => {
    if (txHistories !== undefined) return;
    setIsLoading(true);

    (async () => {
      try {
        const resp = await createAxiosInstance().get<{
          orders: Order[] | null;
        }>("/orders", {
          headers: { Authorization: `Bearer ${user!.idToken}` },
        });

        if (resp.status !== 200) {
          throw new Error(`unknown response status code ${resp.status}`);
        }

        if (resp.data.orders !== null) {
          setTxHistories(
            resp.data.orders.map((order) => ({
              orderID: order.id,
              status: order.payment_status,
              amount: order.amount,
              subscriptionDuration: order.subscription_duration,
              paidAt: order.paid_at ?? "",
            }))
          );
        }
      } catch (error) {
        console.error(new Error("failed to get orders", { cause: error }));
        toast({
          description: "Gagal menampilkan daftar riwayat transaksi",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    })();
  }, [txHistories, user, toast, createAxiosInstance, setTxHistories]);

  if (isLoading) {
    return (
      <p className="text-[#7B7B7B] text-center font-bold italic border border-[#C2C2C2] rounded-2xl p-6 mx-6">
        Sedang mengecek riwayat transaksi...
      </p>
    );
  }

  if (txHistories === undefined) {
    return (
      <p className="text-[#7B7B7B] text-center font-medium border border-[#C2C2C2] rounded-2xl p-6 mx-6">
        Belum ada transaksi
      </p>
    );
  }

  return txHistories.map((item) => {
    return (
      <div
        key={item.orderID}
        className="border border-[#C2C2C2] rounded-2xl p-6 mx-6"
      >
        <div className="flex items-center gap-3">
          <Badge className="bg-[#BF8E50] hover:bg-[#BF8E50] text-white">
            Premium
          </Badge>

          <Badge
            variant="outline"
            className={`${item.status === "paid" ? "border-[#67ACE8] text-[#67ACE8]" : "border-[#E89895] text-[#E89895]"}`}
          >
            {item.status === "paid" ? "Paid" : "Unpaid"}
          </Badge>
        </div>

        <p className="text-[#7B7B7B] font-medium text-sm my-3">
          {item.status === "paid"
            ? formatDate(item.paidAt, item.subscriptionDuration)
            : ""}
        </p>

        <p className="text-[#363636] font-bold">Rp{item.amount}</p>
      </div>
    );
  });
}

export { TxHistory };
