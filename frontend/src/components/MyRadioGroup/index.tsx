import React, { useState } from "react";
import { View, Pressable, StyleSheet } from "react-native";
import { RadioButton } from "react-native-paper";
import { MyText } from "../../components";
import { MyRadioGroupProps } from "../../types";
import theme from "../../../theme";

const MyRadioGroup: React.FC<MyRadioGroupProps> = ({
  options,
  defaultValue,
  onSelect,
}) => {
  const [selected, setSelected] = useState(defaultValue || options[0].value);

  const handleSelect = (value: string) => {
    setSelected(value);
    onSelect(value);
  };

  return (
    <View style={styles.container}>
      <RadioButton.Group onValueChange={handleSelect} value={selected}>
        {options.map((option) => (
          <Pressable
            key={option.value}
            style={styles.row}
            onPress={() => handleSelect(option.value)}
          >
            <View style={styles.textContainer}>
              <MyText
                style={[
                  styles.text,
                  selected === option.value && styles.selectedText,
                ]}
              >
                {option.label}
              </MyText>
              <MyText
                style={[
                  styles.subtext,
                  selected === option.value && styles.selectedText,
                ]}
              >
                {option.sublabel}
              </MyText>
            </View>
            <RadioButton
              value={option.value}
              color={theme.colorSummerSky}
              uncheckedColor={theme.colorMediumGrey}
            />
          </Pressable>
        ))}
      </RadioButton.Group>
    </View>
  );
};

export default MyRadioGroup;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    marginVertical: 0,
  },
  row: {
    flexDirection: "row",
    paddingVertical: 10,
    justifyContent: "space-between",
    width: "100%",
    borderTopColor: theme.colorSoftGrey,
    borderTopWidth: 1,
  },
  textContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "90%",
  },
  text: {
    fontSize: 22,
    textAlignVertical: "center",
  },
  subtext: {
    fontSize: 12,
    color: theme.colorMediumGrey,
    fontFamily: theme.poppinsRegular,
    textAlignVertical: "center",
  },
  selectedText: {
    color: theme.colorSummerSky,
  },
});
