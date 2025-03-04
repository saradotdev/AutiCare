import React from "react";
import { View } from "react-native";
import { ChildDetails, ScrollPicker } from "../../../components";
import { RootStackParamList } from "../../../types/navigation";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

export default function AgePicker() {
  const main = "Pick the age of your child";
  const sub = "This will help us personalize your child’s app experience";

  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  return (
    <View style={{ alignItems: "center" }}>
      <ChildDetails
        main={main}
        sub={sub}
        onPress={() => navigation.navigate("GenderSelector")}
      >
        <ScrollPicker />
      </ChildDetails>
    </View>
  );
}
