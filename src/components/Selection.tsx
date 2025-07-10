import React, { useState, useCallback } from "react";
import { Dropdown } from "react-native-paper-dropdown";
import { useFocusEffect } from "@react-navigation/native";
import { useFrappe } from "../../FrappeContext";
import { View, StyleProp, ViewStyle } from "react-native";
import { OptionType } from "../type";

type Props = {
  style?: StyleProp<ViewStyle>;
  label: string;
  placeholder?: string;
  value: string;
  options: OptionType[];
  onChange: (value: string) => void;
  disabled?: boolean;
};

export default function Selection({
  style,
  label,
  placeholder,
  value,
  onChange = () => {},
  options,
  disabled = false,
}: Props) {
  const { db, setAuth } = useFrappe();

  useFocusEffect(
    useCallback(() => {
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
        disabled={disabled}
      />
    </View>
  );
}
