import React, { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { useFrappe } from "../../../FrappeContext";
import DocForm from "../../components/DocForm";
import _ from "lodash";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "../../../navigation";
import {
  successNotification,
  errorNotification,
} from "../../utilities/notification";

type Props = {
  id?: string;
};

type ItemType = {
  name: string;
  item_code: string;
  qty: number;
  rate: number;
};

type RecordType = {
  company: string;
  customer: string;
  order_type: string;
  delivery_date: string;
  set_warehouse: string;
  currency: string;
  selling_price_list: string;
  plc_conversion_rate: number;
  items: ItemType[];
};

const DOCTYPE = "Sales Order";

export default function SalesOrderForm({ id }: Props) {
  const { db } = useFrappe();
  const [record, setRecord] = useState<RecordType | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(!!id); // loading true nếu có id
  const navigation = useNavigation<StackNavigationProp>();

  useEffect(() => {
    if (id) {
      db.getDoc(DOCTYPE, id)
        .then((docs: any) => {
          const newItems = docs.items?.map(
            (e: any): ItemType => ({
              name: e.name,
              item_code: e.item_code,
              qty: e.qty,
              rate: e.rate,
            })
          );

          setRecord({
            company: docs.company,
            customer: docs.customer,
            delivery_date: docs.delivery_date,
            order_type: docs.order_type,
            set_warehouse: docs.set_warehouse,
            currency: docs.currency,
            selling_price_list: docs.selling_price_list,
            plc_conversion_rate: docs.plc_conversion_rate,
            items: newItems,
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
        order_type: "Sales",
        set_warehouse: "",
        currency: "",
        selling_price_list: "",
        delivery_date: new Date().toISOString().slice(0, 10),
        plc_conversion_rate: 1,
        items: [],
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

  function createRecord(record: RecordType) {
    db.createDoc(DOCTYPE, record)
      .then((doc: any) => {
        successNotification(`Tạo ${DOCTYPE} thành công!`);
        navigation.navigate("SalesOrder", { id: doc.name });
      })
      .catch((error: any) => {
        errorNotification(`Tạo ${DOCTYPE} thất bại!`);
      });
  }
  function updateRecord(record: RecordType) {
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
          default: record.company,
          required: true,
        },
        {
          label: "Customer",
          field_name: "customer",
          doctype: "Customer",
          type: "link",
          default: record.customer,
          required: true,
        },
        {
          label: "order_type",
          field_name: "order_type",
          type: "select",
          options: [
            { label: "Sales", value: "Sales" },
            { label: "Maintenance", value: "Maintenance" },
            { label: "Shopping Cart", value: "Shopping Cart" },
          ],
          default: record.order_type,
          required: true,
        },
        {
          label: "Delivery date",
          field_name: "delivery_date",
          type: "date",
          required: true,
          default: new Date().toISOString().slice(0, 10),
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
          label: "Currency",
          field_name: "currency",
          doctype: "Currency",
          type: "link",
          default: record.currency,
          required: true,
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
          label: "items",
          type: "child_table",
          field_name: "items",
          doctype: "Sales Order Item",
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
          ],
        },
      ]}
      onSubmit={(data) => {
        const cloned = _.cloneDeep(data);

        const newItems = cloned.items.map((e: any) => ({
          item_code: e.item_code,
          qty: e.qty,
          rate: e.rate,
          warehouse: cloned.set_warehouse,
        }));

        const newRecord = {
          company: cloned.company,
          customer: cloned.customer,
          order_type: cloned.order_type,
          delivery_date: cloned.delivery_date,
          set_warehouse: cloned.set_warehouse,
          currency: cloned.currency,
          selling_price_list: cloned.selling_price_list,
          plc_conversion_rate: cloned.plc_conversion_rate,
          items: newItems,
        };

        if (id) {
          updateRecord(newRecord); // update nếu có id
        } else {
          createRecord(newRecord); // tạo mới nếu không có id
        }
      }}
    />
  );
}
