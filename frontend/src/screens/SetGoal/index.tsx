import React from "react";
import { StyleSheet, View } from "react-native";
import { MyAppBar, MyButton, MyRadioGroup, MyText } from "../../components";
import theme from "../../../theme";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../navigation";
import { useNavigation } from "@react-navigation/native";

type SetGoalNavigationProp = StackNavigationProp<RootStackParamList, "SetGoal">;

export default function SetGoal() {
  const navigation = useNavigation<SetGoalNavigationProp>();

  return (
    <View style={{ alignItems: "center" }}>
      <MyAppBar />
      <View style={styles.container}>
        <MyText style={styles.main}>Dr. Imrana Shakoor</MyText>
        <MyText style={styles.sub}>Speech Language Pathologist</MyText>
        <MyText style={styles.body}>
          Your child should practice regularly. I recommend to practice at least
          16 minutes daily for optimum growth and best resuts.
        </MyText>
      </View>
      <MyRadioGroup
        options={[
          { label: "Basic", value: "basic", sublabel: "8 minutes daily" },
          { label: "Casual", value: "casual", sublabel: "16 minutes daily" },
          { label: "Engaged", value: "engaged", sublabel: "30 minutes daily" },
        ]}
        onSelect={(value) => console.log("Selected:", value)}
      />
      <MyButton
        style={styles.cta}
        textColor={theme.colorWhite}
        onPress={() => navigation.navigate("Home")}
      >
        Continue
      </MyButton>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  main: {
    fontSize: 18,
    color: theme.colorSummerSky,
  },
  sub: {
    fontSize: 12,
    color: theme.colorMediumGrey,
    fontFamily: theme.poppinsRegular,
  },
  body: {
    fontSize: 12,
    color: theme.colorBlack,
    fontFamily: theme.poppinsRegular,
    marginTop: 30,
    marginBottom: 40,
  },
  cta: {
    backgroundColor: theme.colorSummerSky,
    width: 218,
    position: "absolute",
    bottom: -300,
  },
});
