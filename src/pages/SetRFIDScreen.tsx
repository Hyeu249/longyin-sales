import React, { useCallback } from "react";
import { View, Dimensions } from "react-native";
import { Text } from "react-native-paper";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import DocForm from "../components/DocForm";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "../../navigation";
import HeaderMenu from "../components/HeaderMenu";

type Props = {
  text?: String;
};

export default function SetRFIDScreen({ text }: Props) {
  const navigation = useNavigation<StackNavigationProp>();

  useFocusEffect(
    useCallback(() => {
      navigation.getParent()?.setOptions({
        headerTitle: "Thiết Lập RFID",
      });
      return () => {
        console.log("Cleanup function called");
      };
    }, [])
  );
  return <Text>Thiết Lập RFID</Text>;
}
