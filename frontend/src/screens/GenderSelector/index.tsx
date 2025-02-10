import React from "react";
import { StyleSheet, View } from "react-native";
import {
  MyAppBar,
  MyButton,
  ChildDetails,
  MyRadioGroup,
} from "../../components";
import theme from "../../../theme";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../navigation";
import { useNavigation } from "@react-navigation/native";

type GenderSelectorNavigationProp = StackNavigationProp<
  RootStackParamList,
  "GenderSelector"
>;

export default function GenderSelector() {
  const main = "Select Gender";
  const sub = "Please select your child’s gender";

  const navigation = useNavigation<GenderSelectorNavigationProp>();

  return (
    <View style={{ alignItems: "center" }}>
      <MyAppBar />
      <ChildDetails main={main} sub={sub} />
      <MyRadioGroup
        options={[
          { label: "Male", value: "male" },
          { label: "Female", value: "female" },
        ]}
        onSelect={(value) => console.log("Selected:", value)}
      />
      <MyButton
        style={styles.cta}
        textColor={theme.colorWhite}
        onPress={() => navigation.navigate("SpeechLevel")}
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
    position: "absolute",
    bottom: -230,
  },
});
