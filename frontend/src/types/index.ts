import { MaterialIcons } from "@expo/vector-icons";
import { TextProps, TouchableOpacityProps } from "react-native";

export interface MyAppBarProps {
  title?: string;
  rightAction?: string;
  rightActionOnPress?: string;
}

export interface MyTextProps extends TextProps {
  children: React.ReactNode;
}

export interface MyButtonProps extends TouchableOpacityProps {
  size?: number;
  textColor?: string;
  children: React.ReactNode;
}

export interface MyInputProps {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
}

export interface IconButtonProps {
  iconName: keyof typeof MaterialIcons.glyphMap;
  iconColor?: string;
  iconSize?: number;
  backgroundColor?: string;
  onPress?: () => void;
}
