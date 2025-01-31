import { MaterialIcons } from "@expo/vector-icons";
import { TextProps, TouchableOpacityProps } from "react-native";

export interface MyAppBarProps {
  title: string;
}

export interface MyTextProps extends TextProps {
  children: React.ReactNode;
}

export interface MyButtonProps extends TouchableOpacityProps {
  children: React.ReactNode;
}

export interface MyInputProps {
  label: string;
  placeholder: string;
}

export interface IconButtonProps {
  iconName: keyof typeof MaterialIcons.glyphMap;
  iconColor?: string;
  iconSize?: number;
  backgroundColor?: string;
  onPress?: () => void;
}
