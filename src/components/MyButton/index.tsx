import React from "react";
import { MyText } from "../MyText";
import { TouchableOpacity } from "react-native";
import { MyButtonProps } from "../../types";

export const MyButton: React.FC<MyButtonProps> = ({
  style,
  children,
  ...props
}) => {
  return (
    <TouchableOpacity {...props} style={[style]}>
      <MyText>{children}</MyText>
    </TouchableOpacity>
  );
};
