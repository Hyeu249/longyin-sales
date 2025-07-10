import Toast from "react-native-toast-message";

export function successNotification(text: string) {
  Toast.show({
    type: "success",
    text1: "Thành công",
    text2: text,
  });
}

export function errorNotification(text: string) {
  Toast.show({
    type: "error",
    text1: "Thất bại",
    text2: text,
  });
}
