import React, { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  ImageBackground,
  View,
  Animated,
  ActivityIndicator,
} from "react-native";
import { GameAppBar, MyButton, MyModal, MyText } from "../../../components";
import * as Images from "../../../assets";
import theme from "../../../../theme";
import ConfettiCannon from "react-native-confetti-cannon";
import { styles } from "./index.styles";
import { instructions } from "./instructionsData";
import { fetchFacialExpressions } from "../../../api/facialExpressionsApi";
import { SvgXml } from "react-native-svg";

const gameBg = require("../../../assets/images/games/Guess The Expression/Background.png");

export default function GuessExpression() {
  const [expressions, setExpressions] = useState<
    { name: string; image_url: string }[]
  >([]);
  const [currentExpression, setCurrentExpression] = useState<{
    name: string;
    image_url: string;
  } | null>(null);
  const [score, setScore] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalText, setModalText] = useState("");
  const confettiRef = useRef<any>();
  const [selectedExpression, setSelectedExpression] = useState<string | null>(
    null,
  );
  const buttonScales = useRef<{ [key: string]: Animated.Value }>({}).current;
  const [cachedSvgs, setCachedSvgs] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    fetchFacialExpressions().then(async (data) => {
      if (data && data.images) {
        const formattedExpressions: { name: string; image_url: string }[] =
          data.images.map((item: any) => ({
            name: item.type.charAt(0).toUpperCase() + item.type.slice(1),
            image_url: item.image_url,
          }));

        const svgCache: { [key: string]: string } = {};

        await Promise.all(
          formattedExpressions.map(async (exp) => {
            const response = await fetch(exp.image_url);
            svgCache[exp.name] = await response.text();
          }),
        );

        setCachedSvgs(svgCache);

        setExpressions(formattedExpressions);
        setCurrentExpression(formattedExpressions[0]);

        // Initialize button scales
        formattedExpressions.forEach((exp) => {
          if (!buttonScales[exp.name]) {
            buttonScales[exp.name] = new Animated.Value(1);
          }
        });
      }
    });
  }, []);

  const handleGuess = (guess: string) => {
    setSelectedExpression(guess);

    if (!buttonScales[guess]) return;

    // Button animation
    Animated.sequence([
      Animated.timing(buttonScales[guess], {
        toValue: 1.1,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(buttonScales[guess], {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();

    if (guess === currentExpression?.name) {
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
      setModalText("Oops!!\nTry Again");
      setModalVisible(true);

      setTimeout(() => {
        setModalVisible(false);
        setSelectedExpression(null);
      }, 2000);
    }
  };

  return (
    <ImageBackground source={gameBg} style={styles.container}>
      <View style={styles.overlay}></View>
      <GameAppBar title="Guess the Expression" instructions={instructions} />

      {/* Show expression image */}
      {currentExpression ? (
        <View style={styles.contentContainer}>
          <Images.Title width={"90%"} />

          <SvgXml
            xml={cachedSvgs[currentExpression.name]}
            width={200}
            height={300}
          />

          <View style={styles.buttonRow}>
            {[...new Set(expressions.map((exp) => exp.name))].map(
              (uniqueExp) => (
                <Animated.View
                  key={uniqueExp}
                  style={{
                    transform: [
                      {
                        scale: buttonScales[uniqueExp] || new Animated.Value(1),
                      },
                    ],
                  }}
                >
                  <MyButton
                    onPress={() => handleGuess(uniqueExp)}
                    textColor={theme.colorWhite}
                    style={styles.button}
                  >
                    <MyText style={{ fontFamily: theme.comicSansMS }}>
                      {uniqueExp}
                    </MyText>
                  </MyButton>
                </Animated.View>
              ),
            )}
          </View>
        </View>
      ) : (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color={theme.colorSummerSky} />
        </View>
      )}

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
