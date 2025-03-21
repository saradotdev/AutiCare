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
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
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

  // special handling for age group 9-12 (3 images, 1 expression)
  const [imagesData, setImagesData] = useState<any[]>([]);
  const [ageGroup, setAgeGroup] = useState<string | null>(null);
  const [currentType, setCurrentType] = useState<string | null>(null);
  const [currentOptions, setCurrentOptions] = useState<
    { id: string; image_url: string; is_correct: boolean }[]
  >([]);

  useEffect(() => {
    fetchFacialExpressions().then(async (data) => {
      if (data && (data.images || data.expressions)) {
        setAgeGroup(data.age_group);

        if (data.age_group === "3-5" || data.age_group === "6-8") {
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

        if (data.age_group === "9-12") {
          // Pick a random expression & three images (one correct, two random)
          const formattedImages = data.expressions.map((item: any) => ({
            name: item.type.charAt(0).toUpperCase() + item.type.slice(1),
            images: item.images.map((img: any) => ({
              id: img.id,
              image_url: img.image_url,
              is_correct: img.is_correct,
            })),
          }));

          setImagesData(formattedImages);

          const svgCache: { [key: string]: string } = {};

          await Promise.all(
            formattedImages.flatMap((item: any) =>
              item.images.map(async (img: any) => {
                const response = await fetch(img.image_url);
                svgCache[img.image_url] = await response.text();
              }),
            ),
          );

          setCachedSvgs(svgCache);

          const currentSet = formattedImages[0];
          setCurrentType(currentSet.name);
          setCurrentOptions(currentSet.images);
        }
      }

      setLoading(false);
    });
  }, []);

  const handleGuess = (guess: string | boolean) => {
    // in case of ages 3-5 and 6-8
    if (typeof guess === "string") {
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
          if (currentIndex + 1 < expressions.length) {
            setCurrentIndex((prev) => prev + 1);
            setSelectedExpression(null);
            setCurrentExpression(expressions[currentIndex + 1]);
          }
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
    } else if (typeof guess === "boolean") {
      // 9-12 age group
      if (guess) {
        // correct guess: showing modal and changing image
        setScore(score + 1);
        setModalText("Yay!!\nExcellent");
        confettiRef?.current?.start();
        setModalVisible(true);

        setTimeout(() => {
          setModalVisible(false);
          // Move to the next set of images
          if (currentIndex + 1 < imagesData.length) {
            setCurrentIndex((prev) => prev + 1);
            setCurrentType(imagesData[currentIndex + 1].name);
            setCurrentOptions(imagesData[currentIndex + 1].images);
          }
        }, 2000);
      } else {
        // wrong guess: showing modal but keeping the image
        setModalText("Oops!!\nTry Again");
        setModalVisible(true);

        setTimeout(() => {
          setModalVisible(false);
        }, 2000);
      }
    }
  };

  return (
    <ImageBackground source={gameBg} style={styles.container}>
      <View style={styles.overlay}></View>
      <GameAppBar title="Guess the Expression" instructions={instructions} />

      {loading ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color={theme.colorSummerSky} />
        </View>
      ) : /* Show expression image and row of buttons for age groups 3-5 and 6-8 */
      (ageGroup === "3-5" || ageGroup === "6-8") && currentExpression ? (
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
        // Show 3 images for age group 9-12
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
