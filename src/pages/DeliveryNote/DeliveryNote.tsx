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
  DeliveryNoteRouteProp,
} from "../../../navigation";
import HeaderMenu from "../../components/HeaderMenu";
import DeliveryNoteForm from "./DeliveryNoteForm";
import DeliveryNoteList from "./RFIDsList";
import { useFrappe } from "../../../FrappeContext";
import {
  successNotification,
  errorNotification,
} from "../../utilities/notification";
import { DeliveryNoteProvider } from "./DeliveryNoteContext"; // 👈 Import provider

const DOCTYPE = "Delivery Note";

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

export default function DeliveryNote() {
  const navigation = useNavigation<StackNavigationProp>();
  const route = useRoute<DeliveryNoteRouteProp>();
  const { id } = route.params;
  const frappe = useFrappe();

  const layout = Dimensions.get("window");
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "first", title: "Detail" },
    { key: "second", title: "RFIDs" },
  ]);

  // ✅ Dùng renderScene thủ công để tránh unmount khi chuyển tab
  const renderScene = ({ route }: any) => {
    switch (route.key) {
      case "first":
        return <DeliveryNoteForm id={id} />;
      case "second":
        return <DeliveryNoteList />;
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
    <DeliveryNoteProvider>
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
    </DeliveryNoteProvider>
  );
}
