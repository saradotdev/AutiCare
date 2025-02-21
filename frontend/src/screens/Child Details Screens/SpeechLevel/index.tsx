import React from "react";
import { View } from "react-native";
import { ChildDetails, MyRadioGroup } from "../../../components";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../../navigation";
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
      <ChildDetails
        main={main}
        sub={sub}
        nextScreen="SetGoal"
        navigation={navigation}
      >
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
      </ChildDetails>
    </View>
  );
}
