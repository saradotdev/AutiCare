import React from "react";
import { StyleSheet, View } from "react-native";
import { FamilyImg } from "../../assets";
import { ChildDetailsProps } from "../../types";
import { MyText } from "../MyText";
import theme from "../../../theme";

export default function ChildDetails({ main, sub }: ChildDetailsProps) {
  return (
    <View style={styles.container}>
      <FamilyImg style={styles.img} />
      <MyText style={styles.main}>{main}</MyText>
      <MyText style={styles.sub}>{sub}</MyText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  img: {
    marginTop: 50,
  },
  main: {
    fontSize: 28,
    marginTop: 50,
    marginBottom: 10,
  },
  sub: {
    fontSize: 18,
    textAlign: "center",
    color: theme.colorDarkGrey,
    fontFamily: theme.poppinsRegular,
  },
});
