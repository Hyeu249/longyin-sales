import React, { createContext, useState, useContext, ReactNode } from "react";

// 👉 Item Type
export type Item = {
  name: string;
  item_code: string;
  qty: number;
  rate: number;
  serial_no: string;
};

export type RFID = {
  name: string;
  rfid_tag: string;
  item: string;
  gas_serial_no: string;
};

// 👉 Record Type (1 Stock Entry)
export type RecordType = {
  company: string;
  supplier: string;
  currency: string;
  buying_price_list: string;
  conversion_rate: number;
  set_warehouse: string;
  items: Item[];
  rfids: RFID[];
};

// 👉 Context type
type PurchaseReceiptContextType = {
  sharedData: RecordType | null;
  setSharedData: React.Dispatch<React.SetStateAction<RecordType | null>>;
};

// 👉 Create context with undefined default
const PurchaseReceiptContext = createContext<
  PurchaseReceiptContextType | undefined
>(undefined);

// 👉 Provider component
export function PurchaseReceiptProvider({ children }: { children: ReactNode }) {
  const [sharedData, setSharedData] = useState<RecordType | null>(null);

  return (
    <PurchaseReceiptContext.Provider value={{ sharedData, setSharedData }}>
      {children}
    </PurchaseReceiptContext.Provider>
  );
}

// 👉 Custom hook
export const usePurchaseReceipt = (): PurchaseReceiptContextType => {
  const context = useContext(PurchaseReceiptContext);
  if (!context) {
    throw new Error(
      "usePurchaseReceipt must be used within a PurchaseReceiptProvider"
    );
  }
  return context;
};
