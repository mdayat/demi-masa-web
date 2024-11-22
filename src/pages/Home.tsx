import { VisiMisi } from "@components/Home/VisiMisi";
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
        <div className="relative z-10 h-full flex flex-col justify-center items-center mx-8">
          <p className="text-white font-bold text-center text-4xl ">
            Mengingatkan Ibadah, Mengingatkan Kebaikan
          </p>
        </div>
      </div>

      <VisiMisi />

      <Button onClick={handleLogin} variant="outline">
        Login With Google
      </Button>
    </>
  );
}
