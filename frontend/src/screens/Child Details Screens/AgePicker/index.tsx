import React from "react";
import { View } from "react-native";
import { ChildDetails, ScrollPicker } from "../../../components";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../../navigation";
import { useNavigation } from "@react-navigation/native";

type AgePickerNavigationProp = StackNavigationProp<
  RootStackParamList,
  "AgePicker"
>;

export default function AgePicker() {
  const main = "Pick the age of your child";
  const sub = "This will help us personalize your child’s app experience";
  const navigation = useNavigation<AgePickerNavigationProp>();

  return (
    <View style={{ alignItems: "center" }}>
      <ChildDetails
        main={main}
        sub={sub}
        nextScreen="GenderSelector"
        navigation={navigation}
      >
        <ScrollPicker />
      </ChildDetails>
    </View>
  );
}
