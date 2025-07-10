import React, { useCallback, useState } from "react";
import { Dimensions } from "react-native";
import { TabView, TabBar } from "react-native-tab-view";
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import {
  StackNavigationProp,
  MaterialRequestRouteProp,
} from "../../../navigation";
import HeaderMenu from "../../components/HeaderMenu";
import MaterialRequestForm from "./MaterialRequestForm";
import StockEntryList from "./StockEntryList";
import { useFrappe } from "../../../FrappeContext";
import {
  successNotification,
  errorNotification,
} from "../../utilities/notification";

const DOCTYPE = "Material Request";

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
      title: "Create Stock Entry",
      onPress: async () => {
        if (!id) return;

        try {
          const searchParams = {
            source_name: id,
          };
          const doc = await db.getDoc(DOCTYPE, id);

          if (doc.docstatus !== 1) return;

          const data = await call.get(
            "erpnext.stock.doctype.material_request.material_request.make_stock_entry",
            searchParams
          );
          const stockEntry = await db.createDoc("Stock Entry", data.message);
          successNotification("Create Stock Entry thành công!");

          console.log("stockEntry: ", stockEntry);
          navigation.navigate("StockEntry", { id: stockEntry.name });
        } catch (error: any) {
          errorNotification("Create Stock Entry thất bại!");
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

export default function MaterialRequest() {
  const navigation = useNavigation<StackNavigationProp>();
  const route = useRoute<MaterialRequestRouteProp>();
  const { id } = route.params;
  const frappe = useFrappe();

  const layout = Dimensions.get("window");
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "first", title: "Detail" },
    { key: "second", title: "Stock Entry" },
  ]);

  // ✅ renderScene không dùng SceneMap để giữ state
  const renderScene = ({ route }: any) => {
    switch (route.key) {
      case "first":
        return <MaterialRequestForm id={id} />;
      case "second":
        return <StockEntryList id={id} />;
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
