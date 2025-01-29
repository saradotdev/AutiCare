import React from "react";
import { MyText } from "../MyText";
import { TouchableOpacity, TouchableOpacityProps } from "react-native";

interface MyButtonProps extends TouchableOpacityProps {
  children: React.ReactNode;
}

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
