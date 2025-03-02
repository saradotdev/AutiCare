import React from "react";
import { GameCardProps } from "../../types";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { MyText } from "../MyText";
import theme from "../../../theme";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

export const GameCard: React.FC<GameCardProps> = ({
  title,
  color,
  Image,
  nextScreen,
  navigation,
}) => {
  return (
    <TouchableOpacity
      style={[{ backgroundColor: color }, styles.container]}
      activeOpacity={0.8}
      onPress={() => navigation.navigate(nextScreen)}
    >
      <Image />
      <View style={styles.row}>
        <FontAwesome6 name="circle-play" size={42} color={theme.colorWhite} />
        <MyText style={styles.text}>{title}</MyText>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    padding: 20,
    marginHorizontal: 20,
    marginVertical: 10,
    borderRadius: 50,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  text: {
    color: theme.colorWhite,
    fontSize: 24,
    marginLeft: 10,
  },
});
