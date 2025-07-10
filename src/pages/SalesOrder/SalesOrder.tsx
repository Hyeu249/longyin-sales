import React, { useCallback, useState } from "react";
import { Dimensions } from "react-native";
import { TabView, TabBar } from "react-native-tab-view";
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { StackNavigationProp, SalesOrderRouteProp } from "../../../navigation";
import HeaderMenu from "../../components/HeaderMenu";
import SalesOrderForm from "./SalesOrderForm";
import DeliveryNoteList from "./DeliveryNoteList";
import { useFrappe } from "../../../FrappeContext";
import {
  successNotification,
  errorNotification,
} from "../../utilities/notification";

const DOCTYPE = "Sales Order";

function getMenu(frappe: any, navigation: StackNavigationProp, id?: string) {
  const { db, call } = frappe;
  return [
    {
      title: "Submit",
      onPress: async () => {
        if (!id) return;

        try {
          const doc = await db.getDoc(DOCTYPE, id);
          if (doc.docstatus != 0) return;
          await db.submit(doc);
          successNotification(`Submit ${DOCTYPE} thành công!`);
        } catch (error: any) {
          errorNotification(`Submit ${DOCTYPE} thất bại!`);
        }
      },
    },
    {
      title: "Create Delivery Note",
      onPress: async () => {
        console.log("id: ", id);
        if (!id) return;

        try {
          const searchParams = {
            source_name: id,
            args: {
              delivery_dates: [],
              for_reserved_stock: true,
            },
            selected_children: {},
          };
          const doc = await db.getDoc(DOCTYPE, id);

          if (doc.docstatus !== 1) return;

          const data = await call.get(
            "erpnext.selling.doctype.sales_order.sales_order.make_delivery_note",
            searchParams
          );
          const record = await db.createDoc("Delivery Note", data.message);
          successNotification("Create Delivery Note thành công!");

          console.log("record: ", record);
          navigation.navigate("DeliveryNote", { id: record.name });
        } catch (error: any) {
          errorNotification("Create Delivery Note thất bại!");
        }
      },
    },
    {
      title: "Delete",
      onPress: async () => {
        if (!id) return;
        try {
          await db.deleteDoc(DOCTYPE, id);
          successNotification(`Xóa ${DOCTYPE} thành công!`);

          navigation.goBack();
        } catch (error: any) {
          errorNotification(`Xóa ${DOCTYPE} thất bại!`);
        }
      },
    },
  ];
}

export default function SalesOrder() {
  const navigation = useNavigation<StackNavigationProp>();
  const route = useRoute<SalesOrderRouteProp>();
  const { id } = route.params;
  const frappe = useFrappe();

  const layout = Dimensions.get("window");
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "first", title: "Detail" },
    { key: "second", title: "Delivery Note" },
  ]);

  // ✅ renderScene không dùng SceneMap để giữ state
  const renderScene = ({ route }: any) => {
    switch (route.key) {
      case "first":
        return <SalesOrderForm id={id} />;
      case "second":
        return <DeliveryNoteList id={id} />;
      default:
        return null;
    }
  };

  useFocusEffect(
    useCallback(() => {
      navigation.setOptions({
        headerTitle: DOCTYPE,
        headerRight: () => (
          <HeaderMenu items={getMenu(frappe, navigation, id)} />
        ),
      });
      return () => {
        console.log("Cleanup function called");
      };
    }, [id])
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
          activeColor="black"
          inactiveColor="gray"
        />
      )}
    />
  );
}
