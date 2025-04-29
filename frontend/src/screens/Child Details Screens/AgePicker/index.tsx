import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { ChildDetails, MyText } from "../../../components";
import { RootStackParamList } from "../../../types";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import theme from "../../../../theme";
import { WheelPicker } from "react-native-infinite-wheel-picker";

export default function AgePicker() {
  const main = "Pick the age of your child";
  const sub = "This will help us personalize your child’s app experience";

  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const initialData = ["3-5 years", "6-8 years", "9-12 years"];
  const [age, setAge] = useState<string>(initialData[0]);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  const formatAgeForBackend = (age: string) => age.replace(" years", "");
  // backend expects 3-5 instead of 3-5 years

  return (
    <View style={{ alignItems: "center" }}>
      <ChildDetails
        main={main}
        sub={sub}
        onPress={() => {
          const selectedAge = formatAgeForBackend(age);
          age && navigation.navigate("GenderSelector", { age: selectedAge });
        }}
      >
        <View style={styles.container}>
          <MyText style={styles.title}>Pick age range</MyText>

          <WheelPicker
            initialSelectedIndex={0}
            data={initialData}
            restElements={2}
            elementHeight={28}
            onChangeValue={(index, value) => {
              setSelectedIndex(index);
              setAge(value);
            }}
            infiniteScroll={false}
            selectedIndex={selectedIndex}
            containerStyle={styles.containerStyle}
            selectedLayoutStyle={styles.selectedLayoutStyle}
            elementTextStyle={styles.elementTextStyle}
          />
        </View>
      </ChildDetails>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    marginVertical: 30,
  },
  title: {
    backgroundColor: theme.colorSoftGrey,
    padding: 10,
    width: "100%",
    textAlign: "center",
    fontSize: 20,
    color: theme.colorSummerSky,
    borderRadius: 10,
    marginBottom: 20,
  },
  selectedLayoutStyle: {
    backgroundColor: theme.colorBackground,
  },
  containerStyle: {
    width: 300,
  },
  elementTextStyle: {
    fontFamily: theme.ibrand,
    fontSize: 20,
    color: theme.colorDarkGrey,
  },
});
