import React, { useRef, useState } from "react";
import {
  Dimensions,
  ImageBackground,
  View,
  Modal,
  Animated,
} from "react-native";
import { GameAppBar, MyButton, MyText } from "../../../components";
import * as Images from "../../../assets";
import theme from "../../../../theme";
import ConfettiCannon from "react-native-confetti-cannon";
import { styles } from "./index.styles";

const gameBg = require("../../../assets/images/games/Background.jpeg");

const expressions = [
  { name: "Happy", component: Images.Happy },
  { name: "Sad", component: Images.Sad },
  { name: "Angry", component: Images.Angry },
];

export default function GuessExpression() {
  const [currentExpression, setCurrentExpression] = useState(
    expressions[Math.floor(Math.random() * expressions.length)],
  );
  const [score, setScore] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalText, setModalText] = useState("");
  const confettiRef = useRef<any>();

  // state to track which button is selected
  const [selectedExpression, setSelectedExpression] = useState<string | null>(
    null,
  );
  const buttonScales = {
    Happy: useRef(new Animated.Value(1)).current,
    Sad: useRef(new Animated.Value(1)).current,
    Angry: useRef(new Animated.Value(1)).current,
  };

  const handleGuess = (guess: string) => {
    setSelectedExpression(guess);
    const scaleKey = guess as keyof typeof buttonScales;

    // button animation
    Animated.sequence([
      Animated.timing(buttonScales[scaleKey], {
        toValue: 1.1,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(buttonScales[scaleKey], {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();

    if (guess === currentExpression.name) {
      // correct guess: showing modal and changing image
      setScore(score + 1);
      setModalText("Yay!!\nExcellent");
      confettiRef?.current?.start();

      setModalVisible(true);

      setTimeout(() => {
        setModalVisible(false);
        setSelectedExpression(null);
        setCurrentExpression(
          expressions[Math.floor(Math.random() * expressions.length)],
        );
      }, 2000);
    } else {
      // wrong guess: showing modal but keeping the image
      setModalText("Oops!\nTry Again");
      setModalVisible(true);

      setTimeout(() => {
        setModalVisible(false);
        setSelectedExpression(null);
      }, 1500);
    }
  };

  const ExpressionImage = currentExpression.component;

  return (
    <ImageBackground source={gameBg} style={styles.container}>
      <GameAppBar />

      <View style={styles.contentContainer}>
        <Images.Title width={"90%"} />

        <ExpressionImage width={200} height={300} />

        <View style={{ flexDirection: "row" }}>
          {expressions.map((exp) => (
            <Animated.View
              key={exp.name}
              style={{
                transform: [
                  {
                    scale: buttonScales[exp.name as keyof typeof buttonScales],
                  },
                ],
              }}
            >
              <MyButton
                onPress={() => handleGuess(exp.name)}
                textColor={theme.colorWhite}
                style={styles.button}
              >
                {exp.name}
              </MyButton>
            </Animated.View>
          ))}
        </View>
      </View>

      {/* Modal for Correct/Wrong Message */}
      <Modal
        transparent
        visible={modalVisible}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <MyText style={styles.modalText}>{modalText}</MyText>
          </View>
        </View>
      </Modal>

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
