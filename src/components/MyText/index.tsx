import React from "react";
import { Text } from "react-native";
import theme from "../../../theme";
import { MyTextProps } from "../../types";

export const MyText: React.FC<MyTextProps> = ({
  style,
  children,
  ...props
}) => {
  return (
    <Text {...props} style={[{ fontFamily: theme.ibrand }, style]}>
      {children}
    </Text>
  );
};
