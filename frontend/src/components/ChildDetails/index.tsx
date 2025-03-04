import React from "react";
import { StyleSheet, View } from "react-native";
import { FamilyImg } from "../../assets";
import { ChildDetailsProps } from "../../types";
import { MyText } from "../MyText";
import theme from "../../../theme";
import { MyButton } from "../MyButton";
import MyAppBar from "../MyAppBar";

export default function ChildDetails({
  main,
  sub,
  children,
  onPress,
}: ChildDetailsProps) {
  return (
    <View>
      <MyAppBar />
      <View style={styles.container}>
        <FamilyImg />
        <MyText style={styles.main}>{main}</MyText>
        <MyText style={styles.sub}>{sub}</MyText>
        {children}
      </View>

      <View style={styles.ctaContainer}>
        <MyButton
          textColor={theme.colorWhite}
          style={styles.cta}
          onPress={onPress}
        >
          <MyText>Continue</MyText>
        </MyButton>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  main: {
    fontSize: 28,
    marginTop: 30,
    marginBottom: 10,
    color: theme.colorCharcoal,
  },
  sub: {
    fontSize: 18,
    textAlign: "center",
    color: theme.colorDarkGrey,
    fontFamily: theme.poppinsRegular,
  },
  ctaContainer: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  cta: {
    backgroundColor: theme.colorSummerSky,
    width: 218,
  },
});
