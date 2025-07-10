import React, { useRef, useEffect } from "react";
import { Modal, Portal } from "react-native-paper";
import { Animated, Dimensions, ViewStyle } from "react-native";

const { height } = Dimensions.get("window");

type SlideUpModalProps = {
  visible: boolean;
  onDismiss: () => void;
  children: React.ReactNode;
  contentStyle?: ViewStyle;
};

const SlideUpModal: React.FC<SlideUpModalProps> = ({
  visible,
  onDismiss,
  children,
  contentStyle = {},
}) => {
  const translateY = useRef(new Animated.Value(height)).current;

  useEffect(() => {
    if (visible) {
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start();
    } else {
      Animated.timing(translateY, {
        toValue: height,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  }, [visible]);

  return (
    <Portal>
      {visible && (
        <Modal
          visible={visible}
          onDismiss={onDismiss}
          style={{ justifyContent: "flex-end" }}
        >
          <Animated.View
            style={{
              backgroundColor: "white",
              padding: 20,
              transform: [{ translateY }],
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              ...contentStyle,
            }}
          >
            {children}
          </Animated.View>
        </Modal>
      )}
    </Portal>
  );
};

export default SlideUpModal;
