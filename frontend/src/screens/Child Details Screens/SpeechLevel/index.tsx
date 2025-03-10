import React from "react";
import { View } from "react-native";
import { ChildDetails, MyRadioGroup } from "../../../components";
import { RootStackParamList } from "../../../types/navigation";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

export default function SpeechLevel() {
  const main = "Select Speech Level";
  const sub = "Please select your child’s speech level";

  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  return (
    <View style={{ alignItems: "center" }}>
      <ChildDetails
        main={main}
        sub={sub}
        onPress={() => navigation.navigate("SetGoal")}
      >
        <MyRadioGroup
          options={[
            { label: "Nonverbal", value: "a" },
            { label: "Partially Verbal", value: "b" },
            { label: "Verbal", value: "c" },
          ]}
          onSelect={(value) => console.log("Selected:", value)}
        />
      </ChildDetails>
    </View>
  );
}
