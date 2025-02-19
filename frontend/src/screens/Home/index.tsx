import React from "react";
import { Text, View } from "react-native";
import { MyAppBar } from "../../components";

export default function Home() {
  return (
    <View>
      <MyAppBar />
      <Text>Home Screen</Text>
    </View>
  );
}
