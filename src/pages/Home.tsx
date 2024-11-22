import { Article } from "@components/Home/Article";
import { Footer } from "@components/Home/Footer";
import { PricingPlan } from "@components/Home/PricingPlan";
import { Surah } from "@components/Home/Surah";
import { VisiMisi } from "@components/Home/VisiMisi";
import { Google } from "@components/Icons/Google";
import { Button } from "@components/shadcn/Button";
import { GoogleAuthProvider, signInWithPopup } from "@firebase/auth";
import { useToast } from "@hooks/shadcn/useToast";
import { auth } from "@libs/firebase";

const provider = new GoogleAuthProvider();
export default function Home(): JSX.Element {
  const { toast } = useToast();
  async function handleLogin() {
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error(new Error("failed to login with Google", { cause: error }));
      if (error instanceof Error) {
        toast({
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          description: "Gagal login menggunakan akun Google",
          variant: "destructive",
        });
      }
    }
  }

  return (
    <>
      <div className="bg-[url('/hero.jpg')] h-screen bg-cover bg-center">
        <div className="relative z-10 h-full flex flex-col justify-center items-center mx-6">
          <h1 className="text-white font-bold text-center text-4xl ">
            Mengingatkan Ibadah, Mengingatkan Kebaikan
          </h1>
        </div>
      </div>

      <VisiMisi />
      <PricingPlan />
      <Surah />
      <Article />

      <div
        id="login-section"
        className="bg-[url('/sunset.jpg')] bg-cover bg-center mt-32 px-6 py-16"
      >
        <div className="bg-white/90 rounded-2xl overflow-hidden pb-6">
          <div className="bg-black/75 grid place-items-center rounded-b-[40px] h-14 mb-6">
            <h2 className="text-white font-bold text-lg">
              Mulai Perjalanan Ibadah
            </h2>
          </div>

          <p className="text-[#363636] text-center mx-4 mb-6">
            Cukup dengan akun Google, tanpa perlu repot-repot membuat akun baru.
          </p>

          <Button
            onClick={handleLogin}
            variant="default"
            className="bg-blue-600 hover:bg-blue-600/90 mx-auto flex items-center justify-between px-2.5 py-5 rounded-full"
          >
            <span className="rounded-full bg-white p-1">
              <Google />
            </span>
            <span className="text-white font-bold">Login dengan Google</span>
          </Button>
        </div>
      </div>

      <Footer />
    </>
  );
}
