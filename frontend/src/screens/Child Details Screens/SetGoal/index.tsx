import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { MyAppBar, MyButton, MyRadioGroup, MyText } from "../../../components";
import theme from "../../../../theme";
import { RootStackParamList } from "../../../types";
import { useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { createChild } from "../../../api/childrenApi";

export default function SetGoal() {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const route = useRoute();
  const { age, gender, speechLevel } = route.params as {
    age: string;
    gender: string;
    speechLevel: string;
  };

  const [timeOfPractice, setTimeOfPractice] = useState<string>("16");

  const handleSubmit = async () => {
    const selectedTime = Number(timeOfPractice);
    try {
      await createChild(age, gender, speechLevel, selectedTime);
      navigation.reset({ index: 0, routes: [{ name: "Home" }] });
    } catch (error) {
      console.error("Failed to create child profile:", error);
    }
  };

  return (
    <View>
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
          { label: "Basic", value: "8", sublabel: "8 minutes daily" },
          { label: "Casual", value: "16", sublabel: "16 minutes daily" },
          { label: "Engaged", value: "30", sublabel: "30 minutes daily" },
        ]}
        defaultValue={timeOfPractice}
        onSelect={(value: string) => setTimeOfPractice(value)}
      />

      <View style={styles.ctaContainer}>
        <MyButton
          style={styles.cta}
          textColor={theme.colorWhite}
          onPress={handleSubmit}
        >
          Continue
        </MyButton>
      </View>
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
  ctaContainer: {
    flex: 1,
    bottom: -308,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  cta: {
    backgroundColor: theme.colorSummerSky,
    width: 218,
  },
});
