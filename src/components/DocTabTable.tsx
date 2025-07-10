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
  HelperText,
} from "react-native-paper";
import {
  View,
  StyleSheet,
  StyleProp,
  ViewStyle,
  Modal,
  Dimensions,
  Text,
  ScrollView,
} from "react-native";
import { BaseField } from "../type";
import _, { clone } from "lodash";

const screenHeight = Dimensions.get("window").height;

type MenuType = {
  title: string;
  onPress: (data: any) => void;
};
type Props = {
  fields: BaseField[];
  style?: StyleProp<ViewStyle>;
  items: any[];
  menus?: MenuType[];
  onSelect: (data: any) => void;
  onOpen: (data: any) => void;
};

export default function DocTabTable({
  fields,
  style,
  items,
  onSelect,
  onOpen,
  menus = [],
}: Props) {
  const theme = useTheme();

  const [page, setPage] = React.useState<number>(0);
  const [numberOfItemsPerPageList] = React.useState([5, 10, 15, 20, 25]);
  const [itemsPerPage, onItemsPerPageChange] = React.useState(
    numberOfItemsPerPageList[0]
  );

  const from = page * itemsPerPage;
  const to = Math.min((page + 1) * itemsPerPage, items.length);

  const [visible, setVisible] = React.useState(false);
  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  React.useEffect(() => {
    setPage(0);
  }, [itemsPerPage]);

  return (
    <Card mode="elevated" style={[styles.card, style]}>
      <View style={styles.headerRow}>
        {menus.length > 0 && (
          <Menu
            visible={visible}
            onDismiss={closeMenu}
            anchor={
              <IconButton icon="dots-vertical" size={24} onPress={openMenu} />
            }
          >
            {menus.map((menu: MenuType, index) => {
              return (
                <Menu.Item
                  key={index}
                  onPress={() => {
                    const filtered = items.filter((e) => e.checked);
                    const cloned = _.cloneDeep(filtered);

                    menu.onPress(cloned);
                    setVisible(false);
                  }}
                  title={menu.title}
                />
              );
            })}
          </Menu>
        )}
      </View>
      <DataTable>
        <DataTable.Header>
          <DataTable.Title>Select</DataTable.Title>
          {fields
            .filter((e) => !e.hidden)
            .map((field) => (
              <DataTable.Title key={field.field_name}>
                {field.label}
              </DataTable.Title>
            ))}
          <DataTable.Title>Action</DataTable.Title>
        </DataTable.Header>
        {items.slice(from, to).map((item, index) => (
          <DataTable.Row key={index}>
            <DataTable.Cell>
              <Checkbox
                status={item.checked ? "checked" : "unchecked"}
                onPress={() => {
                  const cloned = _.cloneDeep(item);

                  onSelect(cloned);
                }}
              />
            </DataTable.Cell>
            {fields
              .filter((e) => !e.hidden)
              .map((field) => (
                <DataTable.Cell key={field.field_name}>
                  {item[field.field_name]}
                </DataTable.Cell>
              ))}

            <DataTable.Cell>
              <IconButton icon="eye" onPress={() => onOpen(item)} />
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
}

const styles = StyleSheet.create({
  container: {
    padding: 8,
  },
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
  button: {
    marginTop: 12,
  },
});
