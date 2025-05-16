import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
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
import {
  endSocialScenarioGameSession,
  fetchSocialScenarios,
} from "../../../api/socialScenarioGameApi";
import { SocialScenario } from "../../../types";
import theme from "../../../../theme";
import { gameInstructions } from "./instructionsData";
import { Audio } from "expo-av";

const gameBg = require("../../../assets/images/GameBackground.png");

export default function SocialScenarioGame() {
  const [scenarios, setScenarios] = useState<SocialScenario[]>([]);
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
  const [currentDialogueIndex, setCurrentDialogueIndex] = useState(0);
  const [showOptions, setShowOptions] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalText, setModalText] = useState("");
  const [loading, setLoading] = useState(true);
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const correctRef = useRef(0);
  const incorrectRef = useRef(0);
  const confettiRef = useRef<any>();

  useEffect(() => {
    const loadScenarios = async () => {
      const data = await fetchSocialScenarios();
      if (data?.scenarios) {
        setScenarios(data.scenarios);
        setLoading(false);
      }
    };
    loadScenarios();
  }, []);

  const currentScenario = scenarios[currentScenarioIndex];
  const dialogues = currentScenario?.dialogues || [];

  useEffect(() => {
    if (!currentScenario) return;
    if (currentDialogueIndex < dialogues.length - 1) {
      const timeout = setTimeout(() => {
        setCurrentDialogueIndex((prev) => prev + 1);
      }, 3000);
      return () => clearTimeout(timeout);
    } else {
      const timeout = setTimeout(() => {
        setShowOptions(true);
        playSound("prompt");
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [currentDialogueIndex, currentScenario]);

  useEffect(() => {
    return () => {
      endSocialScenarioGameSession(correctRef.current, incorrectRef.current)
        .then(() => console.log("Game session ended"))
        .catch((err) => console.error("Failed to end session", err));
    };
  }, []);

  const handleGuess = (option: any) => {
    const isCorrect = option.is_correct;
    if (isCorrect) {
      playSound("correct");
      setCorrectCount((prev) => {
        correctRef.current = prev + 1;
        return prev + 1;
      });
      showModal("Good job!!\nCorrect", true);
    } else {
      playSound("incorrect");
      setIncorrectCount((prev) => {
        incorrectRef.current = prev + 1;
        return prev + 1;
      });
      showModal("Almost there!!\nTry again");
    }
  };

  const showModal = (message: string, confetti: boolean = false) => {
    setModalText(message);
    setModalVisible(true);
    if (confetti) confettiRef.current?.start();
    setTimeout(() => {
      setModalVisible(false);
      // Move to next scenario if answer was correct
      if (confetti && currentScenarioIndex < scenarios.length - 1) {
        setCurrentScenarioIndex((prev) => prev + 1);
        setCurrentDialogueIndex(0);
        setShowOptions(false);
      }
    }, 2000);
  };

  // Alternate bubbles: even index = left, odd = right
  const BubbleComponent =
    currentDialogueIndex % 2 === 0 ? Images.BubbleLeft : Images.BubbleRight;

  /** Load and play sound for correct, incorrect, or prompt feedback */
  const playSound = async (type: "correct" | "incorrect" | "prompt") => {
    const files =
      type === "correct"
        ? [
            require("../../../assets/sounds/correct.mp3"),
            require("../../../assets/voice commands/Good job.wav"),
          ]
        : type === "incorrect"
          ? [
              require("../../../assets/sounds/incorrect.mp3"),
              require("../../../assets/voice commands/Try again.wav"),
            ]
          : [require("../../../assets/voice commands/What should you do.wav")];

    for (const file of files) {
      const soundObject = new Audio.Sound();
      try {
        await soundObject.loadAsync(file);
        await soundObject.playAsync();

        soundObject.setOnPlaybackStatusUpdate((status) => {
          if (status.isLoaded && status.didJustFinish) {
            soundObject.unloadAsync();
          }
        });
      } catch (error) {
        console.log("Error playing sound:", error);
      }
    }
  };

  return (
    <ImageBackground source={gameBg} style={styles.container}>
      <View style={styles.overlay}></View>
      <GameAppBar title="Social Scenario" instructions={gameInstructions} />

      {loading ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color={theme.colorSummerSky} />
        </View>
      ) : !showOptions ? (
        <View style={styles.bubbleContainer}>
          <BubbleComponent style={styles.bubble} />
          <View style={styles.textOverlay}>
            <Text style={styles.bubbleText}>
              {dialogues[currentDialogueIndex]?.text || ""}
            </Text>
          </View>
        </View>
      ) : (
        <View style={styles.optionsContainer}>
          <Text style={styles.optionsHeading}>What should you do?</Text>
          <View style={styles.buttonsContainer}>
            {currentScenario?.options.map((option: any, index: any) => (
              <TouchableOpacity
                key={index}
                style={styles.optionButton}
                activeOpacity={0.8}
                onPress={() => handleGuess(option)}
              >
                <Text style={styles.optionText}>{option.text}</Text>
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
      />

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
