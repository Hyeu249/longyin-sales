import React, { createContext, useContext, useState, useMemo } from "react";
import { FrappeApp } from "frappe-js-sdk";
import { FRAPPE_URL } from "@env";

const FrappeContext = createContext();

export const FrappeProvider = ({ children }) => {
  const [auth, setAuth] = useState({
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

export const useFrappe = () => useContext(FrappeContext);
