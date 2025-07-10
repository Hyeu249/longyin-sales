import React, { createContext, useState, useContext, ReactNode } from "react";

// 👉 Item Type
export type Item = {
  name: string;
  item_code: string;
  qty: number;
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
  stock_entry_type: string;
  from_warehouse: string;
  to_warehouse: string;
  items: Item[];
  rfids: RFID[];
};

// 👉 Context type
type StockEntryContextType = {
  sharedData: RecordType | null;
  setSharedData: React.Dispatch<React.SetStateAction<RecordType | null>>;
};

// 👉 Create context with undefined default
const StockEntryContext = createContext<StockEntryContextType | undefined>(
  undefined
);

// 👉 Provider component
export function StockEntryProvider({ children }: { children: ReactNode }) {
  const [sharedData, setSharedData] = useState<RecordType | null>(null);

  return (
    <StockEntryContext.Provider value={{ sharedData, setSharedData }}>
      {children}
    </StockEntryContext.Provider>
  );
}

// 👉 Custom hook
export const useStockEntry = (): StockEntryContextType => {
  const context = useContext(StockEntryContext);
  if (!context) {
    throw new Error("useStockEntry must be used within a StockEntryProvider");
  }
  return context;
};
