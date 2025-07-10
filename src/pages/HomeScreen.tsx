import React, { useCallback } from "react";
import { List } from "react-native-paper";
import { View, ScrollView, StyleSheet } from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "../../navigation";
import HomeRequets from "./HomeRequests";

const MyComponent = () => {
  const navigation = useNavigation<StackNavigationProp>();

  useFocusEffect(
    useCallback(() => {
      navigation.getParent()?.setOptions({
        headerTitle: "Trang chủ",
      });
      return () => {};
    }, [])
  );
  return (
    <ScrollView>
      <List.Section title="Quick Links">
        <List.AccordionGroup>
          <List.Accordion
            title="Stock"
            id="stock"
            left={(props) => <List.Icon {...props} icon="folder" />}
          >
            <List.Item
              title="Material Request"
              onPress={() => navigation.navigate("MaterialRequest", {})}
            />
            <List.Item
              title="Stock Entry"
              onPress={() => navigation.navigate("StockEntry", {})}
            />
          </List.Accordion>

          <List.Accordion
            title="Selling"
            id="selling"
            left={(props) => <List.Icon {...props} icon="folder" />}
          >
            <List.Item
              title="Sales Order"
              onPress={() => navigation.navigate("SalesOrder", {})}
            />
            <List.Item
              title="Delivery Note"
              onPress={() => navigation.navigate("DeliveryNote", {})}
            />
          </List.Accordion>

          <List.Accordion
            title="Buying"
            id="buying"
            left={(props) => <List.Icon {...props} icon="folder" />}
          >
            <List.Item title="Purchase Order" />
            <List.Item
              title="Purchase Receipt"
              onPress={() => navigation.navigate("PurchaseReceipt", {})}
            />
          </List.Accordion>
        </List.AccordionGroup>
      </List.Section>

      <HomeRequets />
    </ScrollView>
  );
};

export default MyComponent;
