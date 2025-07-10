import React, { useCallback, useState, useEffect } from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { TextInput, Button, HelperText, Card } from "react-native-paper";
import { useForm, Controller, FieldError } from "react-hook-form";
import Wrapper from "../components/Wrapper";
import RelationTable from "../components/RelationTable";
import { useFocusEffect } from "@react-navigation/native";
import LinkSelection from "../components/LinkSelection";
import Select from "../components/Selection";
import { Field, generateDefaultValues } from "../type";
import DatePicker from "../components/DatePicker";
import useDeepCompareEffect from "use-deep-compare-effect";

export type FormProps = {
  fields: Field[];
  onSubmit: (data: any) => void;
};

export default function DocForm({ fields, onSubmit }: FormProps) {
  useFocusEffect(
    useCallback(() => {
      return () => {};
    }, [])
  );
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitted },
  } = useForm({
    defaultValues: generateDefaultValues(fields),
  });

  useDeepCompareEffect(() => {
    const newDefaults = generateDefaultValues(fields);
    reset(newDefaults);
  }, [fields]);

  return (
    <Wrapper>
      <ScrollView contentContainerStyle={styles.container}>
        <View>
          {fields.map((d_field, index) => {
            if (d_field.type === "child_table") {
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
                      <RelationTable
                        tableName={d_field.label}
                        fields={d_field.child_fields || []}
                        style={styles.input}
                        items={value}
                        setItems={onChange}
                      />
                    )}
                  />
                  <HelperText type="error">
                    {(errors[d_field.field_name] as FieldError)?.message ?? ""}
                  </HelperText>
                </View>
              );
            } else if (d_field.type === "link") {
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

          <Button
            mode="contained"
            onPress={handleSubmit(onSubmit)}
            style={styles.button}
          >
            Gửi
          </Button>
        </View>
      </ScrollView>
    </Wrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 8,
  },
  card: {
    borderRadius: 12,
    padding: 4,
  },
  input: {
    marginBottom: 12,
  },
  button: {
    marginTop: 12,
  },
});
