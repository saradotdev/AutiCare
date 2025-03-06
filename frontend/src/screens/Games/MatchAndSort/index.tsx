import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  ImageBackground,
  View,
} from "react-native";
import { GameAppBar, MyModal } from "../../../components";
import { objects, buckets } from "./objectsData";
import { styles } from "./index.styles";
import ConfettiCannon from "react-native-confetti-cannon";

const FALL_DURATION = 5000; // Adjust duration for better experience

const gameBg = require("../../../assets/images/games/Match And Sort/Background.png");

export default function MatchAndSort() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const fallAnimation = useRef(new Animated.Value(0)).current;
  const confettiRef = useRef<any>();

  useEffect(() => {
    if (currentIndex < objects.length) {
      startFalling();
    } else {
      setGameOver(true); // Show modal when all objects have fallen
      confettiRef?.current?.start(); // Start confetti animation
    }
  }, [currentIndex]);

  const startFalling = () => {
    fallAnimation.setValue(0);
    Animated.timing(fallAnimation, {
      toValue: 1,
      duration: FALL_DURATION,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start(() => {
      setCurrentIndex((prevIndex) => prevIndex + 1);
    });
  };

  const restartGame = () => {
    setCurrentIndex(0);
    setGameOver(false);
  };

  const currentObject = objects[currentIndex];

  return (
    <ImageBackground source={gameBg} style={styles.container}>
      <View style={styles.overlay}></View>
      <GameAppBar />

      <View style={styles.gameContainer}>
        {/* Render falling objects */}
        {currentObject && (
          <View style={styles.fallingObjects}>
            <Animated.View
              style={[
                styles.fallingObject,
                {
                  transform: [
                    {
                      translateY: fallAnimation.interpolate({
                        inputRange: [0, 1],
                        outputRange: [-100, 600],
                      }),
                    },
                  ],
                },
              ]}
            >
              <currentObject.component width={100} height={100} />
            </Animated.View>
          </View>
        )}

        {/* Render buckets */}
        <View style={styles.row}>
          {buckets.map((bucket, index) => {
            const BucketComponent = bucket.component;
            return <BucketComponent key={index} width={150} height={150} />;
          })}
        </View>
      </View>

      {/* Render modal when game is over */}
      <MyModal
        visible={gameOver}
        text={"Yay!!\nExcellent"}
        buttonText="Exit"
        onClose={() => setGameOver(false)}
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
