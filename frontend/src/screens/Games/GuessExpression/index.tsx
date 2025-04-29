import React, { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  ImageBackground,
  View,
  Animated,
  ActivityIndicator,
  TouchableOpacity,
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
  const [isLoading, setIsLoading] = useState(true);
  const [score, setScore] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cachedSvgs, setCachedSvgs] = useState<{ [key: string]: string }>({});
  const [modalVisible, setModalVisible] = useState(false);
  const [modalText, setModalText] = useState("");
  const confettiRef = useRef<any>();
  const [ageGroup, setAgeGroup] = useState<string | null>(null);

  /* States for age groups 3-5 and 6-8 */
  const [expressions, setExpressions] = useState<
    { name: string; image_url: string }[]
  >([]);
  const [currentExpression, setCurrentExpression] = useState<{
    name: string;
    image_url: string;
  } | null>(null);
  const [selectedExpression, setSelectedExpression] = useState<string | null>(
    null,
  );
  const [shuffledOptions, setShuffledOptions] = useState<
    { name: string; image_url: string }[]
  >([]);
  const buttonScales = useRef<{ [key: string]: Animated.Value }>({}).current;

  /* States for age group 9-12 */
  const [imagesData, setImagesData] = useState<any[]>([]);
  const [currentType, setCurrentType] = useState<string | null>(null);
  const [currentOptions, setCurrentOptions] = useState<
    { id: string; image_url: string; is_correct: boolean }[]
  >([]);

  /* Fetch expressions and set initial game state */
  useEffect(() => {
    const initializeGame = async () => {
      const data = await fetchFacialExpressions();
      if (!data || (!data.images && !data.expressions)) return;

      setAgeGroup(data.age_group);
      if (data.age_group === "3-5" || data.age_group === "6-8") {
        await setupYoungAgeGroup(data.images);
      } else if (data.age_group === "9-12") {
        await setupOlderAgeGroup(data.expressions);
      }

      setIsLoading(false);
    };

    initializeGame();
  }, []);

  /* Shuffle array */
  const shuffleArray = (array: any[]) => {
    return array.sort(() => Math.random() - 0.5);
  };

  /* Setup for age groups 3-5 and 6-8 */
  const setupYoungAgeGroup = async (images: any[]) => {
    let formattedExpressions = images.map((item) => ({
      name: capitalize(item.type),
      image_url: item.image_url,
    }));

    const svgCache = await fetchSvgCache(formattedExpressions);
    setCachedSvgs(svgCache);

    setExpressions(formattedExpressions);
    setCurrentExpression(formattedExpressions[0]);

    setShuffledOptions(shuffleArray([...formattedExpressions]));

    // Initialize button scales
    formattedExpressions.forEach((exp) => {
      if (!buttonScales[exp.name]) {
        buttonScales[exp.name] = new Animated.Value(1);
      }
    });
  };

  /* Setup for age group 9-12 */
  const setupOlderAgeGroup = async (expressionsData: any[]) => {
    const formattedImages = expressionsData.map((item) => ({
      name: capitalize(item.type),
      images: item.images.map((img: any) => ({
        id: img.id,
        image_url: img.image_url,
        is_correct: img.is_correct,
      })),
    }));

    setImagesData(formattedImages);

    const svgCache = await fetchSvgCache(
      formattedImages.flatMap((item) => item.images),
    );
    setCachedSvgs(svgCache);

    setCurrentType(formattedImages[0].name);
    setCurrentOptions(formattedImages[0].images);
  };

  /* Fetch and cache SVG images */
  const fetchSvgCache = async (
    items: { name?: string; image_url: string }[],
  ) => {
    const cache: { [key: string]: string } = {};
    await Promise.all(
      items.map(async (item) => {
        const response = await fetch(item.image_url);
        cache[item.name ?? item.image_url] = await response.text();
      }),
    );
    return cache;
  };

  /* Capitalize first letter of a string */
  const capitalize = (str: string) =>
    str.charAt(0).toUpperCase() + str.slice(1);

  /* Handle user guesses */
  const handleGuess = (guess: string | boolean) => {
    if (typeof guess === "string") {
      handleYoungAgeGroupGuess(guess);
    } else {
      handleOlderAgeGroupGuess(guess);
    }
  };

  /* Handle guess for age groups 3-5 and 6-8 */
  const handleYoungAgeGroupGuess = (guess: string) => {
    setSelectedExpression(guess);
    animateButton(guess);

    if (guess === currentExpression?.name) {
      showModal("Yay!!\nExcellent", true);
      setTimeout(() => moveToNextExpression(), 2000);
    } else {
      showModal("Oops!!\nTry Again");
    }
  };

  /* Handle guess for age group 9-12 */
  const handleOlderAgeGroupGuess = (isCorrect: boolean) => {
    if (isCorrect) {
      showModal("Yay!!\nExcellent", true);
      setTimeout(() => moveToNextImageSet(), 2000);
    } else {
      showModal("Oops!!\nTry Again");
    }
  };

  /* Animate button press */
  const animateButton = (button: string) => {
    if (!buttonScales[button]) return;
    Animated.sequence([
      Animated.timing(buttonScales[button], {
        toValue: 1.1,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(buttonScales[button], {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  };

  /* Show modal with message */
  const showModal = (message: string, confetti: boolean = false) => {
    setScore(score + 1);
    setModalText(message);
    setModalVisible(true);
    if (confetti) confettiRef.current?.start();
    setTimeout(() => setModalVisible(false), 2000);
  };

  /* Move to next expression (young age group) */
  const moveToNextExpression = () => {
    setSelectedExpression(null);
    if (currentIndex + 1 < expressions.length) {
      setCurrentIndex((prev) => prev + 1);
      setCurrentExpression(expressions[currentIndex + 1]);
      setShuffledOptions(shuffleArray(shuffledOptions));
    }
  };

  /* Move to next image set (age group 9-12) */
  const moveToNextImageSet = () => {
    if (currentIndex + 1 < imagesData.length) {
      setCurrentIndex((prev) => prev + 1);
      setCurrentType(imagesData[currentIndex + 1].name);
      setCurrentOptions(imagesData[currentIndex + 1].images);
    }
  };

  return (
    <ImageBackground source={gameBg} style={styles.container}>
      <View style={styles.overlay}></View>
      <GameAppBar title="Guess the Expression" instructions={instructions} />

      {isLoading ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color={theme.colorSummerSky} />
        </View>
      ) : (ageGroup === "3-5" || ageGroup === "6-8") && currentExpression ? (
        /* Show 3 expression names and an image for age groups 3-5 and 6-8 */
        <View style={styles.contentContainer}>
          <Images.Title width={"90%"} />

          <SvgXml
            xml={cachedSvgs[currentExpression.name]}
            width={200}
            height={300}
          />

          <View style={styles.buttonRow}>
            {[...new Set(shuffledOptions.map((exp) => exp.name))].map(
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
        /* Show 3 images and an expression name for age group 9-12 */
        <View style={styles.contentContainer}>
          <Images.Title width={"90%"} />

          <MyButton textColor={theme.colorWhite} style={styles.button}>
            <MyText style={{ fontFamily: theme.comicSansMS }}>
              {currentType}
            </MyText>
          </MyButton>

          <View style={styles.buttonRow}>
            {currentOptions.map((option, index) => (
              <TouchableOpacity
                key={`${option.image_url}-${index}`}
                onPress={() => handleGuess(option.is_correct)}
                style={{ margin: 10 }}
              >
                <SvgXml
                  xml={cachedSvgs[option.image_url]}
                  width={100}
                  height={150}
                />
              </TouchableOpacity>
            ))}
          </View>
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
