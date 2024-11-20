import { Button } from "@components/shadcn/Button";
import { GoogleAuthProvider, signInWithPopup } from "@firebase/auth";
import { useToast } from "@hooks/shadcn/useToast";
import { useStore } from "@hooks/useStore";
import { auth } from "@libs/firebase";

const provider = new GoogleAuthProvider();
export default function Home(): JSX.Element {
  const { toast } = useToast();
  const setLoggedInWithGoogle = useStore(
    (state) => state.setLoggedInWithGoogle
  );

  async function handleLogin() {
    setLoggedInWithGoogle(true);
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
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
      <Button onClick={handleLogin} variant="outline">
        Login With Google
      </Button>
    </>
  );
}
