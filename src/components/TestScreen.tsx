import * as React from "react";
import { View, Dimensions } from "react-native";
import { Text } from "react-native-paper";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import DocForm from "../components/DocForm";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "../../navigation";
import HeaderMenu from "./HeaderMenu";
import DocList from "../components/DocList";
const FirstRoute = () => <DocForm />;

const SecondRoute = () => (
  <View style={{ flex: 1, backgroundColor: "#f4f5f6" }}>
    <Text>Tab 2</Text>
  </View>
);

type Props = {
  text?: String;
};

export default function MyTabs({ text }: Props) {
  const layout = Dimensions.get("window");
  const navigation = useNavigation<StackNavigationProp>();
  navigation.setOptions({
    headerTitle: "Material Request",
    headerRight: () => <HeaderMenu />,
  });

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: "first", title: "Detail" },
    { key: "second", title: "Stock Entry" },
  ]);

  const renderScene = SceneMap({
    first: DocForm,
    second: DocList,
  });

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{ width: layout.width }}
      renderTabBar={(props) => (
        <TabBar
          {...props}
          indicatorStyle={{ backgroundColor: "black" }}
          style={{ backgroundColor: "#f4f5f6" }}
          activeColor="black" // màu chữ tab đang chọn
          inactiveColor="gray" // màu chữ tab chưa chọn
        />
      )}
    />
  );
}
