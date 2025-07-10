import React, { useCallback, useState } from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { TextInput, Button, HelperText, Card } from "react-native-paper";
import { useForm, Controller, FieldError } from "react-hook-form";
import Wrapper from "../components/Wrapper";
import RelationTable from "../components/RelationTable";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useFrappe } from "../../FrappeContext";
import LinkSelection from "../components/LinkSelection";
import { StackNavigationProp } from "../../navigation";
import Select from "../components/Selection";
import {
  OptionType,
  BaseField,
  Field,
  FormProps,
  generateDefaultValues,
} from "../type";
import DatePicker from "../components/DatePicker";

export default function FormWithHook({ doctype, fields, onSubmit }: FormProps) {
  const navigation = useNavigation<StackNavigationProp>();
  const { db, call, setAuth } = useFrappe();
  useFocusEffect(
    useCallback(() => {
      return () => {
        console.log("Cleanup function called");
      };
    }, [])
  );
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitted },
  } = useForm({
    defaultValues: generateDefaultValues(fields),
  });

  return (
    <Wrapper>
      <ScrollView contentContainerStyle={styles.container}>
        <View>
          {fields.map((d_field, index) => {
            if (d_field.type === "child_table") {
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
                      <RelationTable
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
                </>
              );
            } else if (d_field.type === "link") {
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
