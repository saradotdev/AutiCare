import React, { useState } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Modal,
  Text,
  Pressable,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Entypo from "@expo/vector-icons/Entypo";
import theme from "../../../theme";
import { GameAppBarProps } from "../../types";
import { LinearGradient } from "expo-linear-gradient";

export const GameAppBar: React.FC<GameAppBarProps> = ({
  title,
  instructions,
}) => {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);

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

      {/* Right Action (Help Button) */}
      <TouchableOpacity
        style={styles.icon}
        activeOpacity={0.8}
        onPress={() => setModalVisible(true)}
      >
        <Entypo name="help" size={35} color={theme.colorWhite} />
      </TouchableOpacity>

      {/* Help Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <LinearGradient
            colors={["#E3F4FF", "#37B2FF"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.modalBorder}
          >
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>How To Play</Text>
              <Text style={styles.gameTitle}>{title}:</Text>
              <Text style={styles.modalText}>{instructions}</Text>
              <Pressable
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.closeButtonText}>Got it!</Text>
              </Pressable>
            </View>
          </LinearGradient>
        </View>
      </Modal>
    </View>
  );
};

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
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalBorder: {
    width: "90%",
    height: "70%",
    padding: 5,
    borderRadius: 25,
  },
  modalContent: {
    flex: 1,
    backgroundColor: theme.colorWhite,
    padding: 20,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  modalTitle: {
    fontSize: 36,
    color: theme.colorSummerSky,
    fontFamily: theme.comicSansMS,
    textDecorationColor: theme.colorSummerSky,
    textDecorationLine: "underline",
    marginBottom: 10,
  },
  gameTitle: {
    fontSize: 24,
    color: theme.colorSummerSky,
    fontFamily: theme.comicSansMS,
    marginBottom: 10,
  },
  modalText: {
    fontSize: 20,
    fontFamily: theme.comicSansMS,
    color: theme.colorDarkGrey,
    marginBottom: 20,
  },
  closeButton: {
    width: "95%",
    backgroundColor: theme.colorSummerSky,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    elevation: 5,
  },
  closeButtonText: {
    color: theme.colorWhite,
    fontSize: 24,
    fontFamily: theme.comicSansMS,
    textAlign: "center",
  },
});
