import React from "react";
import { Text, TextProps } from "react-native";

interface MyTextProps extends TextProps {
  children: React.ReactNode;
}

export const MyText: React.FC<MyTextProps> = ({
  style,
  children,
  ...props
}) => {
  return (
    <Text {...props} style={[{ fontFamily: "IBrand" }, style]}>
      {children}
    </Text>
  );
};
