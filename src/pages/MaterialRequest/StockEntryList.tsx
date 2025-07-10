import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
import DocTabTable from "../../components/DocTabTable";
import { useFrappe } from "../../../FrappeContext";
import { StackNavigationProp } from "../../../navigation";
import { useNavigation } from "@react-navigation/native";

type Props = {
  id?: String;
};

type Record = {
  name: String;
  docstatus: String;
};

export default function StockEntryList({ id }: Props) {
  const { db, call } = useFrappe();
  const [records, setRecords] = useState<Record[]>([]);
  const navigation = useNavigation<StackNavigationProp>();

  useEffect(() => {
    const initData = async () => {
      const searchParams = {
        doctype: "Stock Entry",
        fields: ["name", "docstatus", "purpose"],
        filters: [["Stock Entry Detail", "material_request", "=", id]],
      };

      const response = await call.get(
        "frappe.desk.reportview.get",
        searchParams
      );
      const data = response?.message?.values;
      if (Array.isArray(data)) {
        setRecords(
          data.map((res: any): Record => {
            return { name: res[0], docstatus: res[1] };
          })
        );
      }
    };

    if (id) initData();
  }, [id]);
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <DocTabTable
        fields={[
          {
            label: "ID",
            field_name: "name",
            type: "char",
          },
          {
            label: "docstatus",
            field_name: "docstatus",
            type: "int",
          },
        ]}
        style={styles.input}
        items={records}
        onOpen={(data: any) =>
          navigation.navigate("StockEntry", { id: data.name })
        }
        onSelect={(data: any) => console.log("data: ", data)}
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
  button: {
    marginTop: 12,
  },
});
