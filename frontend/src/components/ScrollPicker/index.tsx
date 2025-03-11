import React from "react";
import { StyleSheet, View } from "react-native";
import { WheelPicker } from "react-native-infinite-wheel-picker";
import theme from "../../../theme";
import { MyText } from "../MyText";

const ScrollPicker: React.FC = () => {
  const initialData = [
    "3-5 years",
    "6-8 years",
    "9-12 years",
  ];
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  return (
    <View style={styles.container}>
      <MyText style={styles.title}>Pick age range</MyText>

      <WheelPicker
        initialSelectedIndex={0}
        data={initialData}
        restElements={2}
        elementHeight={28}
        onChangeValue={(index, value) => {
          console.log(value);
          setSelectedIndex(index);
        }}
        infiniteScroll={false}
        selectedIndex={selectedIndex}
        containerStyle={styles.containerStyle}
        selectedLayoutStyle={styles.selectedLayoutStyle}
        elementTextStyle={styles.elementTextStyle}
      />
    </View>
  );
};

export default ScrollPicker;

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
