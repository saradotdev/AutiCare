import React from "react";
import { StyleSheet, View } from "react-native";
import { MyAppBar, MyButton, MyRadioGroup } from "../../components";
import { ChildDetails } from "../../components";
import theme from "../../../theme";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../navigation";
import { useNavigation } from "@react-navigation/native";

type SpeechLevelNavigationProp = StackNavigationProp<
  RootStackParamList,
  "SpeechLevel"
>;

export default function SpeechLevel() {
  const main = "Select Speech Level";
  const sub = "Please select your child’s speech level";
  const navigation = useNavigation<SpeechLevelNavigationProp>();

  return (
    <View style={{ alignItems: "center" }}>
      <MyAppBar />
      <ChildDetails main={main} sub={sub} />
      <MyRadioGroup
        options={[
          { label: "Nonverbal", value: "a" },
          { label: "Nonverbal but can tell yes/no", value: "b" },
          { label: "Cannot speak but knows words", value: "c" },
          { label: "Does speak but not everyone understands", value: "d" },
          { label: "Verbal", value: "e" },
        ]}
        onSelect={(value) => console.log("Selected:", value)}
      />
      <MyButton
        style={styles.cta}
        textColor={theme.colorWhite}
        onPress={() => navigation.navigate("SetGoal")}
      >
        Continue
      </MyButton>
    </View>
  );
}

const styles = StyleSheet.create({
  cta: {
    backgroundColor: theme.colorSummerSky,
    width: 218,
    bottom: 40,
  },
});
