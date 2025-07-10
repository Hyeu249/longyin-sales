import React, { useCallback, useState } from "react";
import { List } from "react-native-paper";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useFrappe } from "../../FrappeContext";
import { StackNavigationProp } from "../../navigation";

type MaterialRequest = {
  name: string;
  company: string;
  material_request_type: string;
  schedule_date: string;
  creation: string;
  type: "MaterialRequest";
  docstatus: number;
};

type StockEntry = {
  name: string;
  company: string;
  stock_entry_type: string;
  to_warehouse: string;
  creation: string;
  type: "StockEntry";
  docstatus: number;
};

type SalesOrder = {
  name: string;
  docstatus: number;
  customer: string;
  delivery_date: string;
  currency: string;
  set_warehouse: string;
  type: "SalesOrder";
};

export type DeliveryNote = {
  name: string;
  customer: string;
  docstatus: number;
  currency: string;
  set_warehouse: string;
  type: "DeliveryNote";
};

type CombinedRequest = MaterialRequest | StockEntry;

type CombinedSalesRequest = SalesOrder | DeliveryNote;

const MyComponent = () => {
  const navigation = useNavigation<StackNavigationProp>();
  const [requests, setRequests] = useState<CombinedRequest[]>([]);
  const [salesRequest, setSalesRequest] = useState<CombinedSalesRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const { db } = useFrappe();

  useFocusEffect(
    useCallback(() => {
      setLoading(true);

      Promise.all([
        db.getDocList("Material Request", {
          fields: [
            "name",
            "company",
            "material_request_type",
            "schedule_date",
            "creation",
            "docstatus",
          ],
          limit: 5,
          orderBy: { field: "creation", order: "desc" },
        }),
        db.getDocList("Stock Entry", {
          fields: [
            "name",
            "company",
            "stock_entry_type",
            "to_warehouse",
            "creation",
            "docstatus",
          ],
          limit: 5,
          orderBy: { field: "creation", order: "desc" },
        }),
        db.getDocList("Sales Order", {
          fields: [
            "name",
            "customer",
            "delivery_date",
            "currency",
            "set_warehouse",
          ],
          limit: 5,
          orderBy: { field: "creation", order: "desc" },
        }),
        db.getDocList("Delivery Note", {
          fields: ["name", "customer", "currency", "set_warehouse"],
          limit: 5,
          orderBy: { field: "creation", order: "desc" },
        }),
      ])
        .then(([materialDocs, stockDocs, salesOrders, deliveryNotes]) => {
          const material = materialDocs.map((doc: any) => ({
            ...doc,
            type: "MaterialRequest",
          }));
          const stock = stockDocs.map((doc: any) => ({
            ...doc,
            type: "StockEntry",
          }));

          const combined: CombinedRequest[] = [...material, ...stock].sort(
            (a, b) =>
              new Date(b.creation).getTime() - new Date(a.creation).getTime()
          );
          setRequests(combined);

          const sales = salesOrders.map((doc: any) => ({
            ...doc,
            type: "SalesOrder",
          }));
          const deliveries = deliveryNotes.map((doc: any) => ({
            ...doc,
            type: "DeliveryNote",
          }));

          const combinedSales: CombinedSalesRequest[] = [
            ...sales,
            ...deliveries,
          ];
          setSalesRequest(combinedSales);
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }, [])
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <List.Section title="Requests">
      <List.AccordionGroup>
        <List.Accordion
          title="Stock Requests"
          id="team"
          left={(props) => <List.Icon {...props} icon="folder" />}
        >
          {requests.map((item) => {
            if (item.type === "MaterialRequest") {
              return (
                <List.Item
                  key={`mr-${item.name}`}
                  title={`${item.name}-${item.docstatus == 1 && "Approved"}`}
                  description={`Material • ${item.material_request_type} • ${item.schedule_date}`}
                  left={(props) => (
                    <List.Icon
                      {...props}
                      icon="clipboard-list-outline"
                      color="#007bff"
                    />
                  )}
                  titleStyle={{ color: "#007bff" }}
                  descriptionStyle={{ color: "#007bff" }}
                  onPress={() =>
                    navigation.navigate("MaterialRequest", {
                      id: item.name,
                    })
                  }
                />
              );
            } else {
              return (
                <List.Item
                  key={`se-${item.name}`}
                  title={`${item.name}-${item.docstatus == 1 && "Approved"}`}
                  description={`Stock • ${item.stock_entry_type} • ${item.to_warehouse}`}
                  left={(props) => (
                    <List.Icon
                      {...props}
                      icon="package-variant"
                      color="#28a745"
                    />
                  )}
                  titleStyle={{ color: "#28a745" }}
                  descriptionStyle={{ color: "#28a745" }}
                  onPress={() =>
                    navigation.navigate("StockEntry", {
                      id: item.name,
                    })
                  }
                />
              );
            }
          })}
        </List.Accordion>
        <List.Accordion
          title={`Sales Requests`}
          id="selling"
          left={(props) => <List.Icon {...props} icon="folder" />}
        >
          {salesRequest.map((item) => {
            if (item.type === "SalesOrder") {
              return (
                <List.Item
                  key={`mr-${item.name}`}
                  title={`${item.name}-${item.docstatus == 1 && "Approved"}`}
                  description={`Sales • ${item.customer} • ${item.delivery_date}`}
                  left={(props) => (
                    <List.Icon
                      {...props}
                      icon="clipboard-list-outline"
                      color="#007bff"
                    />
                  )}
                  titleStyle={{ color: "#007bff" }}
                  descriptionStyle={{ color: "#007bff" }}
                  onPress={() =>
                    navigation.navigate("SalesOrder", {
                      id: item.name,
                    })
                  }
                />
              );
            } else {
              return (
                <List.Item
                  key={`se-${item.name}`}
                  title={`${item.name}-${item.docstatus == 1 && "Approved"}`}
                  description={`Delivery Note • ${item.customer} • ${item.set_warehouse}`}
                  left={(props) => (
                    <List.Icon
                      {...props}
                      icon="package-variant"
                      color="#28a745"
                    />
                  )}
                  titleStyle={{ color: "#28a745" }}
                  descriptionStyle={{ color: "#28a745" }}
                  onPress={() =>
                    navigation.navigate("DeliveryNote", {
                      id: item.name,
                    })
                  }
                />
              );
            }
          })}
        </List.Accordion>
      </List.AccordionGroup>
    </List.Section>
  );
};

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default MyComponent;
