import React, { useCallback, useState } from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { TextInput, Button, HelperText, Card } from "react-native-paper";
import { useForm, Controller } from "react-hook-form";
import Wrapper from "../components/Wrapper";
import ListTable from "../components/ListTable";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useFrappe } from "../../FrappeContext";
import LinkSelection from "../components/LinkSelection";
import { StackNavigationProp } from "../../navigation";

type Item = {
  key: number;
  item_code: string;
  qty: number;
};

export default function FormWithHook() {
  const navigation = useNavigation<StackNavigationProp>();
  const { db, call, setAuth } = useFrappe();
  useFocusEffect(
    useCallback(() => {
      return () => {
        console.log("Cleanup function called");
      };
    }, [])
  );

  const items = [{ key: 0, item_code: "string", qty: 5 }];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View>
        <ListTable style={styles.input} items={items} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
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
