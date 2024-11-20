import {
  createContext,
  type PropsWithChildren,
  useEffect,
  useState,
  type Dispatch,
  type SetStateAction,
  useContext,
} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "@firebase/auth";
import { auth } from "@libs/firebase";

interface User {
  name: string;
  email: string;
  avatarURL: string;
  idToken: string;
}

const UserContext = createContext<
  | {
      user: User | undefined;
      setUser: Dispatch<SetStateAction<User | undefined>>;
    }
  | undefined
>(undefined);

function UserProvider({ children }: PropsWithChildren) {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user !== null) {
        setUser({
          name: user.displayName ?? "",
          email: user.email ?? "",
          avatarURL: user.photoURL ?? "",
          idToken: await user.getIdToken(true),
        });
      } else {
        setUser(undefined);
      }
      setIsLoading(false);
    });
  }, []);

  useEffect(() => {
    if (user === undefined && location.pathname !== "/") {
      navigate("/");
    }

    if (user !== undefined && location.pathname === "/") {
      navigate("/dashboard");
    }
  }, [user, location, navigate]);

  if (isLoading) {
    return <></>;
  }

  if (user === undefined && location.pathname !== "/") {
    return <></>;
  }

  if (user !== undefined && location.pathname === "/") {
    return <></>;
  }

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

function useUserContext() {
  const user = useContext(UserContext);
  if (user === undefined) {
    throw new Error(
      `"useUserContext" must be used within a "UserContext.Provider"`
    );
  }
  return user;
}

export { UserContext, UserProvider, useUserContext };
