import React from "react";
import { StyleSheet, View } from "react-native";
import { MyText } from "../MyText";
import { useNavigation } from "@react-navigation/native";
import theme from "../../../theme";
import IconButton from "../IconButton";
import { MyAppBarProps } from "../../types";

export default function MyAppBar({ title }: MyAppBarProps) {
  const navigation = useNavigation();

  return (
    <View style={styles.header}>
      {/* Left Icon */}
      <IconButton
        iconName="keyboard-arrow-left"
        iconSize={36}
        iconColor={theme.colorSummerSky}
        backgroundColor={theme.colorLightGrey}
        onPress={() => navigation.goBack()}
      />

      {/* Title */}
      <MyText style={styles.title}>{title}</MyText>
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
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: theme.colorLightGrey,
  },
  title: {
    color: theme.colorGrey,
    textAlign: "center",
    fontSize: 24,
    flex: 1,
  },
});
