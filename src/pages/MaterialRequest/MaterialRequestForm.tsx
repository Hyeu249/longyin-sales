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
  qty: string;
};

type RecordType = {
  company: string;
  material_request_type: string;
  schedule_date: string;
  set_from_warehouse: string;
  set_warehouse: string;
  items: ItemType[];
};

const DOCTYPE = "Material Request";

export default function MaterialRequestForm({ id }: Props) {
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
            })
          );

          setRecord({
            company: docs.company,
            material_request_type: docs.material_request_type,
            schedule_date: docs.schedule_date,
            set_from_warehouse: docs.set_from_warehouse,
            set_warehouse: docs.set_warehouse,
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
        material_request_type: "Material Transfer",
        schedule_date: new Date().toISOString().slice(0, 10),
        set_from_warehouse: "",
        set_warehouse: "",
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
        navigation.navigate("MaterialRequest", { id: doc.name });
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
          required: true,
          default: record.company,
        },
        {
          label: "Material request type",
          field_name: "material_request_type",
          doctype: "Material Request Type",
          type: "select",
          options: [{ label: "Material Transfer", value: "Material Transfer" }],
          default: record.material_request_type,
          readonly: true,
          required: true,
        },
        {
          label: "Schedule date",
          field_name: "schedule_date",
          type: "date",
          default: record.schedule_date,
          required: true,
        },
        {
          label: "Source Warehouse",
          field_name: "set_from_warehouse",
          doctype: "Warehouse",
          type: "link",
          default: record.set_from_warehouse,
          required: true,
        },
        {
          label: "To Warehouse",
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
          doctype: "Material Request Item",
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
          ],
        },
      ]}
      onSubmit={(data) => {
        const cloned = _.cloneDeep(data);

        const newItems = cloned.items.map((e: any) => ({
          item_code: e.item_code,
          qty: e.qty,
          from_warehouse: cloned.set_from_warehouse,
          warehouse: cloned.set_warehouse,
        }));

        const newRecord = {
          company: cloned.company,
          material_request_type: cloned.material_request_type,
          schedule_date: cloned.schedule_date,
          set_from_warehouse: cloned.set_from_warehouse,
          set_warehouse: cloned.set_warehouse,
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
