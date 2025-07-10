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
  ScrollView,
  Text,
} from "react-native";
import { BaseField, generateDefaultValues } from "../type";
import { useForm, Controller, FieldError } from "react-hook-form";
import LinkSelection from "../components/LinkSelection";
import Select from "../components/Selection";
import DatePicker from "../components/DatePicker";
import SlideUpModal from "./SlideUpModal";
import _, { clone } from "lodash";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";

const screenHeight = Dimensions.get("window").height;
type Props = {
  tableName: string;
  fields: BaseField[];
  style?: StyleProp<ViewStyle>;
  items: any[];
  setItems?: (data: any) => void;
};

export default function RelationTable({
  fields,
  style,
  items,
  setItems = () => {},
  tableName,
}: Props) {
  const theme = useTheme();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitted },
  } = useForm({
    defaultValues: generateDefaultValues(fields),
  });

  const [page, setPage] = React.useState<number>(0);
  const [numberOfItemsPerPageList] = React.useState([5, 10, 15, 20, 25, 50]);
  const [itemsPerPage, onItemsPerPageChange] = React.useState(
    numberOfItemsPerPageList[0]
  );

  const [showModal, setShowModal] = React.useState(false);

  const [visible, setVisible] = React.useState(false);

  const openMenu = () => setVisible(true);

  const closeMenu = () => setVisible(false);

  const from = page * itemsPerPage;
  const to = Math.min((page + 1) * itemsPerPage, items.length);

  React.useEffect(() => {
    setPage(0);
  }, [itemsPerPage]);

  const resetItems = () => {
    reset(generateDefaultValues(fields));
    setShowModal(false);
  };

  const onSubmit = (data: any) => {
    const cloned = _.cloneDeep(items);
    const data_clone = _.cloneDeep(data);
    let newItems: any = [];
    const getId = (e: any) => e.local_id || e.name;
    const id = getId(data_clone);

    if (id) {
      newItems = cloned.map((res) =>
        getId(res) === getId(data_clone) ? data_clone : res
      );
    } else {
      data_clone.local_id = uuidv4();
      newItems = [...cloned, data_clone];
    }

    console.log("Submitted data:", data_clone);
    setItems(newItems);
    resetItems();
  };

  return (
    <>
      <Card mode="elevated" style={[styles.card, style]}>
        <View style={styles.headerRow}>
          <Text style={{ textAlign: "center", fontSize: 18, marginLeft: 12 }}>
            {tableName}
          </Text>
          <Menu
            visible={visible}
            onDismiss={closeMenu}
            anchor={
              <IconButton icon="dots-vertical" size={24} onPress={openMenu} />
            }
          >
            <Menu.Item
              onPress={() => {
                setShowModal(true);
                closeMenu();
              }}
              title="Tạo mới"
            />
            <Menu.Item
              onPress={() => {
                const cloned = _.cloneDeep(items);

                setItems(cloned.filter((e) => !e.checked));
                closeMenu();
              }}
              title="Xóa"
            />
          </Menu>
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
          {items.slice(from, to).map((item) => (
            <DataTable.Row key={item.local_id || item.name}>
              <DataTable.Cell>
                <Checkbox
                  status={item.checked ? "checked" : "unchecked"}
                  onPress={() => {
                    const cloned = _.cloneDeep(items);
                    setItems(
                      cloned.map((e) => {
                        if (e.local_id && e.local_id === item.local_id) {
                          return { ...e, checked: !e.checked };
                        } else if (e.name && e.name === item.name) {
                          return { ...e, checked: !e.checked };
                        } else {
                          return e;
                        }
                      })
                    );
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
                <IconButton
                  icon="eye"
                  onPress={() => {
                    reset(item);
                    setShowModal(true);
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

      {/* MODAL FORM */}
      <SlideUpModal
        visible={showModal}
        onDismiss={() => {
          resetItems();
          setShowModal(false);
        }}
      >
        <ScrollView contentContainerStyle={styles.container}>
          {fields
            .filter((e) => !e.hidden)
            .map((d_field, index) => {
              if (d_field.type === "link") {
                return (
                  <View key={d_field.field_name}>
                    <Controller
                      control={control}
                      name={d_field.field_name}
                      rules={
                        d_field.required
                          ? { required: `${d_field.label} là bắt buộc` }
                          : undefined
                      }
                      render={({ field: { onChange, value } }) => (
                        <LinkSelection
                          doctype={d_field.doctype || ""}
                          label={d_field.label}
                          value={value}
                          onChange={onChange}
                          style={styles.input}
                        />
                      )}
                    />
                    {errors[d_field.field_name] && (
                      <HelperText type="error">
                        {(errors[d_field.field_name] as FieldError)?.message ??
                          ""}
                      </HelperText>
                    )}
                  </View>
                );
              } else if (d_field.type === "select") {
                return (
                  <View key={d_field.field_name}>
                    <Controller
                      control={control}
                      name={d_field.field_name}
                      rules={
                        d_field.required
                          ? { required: `${d_field.label} là bắt buộc` }
                          : undefined
                      }
                      render={({ field: { onChange, value } }) => (
                        <Select
                          label={d_field.label}
                          options={d_field.options || []}
                          value={value}
                          onChange={onChange}
                          style={styles.input}
                          disabled={d_field.readonly}
                        />
                      )}
                    />
                    {errors[d_field.field_name] && (
                      <HelperText type="error">
                        {(errors[d_field.field_name] as FieldError)?.message ??
                          ""}
                      </HelperText>
                    )}
                  </View>
                );
              } else if (d_field.type === "date") {
                return (
                  <View key={d_field.field_name}>
                    <Controller
                      control={control}
                      name={d_field.field_name}
                      rules={
                        d_field.required
                          ? { required: `${d_field.label} là bắt buộc` }
                          : undefined
                      }
                      render={({ field: { onChange, value } }) => (
                        <DatePicker
                          label={d_field.label}
                          value={value}
                          onChange={onChange}
                          style={styles.input}
                        />
                      )}
                    />
                    {errors[d_field.field_name] && (
                      <HelperText type="error">
                        {(errors[d_field.field_name] as FieldError)?.message ??
                          ""}
                      </HelperText>
                    )}
                  </View>
                );
              } else {
                return (
                  <View key={d_field.field_name}>
                    <Controller
                      control={control}
                      name={d_field.field_name}
                      rules={
                        d_field.required
                          ? { required: `${d_field.label} là bắt buộc` }
                          : undefined
                      }
                      render={({ field: { onChange, value } }) => {
                        return (
                          <TextInput
                            keyboardType={
                              d_field.type === "int" ? "numeric" : "default"
                            }
                            label={d_field.label}
                            mode="outlined"
                            value={value?.toString() ?? ""}
                            onChangeText={(text) => {
                              const numeric = text.replace(/[^0-9]/g, "");
                              onChange(
                                d_field.type === "int"
                                  ? numeric
                                    ? parseInt(numeric)
                                    : ""
                                  : text
                              );
                            }}
                            style={styles.input}
                          />
                        );
                      }}
                    />
                    {errors[d_field.field_name] && (
                      <HelperText type="error">
                        {(errors[d_field.field_name] as FieldError)?.message ??
                          ""}
                      </HelperText>
                    )}
                  </View>
                );
              }
            })}

          <View style={styles.modalButtons}>
            <Button
              onPress={() => {
                setShowModal(false);
                resetItems();
              }}
            >
              Huỷ
            </Button>
            <Button mode="contained" onPress={handleSubmit(onSubmit)}>
              Lưu
            </Button>
          </View>
        </ScrollView>
      </SlideUpModal>
    </>
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
    justifyContent: "space-between",
    alignItems: "center",
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
