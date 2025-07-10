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

export type RecordType = {
  company: string;
  customer: string;
  currency: string;
  selling_price_list: string;
  plc_conversion_rate: number;
  set_warehouse: string;
  items: Item[];
  rfids: RFID[];
};

// 👉 Context type
type DeliveryNoteContextType = {
  sharedData: RecordType | null;
  setSharedData: React.Dispatch<React.SetStateAction<RecordType | null>>;
};

// 👉 Create context with undefined default
const DeliveryNoteContext = createContext<DeliveryNoteContextType | undefined>(
  undefined
);

// 👉 Provider component
export function DeliveryNoteProvider({ children }: { children: ReactNode }) {
  const [sharedData, setSharedData] = useState<RecordType | null>(null);

  return (
    <DeliveryNoteContext.Provider value={{ sharedData, setSharedData }}>
      {children}
    </DeliveryNoteContext.Provider>
  );
}

// 👉 Custom hook
export const useDeliveryNote = (): DeliveryNoteContextType => {
  const context = useContext(DeliveryNoteContext);
  if (!context) {
    throw new Error(
      "useDeliveryNote must be used within a DeliveryNoteProvider"
    );
  }
  return context;
};
