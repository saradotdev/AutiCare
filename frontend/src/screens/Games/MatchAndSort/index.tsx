import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  ImageBackground,
  View,
  PanResponder,
} from "react-native";
import { GameAppBar, MyModal, ScoreCard } from "../../../components";
import { objects, buckets } from "./objectsData";
import { styles } from "./index.styles";
import ConfettiCannon from "react-native-confetti-cannon";
import { instructions } from "./instructionsData";

const FALL_DURATION = 8000;
const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;
const BUCKET_Y_POSITION = SCREEN_HEIGHT * 0.75;

const bucketWidth = 150;
const bucketSpacing = SCREEN_WIDTH / buckets.length;
const enrichedBuckets = buckets.map((bucket, index) => ({
  ...bucket,
  x: bucketSpacing * index + bucketSpacing / 2,
}));

const gameBg = require("../../../assets/images/games/Match And Sort/Background.png");

export default function MatchAndSort() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const fallAnimation = useRef(new Animated.Value(0)).current;
  const moveX = useRef(new Animated.Value(0)).current;
  const latestMoveX = useRef(0);
  const confettiRef = useRef<any>();

  useEffect(() => {
    const moveXListener = moveX.addListener(({ value }) => {
      latestMoveX.current = value;
    });

    return () => {
      moveX.removeListener(moveXListener);
    };
  }, []);

  useEffect(() => {
    if (currentIndex < objects.length) {
      startFalling();
    } else {
      setGameOver(true);
      confettiRef?.current?.start();
    }
  }, [currentIndex]);

  const startFalling = () => {
    fallAnimation.setValue(0);
    moveX.setValue(0);

    Animated.timing(fallAnimation, {
      toValue: 1,
      duration: FALL_DURATION,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start(() => {
      checkIfCorrect();
    });
  };

  const checkIfCorrect = () => {
    const object = objects[currentIndex];
    const objectX = SCREEN_WIDTH / 2 + latestMoveX.current;

    let correctBucket = enrichedBuckets.find((bucket) => {
      const bucketLeft = bucket.x - bucketWidth / 2;
      const bucketRight = bucket.x + bucketWidth / 2;

      return (
        object.color === bucket.color &&
        objectX >= bucketLeft &&
        objectX <= bucketRight
      );
    });

    if (correctBucket) {
      setScore((prevScore) => prevScore + 1);
    }

    setCurrentIndex((prevIndex) => prevIndex + 1);
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gesture) => {
        moveX.setValue(gesture.dx);
      },
    }),
  ).current;

  const currentObject = objects[currentIndex];

  return (
    <ImageBackground source={gameBg} style={styles.container}>
      <View style={styles.overlay}></View>
      <GameAppBar title="Match and Sort" instructions={instructions} />
      <ScoreCard score={score} total={5} />

      <View style={styles.gameContainer}>
        {/* Falling objects with swipe control */}
        {currentObject && (
          <View style={styles.fallingObjects} {...panResponder.panHandlers}>
            <Animated.View
              style={[
                styles.fallingObject,
                {
                  transform: [
                    {
                      translateY: fallAnimation.interpolate({
                        inputRange: [0, 1],
                        outputRange: [-10, BUCKET_Y_POSITION - 50],
                      }),
                    },
                    { translateX: moveX },
                  ],
                  opacity: fallAnimation.interpolate({
                    inputRange: [0.9, 1], // near the bucket
                    outputRange: [1, 0], // object fades out when dropped inside the bucket
                  }),
                },
              ]}
            >
              <currentObject.component width={120} height={100} />
            </Animated.View>
          </View>
        )}

        {/* Buckets */}
        <View style={styles.row}>
          {enrichedBuckets.map((bucket, index) => {
            const BucketComponent = bucket.component;
            return (
              <View
                key={index}
                style={{
                  position: "absolute",
                  left: bucket.x - bucketWidth / 2,
                }}
              >
                <BucketComponent width={bucketWidth} height={150} />
              </View>
            );
          })}
        </View>
      </View>

      {/* Modal when game is over */}
      <MyModal
        visible={gameOver}
        text={"Yay!!\nExcellent"}
        buttonText="Exit"
        onClose={() => setGameOver(false)}
      />

      {/* Confetti animation */}
      <ConfettiCannon
        ref={confettiRef}
        count={50}
        origin={{ x: SCREEN_WIDTH / 2, y: -30 }}
        autoStart={false}
        fadeOut={true}
      />
    </ImageBackground>
  );
}
