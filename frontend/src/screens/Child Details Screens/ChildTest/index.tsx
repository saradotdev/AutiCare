import React from "react";
import { StyleSheet, View } from "react-native";
import { ChildTestImg } from "../../../assets";
import { MyButton, MyText } from "../../../components";
import theme from "../../../../theme";
import AntDesign from "@expo/vector-icons/AntDesign";
import { RootStackParamList } from "../../../types";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

export default function ChildTest() {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  return (
    <View style={styles.container}>
      <ChildTestImg />
      <MyText style={styles.main}>Give a short Child Development Test</MyText>
      <MyText style={styles.sub}>
        This test will give you a starting point for proper intervention and
        support for your child
      </MyText>
      <MyButton
        textColor={theme.colorWhite}
        style={styles.cta}
        onPress={() => navigation.navigate("AgePicker")}
        icon={<AntDesign name="arrowright" size={24} color="white" />}
      >
        <MyText style={{ textAlign: "center" }}>Let’s Start</MyText>
      </MyButton>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  main: {
    fontSize: 35,
    color: theme.colorCharcoal,
    marginTop: 40,
    marginBottom: 10,
  },
  sub: {
    fontFamily: theme.poppinsRegular,
    fontSize: 18,
    color: theme.colorDarkGrey,
    textAlign: "center",
    marginHorizontal: 16,
    marginBottom: 20,
  },
  cta: {
    width: 218,
    backgroundColor: theme.colorSummerSky,
  },
});
