import React from "react";
import { MyText } from "../MyText";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { MyButtonProps } from "../../types";

export const MyButton: React.FC<MyButtonProps> = ({
  size = 24,
  textColor,
  style,
  icon,
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
      <View style={styles.content}>
        {icon && <View style={styles.icon}>{icon}</View>}
        <MyText
          style={{
            color: textColor,
            fontSize: size,
            flex: icon ? 1 : 0,
            textAlign: icon ? "left" : "center",
          }}
        >
          {children}
        </MyText>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 50,
    borderRadius: 50,
    marginVertical: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    marginRight: 8,
    marginLeft: 20,
  },
});
