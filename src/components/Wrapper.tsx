import {
  Keyboard,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

type WrapperProps = {
  children: React.ReactNode;
};

export default function Wrapper({ children }: WrapperProps) {
  if (Platform.OS === "web") {
    return <>{children}</>; // Web không cần xử lý bàn phím
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
      <Pressable onPress={Keyboard.dismiss}>{children}</Pressable>
    </KeyboardAvoidingView>
  );
}
