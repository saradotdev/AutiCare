import React from "react";
import { View } from "react-native";
import { ChildDetails, MyRadioGroup } from "../../../components";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../../navigation";
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
      <ChildDetails
        main={main}
        sub={sub}
        nextScreen="SpeechLevel"
        navigation={navigation}
      >
        <MyRadioGroup
          options={[
            { label: "Male", value: "male" },
            { label: "Female", value: "female" },
          ]}
          onSelect={(value) => console.log("Selected:", value)}
        />
      </ChildDetails>
    </View>
  );
}
