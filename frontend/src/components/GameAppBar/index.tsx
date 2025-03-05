import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Entypo from "@expo/vector-icons/Entypo";
import theme from "../../../theme";

export default function GameAppBar() {
  const navigation = useNavigation();

  return (
    <View style={styles.header}>
      {/* Left Action */}
      <TouchableOpacity
        style={styles.icon}
        activeOpacity={0.8}
        onPress={() => navigation.goBack()}
      >
        <FontAwesome6
          name="arrow-left-long"
          size={35}
          color={theme.colorWhite}
        />
      </TouchableOpacity>

      {/* Right Action */}
      <TouchableOpacity style={styles.icon} activeOpacity={0.8}>
        <Entypo name="help" size={35} color={theme.colorWhite} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 35,
    marginBottom: 10,
    marginHorizontal: 16,
  },
  icon: {
    backgroundColor: theme.colorSummerSky,
    borderRadius: 50,
    borderColor: theme.colorWhite,
    borderWidth: 5,
    padding: 5,
  },
});
