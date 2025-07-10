import * as React from "react";
import {
  DataTable,
  IconButton,
  useTheme,
  Card,
  Button,
  TextInput,
  Menu,
  Checkbox,
} from "react-native-paper";
import {
  View,
  StyleSheet,
  StyleProp,
  ViewStyle,
  Modal,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "../../navigation";

const screenHeight = Dimensions.get("window").height;

type Item = {
  key: number;
  item_code: string;
  qty: number;
};
type Props = {
  style?: StyleProp<ViewStyle>;
  items: Item[];
};

const MyComponent = ({ style, items }: Props) => {
  const navigation = useNavigation<StackNavigationProp>();

  const theme = useTheme();
  const [page, setPage] = React.useState<number>(0);
  const [numberOfItemsPerPageList] = React.useState([2, 3, 4]);
  const [itemsPerPage, onItemsPerPageChange] = React.useState(
    numberOfItemsPerPageList[0]
  );

  const from = page * itemsPerPage;
  const to = Math.min((page + 1) * itemsPerPage, items.length);

  React.useEffect(() => {
    setPage(0);
  }, [itemsPerPage]);

  return (
    <Card mode="elevated" style={[styles.card, style]}>
      <DataTable>
        <DataTable.Header>
          <DataTable.Title>Item</DataTable.Title>
          <DataTable.Title>Qantity</DataTable.Title>
          <DataTable.Title>View</DataTable.Title>
        </DataTable.Header>
        {items.slice(from, to).map((item) => (
          <DataTable.Row key={item.key}>
            <DataTable.Cell>{item.item_code}</DataTable.Cell>
            <DataTable.Cell>{item.qty}</DataTable.Cell>
            <DataTable.Cell>
              <IconButton
                icon="delete"
                onPress={() => {
                  navigation.navigate("DrawerNavigator");
                }}
              />
            </DataTable.Cell>
          </DataTable.Row>
        ))}

        <DataTable.Pagination
          page={page}
          numberOfPages={Math.ceil(items.length / itemsPerPage)}
          onPageChange={(page) => setPage(page)}
          label={`${from + 1}-${to} of ${items.length}`}
          numberOfItemsPerPageList={numberOfItemsPerPageList}
          numberOfItemsPerPage={itemsPerPage}
          onItemsPerPageChange={onItemsPerPageChange}
          showFastPaginationControls
          selectPageDropdownLabel={"Rows per page"}
        />
      </DataTable>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    overflow: "hidden",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 16,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 10,
  },
  input: {
    marginBottom: 12,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 12,
    gap: 8,
  },
});

export default MyComponent;
