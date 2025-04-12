import React, { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  ImageBackground,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { styles } from "./index.styles";
import { GameAppBar, MyModal } from "../../../components";
import * as Images from "../../../assets";
import ConfettiCannon from "react-native-confetti-cannon";

const gameBg = require("../../../assets/images/GameBackground.png");

export default function SocialScenario() {
  const dialogues = [
    "Hi there! Welcome to the game.",
    "You're about to learn some cool social skills.",
    "Ready to begin? Let's go!",
  ];

  const options = [
    "Say hello back and smile",
    "Ignore and walk away",
    "Look confused",
    "Tell them to leave you alone",
  ];
  const correctOption = "Say hello back and smile";

  const [currentIndex, setCurrentIndex] = useState(0);
  const [showOptions, setShowOptions] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalText, setModalText] = useState("");
  const confettiRef = useRef<any>();

  useEffect(() => {
    if (currentIndex < dialogues.length - 1) {
      const timeout = setTimeout(() => {
        setCurrentIndex((prev) => prev + 1);
      }, 3000);
      return () => clearTimeout(timeout);
    } else {
      // Last dialogue — show options after short pause
      const timeout = setTimeout(() => {
        setShowOptions(true);
      }, 3000); // slight delay for polish
      return () => clearTimeout(timeout);
    }
  }, [currentIndex]);

  const handleGuess = (option: string) => {
    if (option === correctOption) {
      showModal("Good job!!\nCorrect", true);
    } else {
      showModal("Almost there!!\nTry again");
    }
  };

  const showModal = (message: string, confetti: boolean = false) => {
    setModalText(message);
    setModalVisible(true);
    if (confetti) confettiRef.current?.start();
    setTimeout(() => setModalVisible(false), 2000);
  };

  // Alternate bubbles: even index = left, odd = right
  const BubbleComponent =
    currentIndex % 2 === 0 ? Images.BubbleLeft : Images.BubbleRight;

  return (
    <ImageBackground source={gameBg} style={styles.container}>
      <View style={styles.overlay}></View>
      <GameAppBar title="Social Scenario" instructions={[]} />

      {!showOptions ? (
        <View style={styles.bubbleContainer}>
          <BubbleComponent style={styles.bubble} />
          <View style={styles.textOverlay}>
            <Text style={styles.bubbleText}>{dialogues[currentIndex]}</Text>
          </View>
        </View>
      ) : (
        <View style={styles.optionsContainer}>
          <Text style={styles.optionsHeading}>Choose the correct response</Text>
          <View style={styles.buttonsContainer}>
            {options.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={styles.optionButton}
                activeOpacity={0.8}
                onPress={() => handleGuess(option)}
              >
                <Text style={styles.optionText}>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      <View style={styles.characterContainer}>
        <Images.CharacterLeft />
        <Images.CharacterRight />
      </View>

      <MyModal
        visible={modalVisible}
        text={modalText}
        onClose={() => setModalVisible(false)}
      ></MyModal>

      <ConfettiCannon
        ref={confettiRef}
        count={50}
        origin={{ x: Dimensions.get("window").width / 2, y: -30 }}
        autoStart={false}
        fadeOut={true}
      />
    </ImageBackground>
  );
}
