import React, { useState } from "react";
import { TextInput, View, StyleSheet } from "react-native";
import theme from "../../../theme";
import { MyText } from "../MyText";

interface MyInputProps {
  label: string;
  placeholder: string;
}

export default function MyInput({ label, placeholder }: MyInputProps) {
  const [text, setText] = useState("");

  return (
    <View style={styles.container}>
      <MyText style={styles.label}>{label}</MyText>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={theme.colorGrey}
        value={text}
        onChangeText={(newText) => setText(newText)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
  },
  label: {
    color: theme.colorSummerSky,
    fontSize: 16,
  },
  input: {
    height: 50,
    borderBottomColor: theme.colorSummerSky,
    borderBottomWidth: 1,
    paddingHorizontal: 10,
    fontSize: 16,
    color: "rgba(30, 30, 30, 0.75)",
    fontFamily: theme.poppinsRegular,
  },
});
