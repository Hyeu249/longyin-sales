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
} from "react-native";
import { BaseField, generateDefaultValues } from "../type";
import { useForm, Controller, FieldError } from "react-hook-form";
import LinkSelection from "../components/LinkSelection";
import Select from "../components/Selection";
import DatePicker from "../components/DatePicker";
import SlideUpModal from "./SlideUpModal";
import _, { clone } from "lodash";

const screenHeight = Dimensions.get("window").height;
type Props = {
  fields: BaseField[];
  style?: StyleProp<ViewStyle>;
  items: any[];
  setItems: React.Dispatch<React.SetStateAction<any[]>>;
};

const MyComponent = ({ fields, style, items, setItems }: Props) => {
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
  const [numberOfItemsPerPageList] = React.useState([2, 3, 4]);
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
    data_clone.local_id = cloned.length;

    console.log("Submitted data:", data_clone);
    setItems([...cloned, data_clone]);
    resetItems();
  };

  return (
    <>
      <Card mode="elevated" style={[styles.card, style]}>
        <View style={styles.headerRow}>
          <Menu
            visible={visible}
            onDismiss={closeMenu}
            anchor={<Button onPress={openMenu}>menu</Button>}
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
                  {field.name}
                </DataTable.Title>
              ))}
            <DataTable.Title>Action</DataTable.Title>
          </DataTable.Header>
          {items.slice(from, to).map((item) => (
            <DataTable.Row key={item.local_id}>
              <DataTable.Cell>
                <Checkbox
                  status={item.checked ? "checked" : "unchecked"}
                  onPress={() => {
                    const cloned = _.cloneDeep(items);
                    setItems(
                      cloned.map((e) =>
                        e.local_id === item.local_id
                          ? { ...e, checked: !e.checked }
                          : e
                      )
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
          {fields.map((d_field, index) => {
            if (d_field.type === "link") {
              return (
                <>
                  <Controller
                    key={d_field.field_name}
                    control={control}
                    name={d_field.field_name}
                    rules={
                      d_field.required
                        ? { required: `${d_field.name} là bắt buộc` }
                        : undefined
                    }
                    render={({ field: { onChange, value } }) => (
                      <LinkSelection
                        doctype={d_field.doctype || ""}
                        label={d_field.name}
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
                </>
              );
            } else if (d_field.type === "select") {
              return (
                <>
                  <Controller
                    key={d_field.field_name}
                    control={control}
                    name={d_field.field_name}
                    rules={
                      d_field.required
                        ? { required: `${d_field.name} là bắt buộc` }
                        : undefined
                    }
                    render={({ field: { onChange, value } }) => (
                      <Select
                        label={d_field.name}
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
                </>
              );
            } else if (d_field.type === "date") {
              return (
                <>
                  <Controller
                    key={d_field.field_name}
                    control={control}
                    name={d_field.field_name}
                    rules={
                      d_field.required
                        ? { required: `${d_field.name} là bắt buộc` }
                        : undefined
                    }
                    render={({ field: { onChange, value } }) => (
                      <DatePicker
                        label={d_field.name}
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
                </>
              );
            } else {
              return (
                <>
                  <Controller
                    key={d_field.field_name}
                    control={control}
                    name={d_field.field_name}
                    rules={
                      d_field.required
                        ? { required: `${d_field.name} là bắt buộc` }
                        : undefined
                    }
                    render={({ field: { onChange, value } }) => {
                      return (
                        <TextInput
                          keyboardType={
                            d_field.type === "int" ? "numeric" : "default"
                          }
                          label={d_field.name}
                          mode="outlined"
                          value={value}
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
                </>
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
};

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

export default MyComponent;
