import React, { useState, useCallback } from "react";
import { Dropdown } from "react-native-paper-dropdown";
import { useFocusEffect } from "@react-navigation/native";
import { useFrappe } from "../../FrappeContext";
import { View, StyleProp, ViewStyle } from "react-native";

type Option = { label: string; value: string };

type Props = {
  style?: StyleProp<ViewStyle>;
  doctype: string; // Optional doctype prop
  label: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
};

export default function LinkSelection({
  style,
  doctype,
  label,
  placeholder,
  value,
  onChange = () => {},
}: Props) {
  const [options, setOptions] = useState<Option[]>([]);

  const { db, setAuth } = useFrappe();

  useFocusEffect(
    useCallback(() => {
      db.getDocList(doctype, {
        fields: ["name"],
        limit: 10000,
      })
        .then((docs: any) =>
          setOptions(docs.map((e: any) => ({ label: e.name, value: e.name })))
        )
        .catch((error: any) => console.error(error));
      return () => {};
    }, [])
  );
  return (
    <View style={style}>
      <Dropdown
        label={label}
        placeholder={placeholder}
        options={options}
        value={value}
        onSelect={(e) => onChange(e || "")}
        mode="outlined"
      />
    </View>
  );
}
