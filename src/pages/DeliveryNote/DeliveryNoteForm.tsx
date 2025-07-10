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
import { useDeliveryNote, Item, RFID } from "./DeliveryNoteContext";

type Props = {
  id?: string;
};

const DOCTYPE = "Delivery Note";

export default function DeliveryNoteForm({ id }: Props) {
  const { db } = useFrappe();
  const [loading, setLoading] = useState<boolean>(!!id); // loading true nếu có id
  const navigation = useNavigation<StackNavigationProp>();
  const { sharedData: record, setSharedData: setRecord } = useDeliveryNote();

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
            customer: docs.customer,
            currency: docs.currency,
            selling_price_list: docs.selling_price_list,
            plc_conversion_rate: docs.plc_conversion_rate,
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
        customer: "",
        currency: "",
        selling_price_list: "",
        plc_conversion_rate: 1,
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
        navigation.navigate("DeliveryNote", { id: doc.name });
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
          label: "Customer",
          field_name: "customer",
          doctype: "Customer",
          type: "link",
          required: true,
          default: record.customer,
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
          label: "Price list",
          field_name: "selling_price_list",
          doctype: "Price List",
          type: "link",
          default: record.selling_price_list,
          required: true,
        },
        {
          label: "Conversion rate",
          field_name: "plc_conversion_rate",
          type: "int",
          default: record.plc_conversion_rate,
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
          doctype: "Delivery Note Item",
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
          customer: cloned.customer,
          currency: cloned.currency,
          selling_price_list: cloned.selling_price_list,
          plc_conversion_rate: cloned.plc_conversion_rate,
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
