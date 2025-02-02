import React from "react";
import { StyleSheet, View } from "react-native";
import { MyText } from "../MyText";
import { useNavigation } from "@react-navigation/native";
import theme from "../../../theme";
import IconButton from "../IconButton";
import { MyAppBarProps } from "../../types";
import { MyButton } from "../MyButton";

export default function MyAppBar({
  title,
  rightAction,
  rightActionOnPress,
}: MyAppBarProps) {
  const navigation = useNavigation();

  return (
    <View style={styles.header}>
      {/* Left Action */}
      <IconButton
        iconName="keyboard-arrow-left"
        iconSize={36}
        iconColor={theme.colorSummerSky}
        backgroundColor={theme.colorSoftGrey}
        onPress={() => navigation.goBack()}
      />

      {/* Title */}
      <MyText style={styles.title}>{title}</MyText>

      {/* Right Action */}
      <MyButton
        textColor={theme.colorSummerSky}
        style={styles.rightAction}
        onPress={() => {
          if (rightActionOnPress) {
            navigation.navigate(rightActionOnPress as never);
          }
        }}
      >
        {rightAction}
      </MyButton>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 35,
    paddingBottom: 10,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colorSoftGrey,
  },
  title: {
    color: theme.colorDarkGrey,
    textAlign: "center",
    fontSize: 24,
    flex: 1,
  },
  rightAction: {
    marginVertical: 0,
  },
});
