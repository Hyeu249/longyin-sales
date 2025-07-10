// HeaderMenu.tsx
import React, { useState } from "react";
import { Menu, IconButton } from "react-native-paper";

const HeaderMenu = () => {
  const [visible, setVisible] = useState(false);

  return (
    <Menu
      visible={visible}
      onDismiss={() => setVisible(false)}
      anchor={
        <IconButton
          icon="dots-vertical"
          size={24}
          onPress={() => setVisible(true)}
        />
      }
    >
      <Menu.Item
        onPress={() => {
          console.log("Đã chọn A");
          setVisible(false);
        }}
        title="Submit"
      />
      <Menu.Item
        onPress={() => {
          console.log("Đã chọn B");
          setVisible(false);
        }}
        title="Tạo Stock Entry"
      />
      <Menu.Item
        onPress={() => {
          console.log("Đã chọn C");
          setVisible(false);
        }}
        title="Xóa"
      />
    </Menu>
  );
};

export default HeaderMenu;
