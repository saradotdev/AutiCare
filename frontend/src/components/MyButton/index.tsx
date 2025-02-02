import React from "react";
import { MyText } from "../MyText";
import { StyleSheet, TouchableOpacity } from "react-native";
import { MyButtonProps } from "../../types";

export const MyButton: React.FC<MyButtonProps> = ({
  size = 24, // default font size of button text is 24
  textColor,
  style,
  children,
  ...props
}) => {
  return (
    <TouchableOpacity
      {...props}
      style={[styles.button, style]}
      activeOpacity={0.8}
      hitSlop={20}
    >
      <MyText style={{ color: textColor, fontSize: size }}>{children}</MyText>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 50,
    borderRadius: 50,
    marginVertical: 10,
    justifyContent: "center",
    alignItems: "center",
  },
});
