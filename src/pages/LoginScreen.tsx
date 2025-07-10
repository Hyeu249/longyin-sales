import React, { useCallback } from "react";
import { View, Dimensions } from "react-native";
import { Text } from "react-native-paper";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "../../navigation";
import HeaderMenu from "../components/HeaderMenu";

type Props = {
  text?: String;
};

export default function LoginScreen({ text }: Props) {
  const navigation = useNavigation<StackNavigationProp>();

  useFocusEffect(
    useCallback(() => {
      navigation.setOptions({
        headerTitle: "Đăng nhập",
      });
      return () => {
        console.log("Cleanup function called");
      };
    }, [])
  );
  return <Text>Đăng nhập</Text>;
}
