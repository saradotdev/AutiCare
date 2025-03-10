import { MaterialIcons } from "@expo/vector-icons";
import { TextProps, TouchableOpacityProps } from "react-native";
import { RootStackParamList } from "./navigation";

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
  icon?: React.ReactNode;
  textColor?: string;
  children?: React.ReactNode;
}

export interface MyInputProps {
  label: string;
  placeholder: string;
  value?: string;
  onChangeText?: (text: string) => void;
  secureTextEntry?: boolean;
}

export interface IconButtonProps extends TouchableOpacityProps {
  iconName: keyof typeof MaterialIcons.glyphMap;
  iconColor?: string;
  iconSize?: number;
  backgroundColor?: string;
  onPress?: () => void;
}

export interface MyRadioGroupProps {
  options: { label: string; value: string; sublabel?: string }[];
  defaultValue?: string;
  onSelect: (value: string) => void;
}

export interface ChildDetailsProps {
  main: string;
  sub: string;
  children?: React.ReactNode;
  onPress?: () => void;
}

export interface GameCardProps {
  title: string;
  color: string;
  Image: React.FC;
  onPress: () => void;
}

export type GameAppBarProps = {
  title: string;
  instructions: string[];
};

export type Game = {
  id: string;
  title: string;
  color: string;
  Image: () => JSX.Element;
  screen: keyof RootStackParamList;
};

export interface MyModalProps {
  visible: boolean;
  text?: string;
  buttonText?: string;
  onClose: () => void;
  children?: React.ReactNode;
}

export interface ScoreCardProps {
  score: number;
  total: number;
}
