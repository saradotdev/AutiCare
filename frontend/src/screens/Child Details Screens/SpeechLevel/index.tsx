import React, { useState } from "react";
import { View } from "react-native";
import { ChildDetails, MyRadioGroup } from "../../../components";
import { RootStackParamList } from "../../../types";
import { useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

export default function SpeechLevel() {
  const main = "Select Speech Level";
  const sub = "Please select your child’s speech level";

  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const route = useRoute();
  const { age, gender } = route.params as { age: string; gender: string };

  const [speechLevel, setSpeechLevel] = useState<string>("nonverbal");

  return (
    <View style={{ alignItems: "center" }}>
      <ChildDetails
        main={main}
        sub={sub}
        onPress={() =>
          navigation.navigate("SetGoal", {
            age,
            gender,
            speechLevel: speechLevel,
          })
        }
      >
        <MyRadioGroup
          options={[
            { label: "Nonverbal", value: "nonverbal" },
            { label: "Partially Verbal", value: "partially_verbal" },
            { label: "Verbal", value: "verbal" },
          ]}
          defaultValue={speechLevel}
          onSelect={(value: string) => {
            setSpeechLevel(value);
          }}
        />
      </ChildDetails>
    </View>
  );
}
