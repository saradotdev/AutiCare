import React, { useState } from "react";
import { View } from "react-native";
import { ChildDetails, MyRadioGroup } from "../../../components";
import { RootStackParamList } from "../../../types";
import { useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

export default function GenderSelector() {
  const main = "Select Gender";
  const sub = "Please select your child’s gender";

  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const route = useRoute();
  const { age } = route.params as { age: string };

  const [selectedGender, setSelectedGender] = useState<string>("male");

  return (
    <View style={{ alignItems: "center" }}>
      <ChildDetails
        main={main}
        sub={sub}
        onPress={() => {
          if (selectedGender) {
            navigation.navigate("SpeechLevel", {
              age,
              gender: selectedGender,
            });
          }
        }}
      >
        <MyRadioGroup
          options={[
            { label: "Male", value: "male" },
            { label: "Female", value: "female" },
          ]}
          defaultValue={selectedGender}
          onSelect={(value: string) => setSelectedGender(value)}
        />
      </ChildDetails>
    </View>
  );
}
