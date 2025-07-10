import React, { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { useFrappe } from "../../../FrappeContext";
import DocForm from "../../components/DocForm";
import _ from "lodash";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "../../../navigation";
import {
  successNotification,
  errorNotification,
} from "../../utilities/notification";
import { useStockEntry, Item, RFID } from "./StockEntryContext";

type Props = {
  id?: string;
};

const DOCTYPE = "Stock Entry";

export default function StockEntryForm({ id }: Props) {
  const { db } = useFrappe();
  const [loading, setLoading] = useState<boolean>(!!id); // loading true nếu có id
  const navigation = useNavigation<StackNavigationProp>();
  const { sharedData: record, setSharedData: setRecord } = useStockEntry();

  useEffect(() => {
    if (id) {
      db.getDoc(DOCTYPE, id)
        .then((docs: any) => {
          const newItems = docs.items?.map(
            (e: any): Item => ({
              name: e.name,
              item_code: e.item_code,
              qty: e.qty,
              serial_no: e.serial_no,
            })
          );

          const newRfids = docs.rfids?.map(
            (e: any): RFID => ({
              name: e.name,
              rfid_tag: e.rfid_tag,
              item: e.item,
              gas_serial_no: e.gas_serial_no,
            })
          );

          setRecord({
            company: docs.company,
            stock_entry_type: docs.stock_entry_type,
            from_warehouse: docs.from_warehouse,
            to_warehouse: docs.to_warehouse,
            items: newItems,
            rfids: newRfids,
          });
        })
        .catch((error: any) => {
          console.error(error);
        })
        .finally(() => setLoading(false));
    } else {
      // Nếu không có id thì set default record (optional)
      setRecord({
        company: "",
        stock_entry_type: "Material Transfer",
        from_warehouse: "",
        to_warehouse: "",
        items: [],
        rfids: [],
      });
    }
  }, [id]);

  if (loading || !record) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  function createRecord(record: any) {
    db.createDoc(DOCTYPE, record)
      .then((doc: any) => {
        successNotification(`Tạo ${DOCTYPE} thành công!`);
        navigation.navigate("StockEntry", { id: doc.name });
      })
      .catch((error: any) => {
        errorNotification(`Tạo ${DOCTYPE} thất bại!`);
      });
  }
  function updateRecord(record: any) {
    db.updateDoc(DOCTYPE, id || "", record)
      .then((doc: any) => {
        successNotification(`Sửa ${DOCTYPE} thành công!`);
      })
      .catch((error: any) => {
        errorNotification(`Sửa ${DOCTYPE} thất bại!`);
      });
  }

  return (
    <DocForm
      fields={[
        {
          label: "Company",
          field_name: "company",
          doctype: "Company",
          type: "link",
          required: true,
          default: record.company,
        },
        {
          label: "Stock Entry type",
          field_name: "stock_entry_type",
          doctype: "Stock Entry Type",
          type: "link",
          options: [{ label: "Material Transfer", value: "Material Transfer" }],
          default: record.stock_entry_type,
          required: true,
        },
        {
          label: "Source Warehouse",
          field_name: "from_warehouse",
          doctype: "Warehouse",
          type: "link",
          default: record.from_warehouse,
          required: true,
        },
        {
          label: "To Warehouse",
          field_name: "to_warehouse",
          doctype: "Warehouse",
          type: "link",
          default: record.to_warehouse,
          required: true,
        },
        {
          label: "items",
          type: "child_table",
          field_name: "items",
          doctype: "Stock Entry Detail",
          default: record.items,
          required: true,
          child_fields: [
            {
              label: "Item",
              field_name: "item_code",
              doctype: "Item",
              type: "link",
              required: true,
            },
            {
              label: "Quantity",
              field_name: "qty",
              type: "int",
              required: true,
            },
            {
              label: "Serial no",
              field_name: "serial_no",
              type: "char",
              required: true,
              hidden: true,
            },
          ],
        },
      ]}
      onSubmit={(data) => {
        const cloned = _.cloneDeep(data);

        const newItems = cloned.items.map((item: any) => {
          return {
            item_code: item.item_code,
            qty: item.qty,
            serial_no: item.serial_no,
            use_serial_batch_fields: 1,
            s_warehouse: cloned.from_warehouse,
            t_warehouse: cloned.to_warehouse,
          };
        });

        const newRFIDs = record.rfids.map((item: any) => {
          return {
            rfid_tag: item.rfid_tag,
            item: item.item,
            gas_serial_no: item.gas_serial_no,
          };
        });

        const newRecord = {
          company: cloned.company,
          stock_entry_type: cloned.stock_entry_type,
          from_warehouse: cloned.from_warehouse,
          to_warehouse: cloned.to_warehouse,
          items: newItems,
          rfids: newRFIDs,
        };

        console.log("newRecord: ", newRecord);

        if (id) {
          updateRecord(newRecord); // update nếu có id
        } else {
          createRecord(newRecord); // tạo mới nếu không có id
        }
      }}
    />
  );
}
