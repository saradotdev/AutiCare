import React from "react";
import { Modal, View, StyleSheet } from "react-native";
import { MyText } from "../MyText";
import { MyModalProps } from "../../types";
import theme from "../../../theme";
import { MyButton } from "../MyButton";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../types/navigation";
import { StackNavigationProp } from "@react-navigation/stack";

const MyModal: React.FC<MyModalProps> = ({
  visible,
  text,
  buttonText,
  onClose,
  children,
}) => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const handleButtonPress = () => {
    onClose();
    navigation.goBack();
  };

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          {text && <MyText style={styles.modalText}>{text}</MyText>}
          {children}

          {buttonText ? (
            <MyButton
              onPress={handleButtonPress}
              style={styles.modalButton}
              textColor={theme.colorWhite}
            >
              {buttonText}
            </MyButton>
          ) : null}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: 250,
    height: 350,
    backgroundColor: theme.colorWhite,
    padding: 20,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "-5px -8px 3.7px 0px rgba(0, 132, 255, 0.25) inset",
  },
  modalText: {
    fontSize: 45,
    textAlign: "center",
    color: theme.colorSummerSky,
  },
  modalButton: {
    width: 100,
    borderRadius: 10,
    marginTop: 30,
    backgroundColor: theme.colorSummerSky,
  },
});

export default MyModal;
