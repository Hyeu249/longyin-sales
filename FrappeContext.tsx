import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  ReactNode,
} from "react";
import { FrappeApp, FrappeDB, FrappeCall } from "frappe-js-sdk";
const FRAPPE_URL = "https://thanh.bhieu.com";

// Kiểu Auth
interface Auth {
  api_key: string;
  secret_key: string;
}

// Kiểu context
interface FrappeContextType {
  db: FrappeDB;
  call: FrappeCall;
  setAuth: React.Dispatch<React.SetStateAction<Auth>>;
}

const FrappeContext = createContext<FrappeContextType | undefined>(undefined);

interface FrappeProviderProps {
  children: ReactNode;
}

export const FrappeProvider: React.FC<FrappeProviderProps> = ({ children }) => {
  const [auth, setAuth] = useState<Auth>({
    api_key: "c5@gmail.com",
    secret_key: "Longyin123@",
  });

  const frappeApp = useMemo(() => {
    return new FrappeApp(FRAPPE_URL, {
      useToken: true,
      token: () => `${auth.api_key}:${auth.secret_key}`,
      type: "token",
    });
  }, [auth.api_key, auth.secret_key]);

  const db = frappeApp.db();
  const call = frappeApp.call();

  return (
    <FrappeContext.Provider value={{ db, call, setAuth }}>
      {children}
    </FrappeContext.Provider>
  );
};

export const useFrappe = (): FrappeContextType => {
  const context = useContext(FrappeContext);
  if (!context) {
    throw new Error("useFrappe must be used within a FrappeProvider");
  }
  return context;
};
