import React from "react";
import { TextInput, View, StyleSheet } from "react-native";
import theme from "../../../theme";
import { MyText } from "../MyText";
import { MyInputProps } from "../../types";

export default function MyInput({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry,
}: MyInputProps) {
  return (
    <View style={styles.container}>
      <MyText style={styles.label}>{label}</MyText>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={theme.colorGrey}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    marginVertical: 16,
  },
  label: {
    color: theme.colorSummerSky,
    fontSize: 16,
  },
  input: {
    height: 40,
    borderBottomColor: theme.colorSummerSky,
    borderBottomWidth: 1,
    paddingHorizontal: 0,
    paddingVertical: 0,
    fontSize: 12,
    color: theme.colorDarkGrey,
    fontFamily: theme.poppinsRegular,
  },
});
