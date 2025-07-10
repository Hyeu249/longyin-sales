import React, { useCallback } from "react";
import { List } from "react-native-paper";
import { View, ScrollView, StyleSheet } from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "../../navigation";

const MyComponent = () => {
  const navigation = useNavigation<StackNavigationProp>();

  useFocusEffect(
    useCallback(() => {
      navigation.getParent()?.setOptions({
        headerTitle: "Trang chủ",
      });
      return () => {
        console.log("Cleanup function called");
      };
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
              onPress={() => navigation.navigate("MaterialRequest")}
            />
            <List.Item title="Stock Entry" />
          </List.Accordion>

          <List.Accordion
            title="Selling"
            id="selling"
            left={(props) => <List.Icon {...props} icon="folder" />}
          >
            <List.Item title="Sales Order" />
            <List.Item title="Delivery Note" />
          </List.Accordion>

          <List.Accordion
            title="Buying"
            id="buying"
            left={(props) => <List.Icon {...props} icon="folder" />}
          >
            <List.Item title="Purchase Order" />
            <List.Item title="Purchase Receipt" />
          </List.Accordion>
        </List.AccordionGroup>
      </List.Section>

      <List.Section title="Requests">
        <List.AccordionGroup>
          <List.Accordion
            title="My Requests"
            id="stock"
            left={(props) => <List.Icon {...props} icon="folder" />}
          >
            <List.Item title="First item" />
            <List.Item title="Second item" />
          </List.Accordion>

          <List.Accordion
            title="Team Requests"
            id="selling"
            left={(props) => <List.Icon {...props} icon="folder" />}
          >
            <List.Item title="First item" />
            <List.Item title="Second item" />
          </List.Accordion>
        </List.AccordionGroup>
      </List.Section>
    </ScrollView>
  );
};

export default MyComponent;
