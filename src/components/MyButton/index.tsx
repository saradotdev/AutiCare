import React from "react";
import { MyText } from "../MyText";
import { StyleSheet, TouchableOpacity } from "react-native";
import { MyButtonProps } from "../../types";

export const MyButton: React.FC<MyButtonProps> = ({
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
    >
      <MyText style={[styles.buttonText, { color: textColor }]}>
        {children}
      </MyText>
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
  buttonText: {
    fontSize: 24,
  },
});
