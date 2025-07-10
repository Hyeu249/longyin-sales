import React, { useState, useEffect, useRef } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Button } from "react-native-paper";
import { useFrappe } from "../../../FrappeContext";
import { useDeliveryNote, RFID, Item } from "./DeliveryNoteContext";
import _, { clone } from "lodash";
import RelationTable from "../../components/RelationTable";
import useDeepCompareEffect from "use-deep-compare-effect";
import RFIDWithUHFA8, {
  RFIDTagPayload,
  EVENT_RFID_READ,
  EventSubscription,
} from "../../../mockup";

export default function RFIDsList() {
  const { db, call } = useFrappe();
  const { sharedData: record, setSharedData: setRecord } = useDeliveryNote();
  const [stopRead, setStopRead] = useState<Boolean>(true);
  const [rfids, setRfids] = useState<any>([]);
  const recordRef = useRef(record);
  const rfidsRef = useRef(rfids);

  useDeepCompareEffect(() => {
    recordRef.current = record; // update ref mỗi khi count đổi
    rfidsRef.current = rfids; // update ref mỗi khi count đổi
  }, [record, rfids]);

  useEffect(() => {
    const initData = async () => {
      const data = await db.getDocList("RFID Tag", {
        fields: ["name", "item", "gas_serial_no", "warehouse"],
        limit: 10000,
      });

      setRfids(data);
    };
    initData();
  }, []);

  useEffect(() => {
    let subscription: EventSubscription;
    subscription = RFIDWithUHFA8.addListener(
      EVENT_RFID_READ,
      (tag: RFIDTagPayload) => {
        addRFID(tag.epc);
      }
    );
    return () => {
      console.log("remove!!!");
      subscription?.remove();
    };
  }, []);

  const handleStartReadRFID = async () => {
    try {
      const started = await RFIDWithUHFA8.startReadingRFID();
      if (started) setStopRead(false);
    } catch (err) {}
  };

  const handleStopReadRFID = () => {
    try {
      const stopped = RFIDWithUHFA8.stopReadingRFID();
      if (stopped) setStopRead(true);
    } catch (err) {}
  };

  const check_logic_transfer = (rfid_tag: any): boolean => {
    const cRecord = recordRef.current;
    const in_stock = rfid_tag.warehouse === cRecord?.set_warehouse;
    const in_items = cRecord?.items?.some((e) => e.item_code === rfid_tag.item);

    if (in_stock && in_items) return true;
    return false;
  };

  const find_rfid = (rfid: string): [RFID[], RFID | undefined] => {
    const cRecord = recordRef.current;
    const cRfids = rfidsRef.current;
    const old_rfids = cRecord?.rfids?.map((e) => e.rfid_tag);

    const rfid_tag = cRfids.find(
      (e: any) => e.name === rfid && !old_rfids?.includes(rfid)
    );

    if (!rfid_tag || !check_logic_transfer(rfid_tag)) return [[], undefined];

    const found_rfid: RFID = {
      name: rfid_tag.name,
      rfid_tag: rfid_tag.name,
      item: rfid_tag.item,
      gas_serial_no: rfid_tag.gas_serial_no,
    };

    return [cRecord?.rfids || [], found_rfid];
  };

  const updateItems = (new_rfids: RFID[]): Item[] => {
    const cRecord = recordRef.current;
    const newItems = cRecord?.items.map((item: Item): Item => {
      const rfids_tags = new_rfids
        ?.filter((e) => e.item === item.item_code)
        .map((e: any) => e.rfid_tag);
      return {
        name: item.name,
        item_code: item.item_code,
        rate: item.rate,
        qty: rfids_tags.length,
        serial_no: rfids_tags.join("\n"),
      };
    });

    return [...(newItems || [])];
  };

  const updateRfids = (rfids: any = []) => {
    const new_items = updateItems(rfids);
    const cRecord = recordRef.current;

    setRecord({
      company: cRecord?.company || "",
      customer: cRecord?.customer || "",
      currency: cRecord?.currency || "",
      selling_price_list: cRecord?.selling_price_list || "",
      plc_conversion_rate: cRecord?.plc_conversion_rate || 0,
      set_warehouse: cRecord?.set_warehouse || "",
      items: new_items,
      rfids: rfids,
    });
  };

  const addRFID = (rfid: string) => {
    const cRecord = recordRef.current;

    const [record_rfids = [], rfid_tag] = find_rfid(rfid);
    if (!rfid_tag) return;

    const new_rfids: RFID[] = [...record_rfids, rfid_tag];
    const new_items = updateItems(new_rfids);

    setRecord({
      company: cRecord?.company || "",
      customer: cRecord?.customer || "",
      currency: cRecord?.currency || "",
      selling_price_list: cRecord?.selling_price_list || "",
      plc_conversion_rate: cRecord?.plc_conversion_rate || 0,
      set_warehouse: cRecord?.set_warehouse || "",
      items: new_items,
      rfids: new_rfids,
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.buttonRow}>
        <Button
          mode="contained"
          onPress={async () => {
            const tag = await RFIDWithUHFA8.readSingleTag();
            addRFID(tag.epc);
          }}
          style={styles.button}
        >
          Single
        </Button>

        {stopRead ? (
          <Button
            mode="contained"
            onPress={handleStartReadRFID}
            style={styles.button}
          >
            Auto
          </Button>
        ) : (
          <Button
            mode="contained"
            onPress={handleStopReadRFID}
            style={styles.button}
          >
            Stop
          </Button>
        )}
      </View>

      <RelationTable
        tableName=""
        fields={[
          {
            label: "RFID Tag",
            field_name: "rfid_tag",
            doctype: "RFID Tag",
            type: "link",
            required: true,
          },
          {
            label: "Item",
            field_name: "item",
            doctype: "Item",
            type: "link",
            required: true,
          },
          {
            label: "Serial No",
            field_name: "gas_serial_no",
            type: "char",
          },
        ]}
        style={styles.input}
        items={record?.rfids || []}
        setItems={(data = []) => {
          updateRfids(data);
        }}
      />
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    padding: 12,
  },
  card: {
    borderRadius: 12,
    padding: 4,
  },
  input: {
    marginBottom: 12,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12, // khoảng cách giữa 2 button (React Native >= 0.71)
    marginBottom: 12,
  },
  button: {
    flex: 1, // mỗi button chiếm 50% chiều rộng của hàng
    marginHorizontal: 4,
  },
  result: {
    marginTop: 30,
    padding: 15,
    backgroundColor: "#e0f7fa",
    borderRadius: 8,
  },
  resultTitle: {
    fontWeight: "600",
    marginBottom: 10,
    fontSize: 16,
  },
});
