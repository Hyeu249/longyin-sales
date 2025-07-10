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
import { usePurchaseReceipt, Item, RFID } from "./PurchaseReceiptContext";

type Props = {
  id?: string;
};

const DOCTYPE = "Purchase Receipt";

export default function PurchaseReceiptForm({ id }: Props) {
  const { db } = useFrappe();
  const [loading, setLoading] = useState<boolean>(!!id); // loading true nếu có id
  const navigation = useNavigation<StackNavigationProp>();
  const { sharedData: record, setSharedData: setRecord } = usePurchaseReceipt();

  useEffect(() => {
    if (id) {
      db.getDoc(DOCTYPE, id)
        .then((docs: any) => {
          const newItems = docs.items?.map(
            (e: any): Item => ({
              name: e.name,
              item_code: e.item_code,
              qty: e.qty,
              rate: e.rate,
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
            supplier: docs.supplier,
            currency: docs.currency,
            buying_price_list: docs.buying_price_list,
            conversion_rate: docs.conversion_rate,
            set_warehouse: docs.set_warehouse,
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
        supplier: "",
        currency: "",
        buying_price_list: "",
        conversion_rate: 1,
        set_warehouse: "",
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
        navigation.navigate("PurchaseReceipt", { id: doc.name });
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
          label: "Supplier",
          field_name: "supplier",
          doctype: "Supplier",
          type: "link",
          required: true,
          default: record.supplier,
        },
        {
          label: "Currency",
          field_name: "currency",
          doctype: "Currency",
          type: "link",
          required: true,
          default: record.currency,
        },
        {
          label: "Price_list",
          field_name: "buying_price_list",
          doctype: "Price List",
          type: "link",
          default: record.buying_price_list,
        },
        {
          label: "Conversion rate",
          field_name: "conversion_rate",
          type: "int",
          default: record.conversion_rate,
          required: true,
        },
        {
          label: "Warehouse",
          field_name: "set_warehouse",
          doctype: "Warehouse",
          type: "link",
          default: record.set_warehouse,
          required: true,
        },
        {
          label: "items",
          type: "child_table",
          field_name: "items",
          doctype: "Purchase Receipt Item",
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
              label: "Rate",
              field_name: "rate",
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
            rate: item.rate,
            serial_no: item.serial_no,
            use_serial_batch_fields: 1,
            warehouse: cloned.set_warehouse,
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
          supplier: cloned.supplier,
          currency: cloned.currency,
          buying_price_list: cloned.buying_price_list,
          conversion_rate: cloned.conversion_rate,
          set_warehouse: cloned.set_warehouse,
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
