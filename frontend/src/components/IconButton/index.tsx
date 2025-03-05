import React from "react";
import { TouchableOpacity, View } from "react-native";
import { IconButtonProps } from "../../types";
import { MaterialIcons } from "@expo/vector-icons";

export default function IconButton({
  iconName,
  iconColor,
  iconSize,
  backgroundColor,
  onPress,
}: IconButtonProps) {
  return (
    <TouchableOpacity onPress={onPress}>
      <View
        style={{
          width: iconSize,
          height: iconSize,
          alignContent: "center",
          justifyContent: "center",
          backgroundColor: backgroundColor,
          borderRadius: 50,
        }}
      >
        <MaterialIcons name={iconName} size={iconSize} color={iconColor} />
      </View>
    </TouchableOpacity>
  );
}
