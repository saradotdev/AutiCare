import React from "react";
import { View } from "react-native";
import { ChildDetails, MyRadioGroup } from "../../../components";
import { RootStackParamList } from "../../../types/navigation";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

export default function GenderSelector() {
  const main = "Select Gender";
  const sub = "Please select your child’s gender";

  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  return (
    <View style={{ alignItems: "center" }}>
      <ChildDetails
        main={main}
        sub={sub}
        onPress={() => navigation.navigate("SpeechLevel")}
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
