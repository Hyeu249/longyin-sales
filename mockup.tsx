export const EVENT_RFID_READ = "";
export type EventSubscription = {
  remove: () => void;
};
export type RFIDTagPayload = {
  epc: string;
  tid: string;
  user: string;
  rssi: string;
  ant: string;
  message: string;
};

export type powerPayload = { antenna: string; power: number };

const RFIDWithUHFA8 = {
  initRFID: () => {
    return true;
  },
  readSingleTag: async () => ({
    epc: "E28011700000021ABC48825B",
    tid: "E28011700000021ABC48825B",
    user: "E28011700000021ABC48825B",
    rssi: "E28011700000021ABC48825B",
    ant: "E28011700000021ABC48825B",
    message: "E28011700000021ABC48825B",
  }),
  freeRFID: () => {
    return true;
  },
  setInventoryCallback: async () => {},
  addListener: (
    one: string,
    two: (three: RFIDTagPayload) => void
  ): EventSubscription => {
    two({
      epc: "E28011700000021ABC48825B",
      tid: "E28011700000021ABC48825B",
      user: "E28011700000021ABC48825B",
      rssi: "E28011700000021ABC48825B",
      ant: "E28011700000021ABC48825B",
      message: "E28011700000021ABC48825B",
    });
    return { remove: () => {} };
  },
  startReadingRFID: () => {
    return true;
  },
  stopReadingRFID: () => {
    return true;
  },
  getRFIDVersion: () => {
    return "true";
  },
  getWorkingMode: () => {
    return "true";
  },
  setAntenna1Power: (one: number) => {
    return { antenna: "", power: 5 };
  },
  getPower: () => {
    return [];
  },
};

export default RFIDWithUHFA8;
