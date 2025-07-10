import React, { useCallback, useEffect } from "react";
import { View, Dimensions } from "react-native";
import { Text } from "react-native-paper";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import DocForm from "../components/DocForm";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "../../navigation";
import HeaderMenu from "../components/HeaderMenu";
import DocList from "../components/DocList";
import { useFrappe } from "../../FrappeContext";

type Props = {
  text?: String;
};

export default function MyTabs({ text }: Props) {
  const { db, call, setAuth } = useFrappe();
  const navigation = useNavigation<StackNavigationProp>();
  const layout = Dimensions.get("window");

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: "first", title: "Detail" },
    { key: "second", title: "Stock Entry" },
  ]);

  const renderScene = SceneMap({
    first: () => (
      <DocForm
        doctype="Material Request"
        fields={[
          {
            name: "Company",
            field_name: "company",
            doctype: "Company",
            type: "link",
            required: true,
          },
          {
            name: "Material request type",
            field_name: "material_request_type",
            doctype: "Material Request Type",
            type: "select",
            options: [
              { label: "Material Transfer", value: "Material Transfer" },
            ],
            default: "Material Transfer",
            readonly: true,
            required: true,
          },
          {
            name: "Schedule date",
            field_name: "schedule_date",
            type: "date",
            required: true,
          },
          {
            name: "Source Warehouse",
            field_name: "set_from_warehouse",
            doctype: "Warehouse",
            type: "link",
            required: true,
          },
          {
            name: "To Warehouse",
            field_name: "set_warehouse",
            doctype: "Warehouse",
            type: "link",
            required: true,
          },
          {
            name: "items",
            type: "child_table",
            field_name: "items",
            doctype: "Material Request Item",
            default: [],
            required: true,
            child_fields: [
              {
                name: "Item",
                field_name: "item_code",
                doctype: "Item",
                type: "link",
                required: true,
              },
              {
                name: "Quantity",
                field_name: "qty",
                type: "int",
                required: true,
              },
              {
                name: "From warehouse",
                field_name: "from_warehouse",
                doctype: "Warehouse",
                type: "link",
                hidden: true,
                required: true,
              },
              {
                name: "Warehouse",
                field_name: "warehouse",
                doctype: "Warehouse",
                type: "link",
                hidden: true,
                required: true,
              },
            ],
          },
        ]}
        onSubmit={(data) => {
          console.log("Submitted data:", data);
        }}
      />
    ),
    second: () => <DocList />,
  });

  useFocusEffect(
    useCallback(() => {
      navigation.setOptions({
        headerTitle: "Material Request",
        headerRight: () => <HeaderMenu />,
      });
      return () => {
        console.log("Cleanup function called");
      };
    }, [])
  );
  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{ width: layout.width }}
      renderTabBar={(props) => (
        <TabBar
          {...props}
          indicatorStyle={{ backgroundColor: "black" }}
          style={{ backgroundColor: "#f4f5f6" }}
          activeColor="black" // màu chữ tab đang chọn
          inactiveColor="gray" // màu chữ tab chưa chọn
        />
      )}
    />
  );
}
