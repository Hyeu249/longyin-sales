import { NavigationContainer, RouteProp } from "@react-navigation/native";
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from "@react-navigation/native-stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useLanguage } from "../LanguageContext";
import HomeScreen from "../src/pages/HomeScreen";
import MaterialRequest from "../src/pages/MaterialRequest/MaterialRequest";
import StockEntry from "../src/pages/StockEntry/StockEntry";
import SetRFIDScreen from "../src/pages/SetRFIDScreen";
import LoginScreen from "../src/pages/LoginScreen";
import SettingsScreen from "../src/pages/SettingsScreen";
import { Portal, Provider as PaperProvider } from "react-native-paper";
import SalesOrder from "../src/pages/SalesOrder/SalesOrder";
import DeliveryNote from "../src/pages/DeliveryNote/DeliveryNote";
import PurchaseReceipt from "../src/pages/PurchaseReceipt/PurchaseReceipt";

type StackParamList = {
  Hello: undefined;
  DrawerNavigator: undefined;
  Login: undefined;
  MaterialRequest: { id?: string };
  StockEntry: { id?: string };
  SalesOrder: { id?: string };
  DeliveryNote: { id?: string };
  PurchaseReceipt: { id?: string };
};

export type StackNavigationProp = NativeStackNavigationProp<StackParamList>;
export type RouteProps = RouteProp<StackParamList>;
export type MaterialRequestRouteProp = RouteProp<
  StackParamList,
  "MaterialRequest"
>;
export type StockEntryRouteProp = RouteProp<StackParamList, "StockEntry">;
export type SalesOrderRouteProp = RouteProp<StackParamList, "SalesOrder">;
export type DeliveryNoteRouteProp = RouteProp<StackParamList, "DeliveryNote">;
export type PurchaseReceiptRouteProp = RouteProp<
  StackParamList,
  "PurchaseReceipt"
>;

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();
const BottomTab = createBottomTabNavigator();

function DrawerNavigator() {
  const { t } = useLanguage();

  return (
    <Drawer.Navigator>
      <Drawer.Screen
        name="PimaryScreen"
        component={BottomTabNavigator}
        options={{
          drawerLabel: "Màn hình chính",
        }}
      />
      <Drawer.Screen
        name="settingsScreen"
        options={{
          title: "Thiết lập",
        }}
        component={SettingsScreen}
      />
      <Drawer.Screen
        name="LoginScreen"
        options={{
          title: "Đăng nhập",
        }}
        component={LoginScreen}
      />
    </Drawer.Navigator>
  );
}

function BottomTabNavigator() {
  const { t } = useLanguage();

  return (
    <BottomTab.Navigator screenOptions={{ headerShown: false }}>
      <BottomTab.Screen
        name="HomeScreen"
        options={{
          title: "Trang chủ",
        }}
      >
        {() => <HomeScreen />}
      </BottomTab.Screen>
      <BottomTab.Screen
        name="SetRfidScreen"
        options={{
          tabBarLabel: "Thiết lập rfid",
        }}
      >
        {() => <SetRFIDScreen />}
      </BottomTab.Screen>
    </BottomTab.Navigator>
  );
}

function StackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="DrawerNavigator"
        component={DrawerNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="MaterialRequest" component={MaterialRequest} />
      <Stack.Screen name="StockEntry" component={StockEntry} />
      <Stack.Screen name="SalesOrder" component={SalesOrder} />
      <Stack.Screen name="DeliveryNote" component={DeliveryNote} />
      <Stack.Screen name="PurchaseReceipt" component={PurchaseReceipt} />
    </Stack.Navigator>
  );
}

export default function Navigation() {
  return (
    <NavigationContainer>
      <Portal.Host>
        <StackNavigator />
      </Portal.Host>
    </NavigationContainer>
  );
}
