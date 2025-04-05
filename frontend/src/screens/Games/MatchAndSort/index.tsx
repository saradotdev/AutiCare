import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  ImageBackground,
  View,
  PanResponder,
  ActivityIndicator,
} from "react-native";
import { GameAppBar, MyModal, ScoreCard } from "../../../components";
import { styles } from "./index.styles";
import ConfettiCannon from "react-native-confetti-cannon";
import { instructions } from "./instructionsData";
import { fetchMatchAndSortGameAssets } from "../../../api/matchAndSortApi";
import { SvgXml } from "react-native-svg";
import { Bucket, FallingObject } from "../../../types";
import theme from "../../../../theme";

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;
const BUCKET_Y_POSITION = SCREEN_HEIGHT * 0.75;

const gameBg = require("../../../assets/images/games/Match And Sort/Background.png");

export default function MatchAndSort() {
  const [buckets, setBuckets] = useState<Bucket[]>([]);
  const [bucketWidth, setBucketWidth] = useState(150);
  const [fallingObjects, setFallingObjects] = useState<FallingObject[]>([]);
  const [fallingObjectSize, setFallingObjectSize] = useState(100);
  const [fallDuration, setFallDuration] = useState(8000);
  const [isLoading, setIsLoading] = useState(true);
  const [cachedSvgs, setCachedSvgs] = useState<{ [key: string]: string }>({});

  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const fallAnimation = useRef(new Animated.Value(0)).current;
  const moveX = useRef(new Animated.Value(0)).current;
  const latestMoveX = useRef(0);
  const confettiRef = useRef<any>();

  /* Fetch game assets and set initial game state */
  useEffect(() => {
    const initializeGame = async () => {
      const data = await fetchMatchAndSortGameAssets();
      const numBuckets = data.buckets.length;

      const availableWidth = SCREEN_WIDTH - 2;

      // Adjust bucket width dynamically
      setBucketWidth(availableWidth / numBuckets - 5);

      const bucketSpacing = availableWidth / numBuckets;

      const enrichedBuckets: Bucket[] = data.buckets.map(
        (bucket: Bucket, index: number) => ({
          ...bucket,
          x: index * bucketSpacing + bucketSpacing / 2, // Position each bucket
        }),
      );

      const allItems = [...enrichedBuckets, ...data.falling_objects];
      const svgCache = await fetchSvgCache(allItems);

      setCachedSvgs(svgCache);

      configureByDifficulty(data.difficulty);
      setBuckets(enrichedBuckets);
      setFallingObjects(data.falling_objects);
      setIsLoading(false);
    };

    initializeGame();

    const moveXListener = moveX.addListener(({ value }) => {
      latestMoveX.current = value;
    });

    return () => {
      moveX.removeListener(moveXListener);
    };
  }, []);

  /* Start falling animation when the game stops loading */
  useEffect(() => {
    if (
      !isLoading &&
      fallingObjects.length > 0 &&
      currentIndex < fallingObjects.length
    ) {
      startFalling();
    } else if (
      fallingObjects.length > 0 &&
      currentIndex >= fallingObjects.length
    ) {
      setGameOver(true);
      confettiRef?.current?.start();
    }
  }, [currentIndex, isLoading]);

  /* Fetch and cache SVG images */
  const fetchSvgCache = async (items: { id: string; image_url: string }[]) => {
    const cache: { [key: string]: string } = {};
    await Promise.all(
      items.map(async (item) => {
        const response = await fetch(item.image_url);
        cache[item.id] = await response.text();
      }),
    );
    return cache;
  };

  /* Set falling speed and object size by difficulty */
  const configureByDifficulty = (difficulty: number) => {
    const config: Record<number, { duration: number; size: number }> = {
      1: { duration: 8000, size: 120 },
      2: { duration: 7500, size: 100 },
      3: { duration: 7000, size: 70 },
    };
    const { duration, size } = config[difficulty] || config[1];
    setFallDuration(duration);
    setFallingObjectSize(size);
  };

  /* Start falling animation */
  const startFalling = () => {
    fallAnimation.setValue(0);
    moveX.setValue(0);

    Animated.timing(fallAnimation, {
      toValue: 1,
      duration: fallDuration,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start(() => {
      checkIfCorrect();
    });
  };

  /* Check if the object is dropped in the correct bucket */
  const checkIfCorrect = () => {
    const object = fallingObjects[currentIndex];
    const objectX = SCREEN_WIDTH / 2 + latestMoveX.current;

    let correctBucket = buckets.find((bucket) => {
      const bucketLeft = bucket.x - bucketWidth / 2;
      const bucketRight = bucket.x + bucketWidth / 2;

      return (
        object.target_bucket_id === bucket.id &&
        objectX >= bucketLeft &&
        objectX <= bucketRight
      );
    });

    if (correctBucket) {
      setScore((prevScore) => prevScore + 1);
    }

    setCurrentIndex((prevIndex) => prevIndex + 1);
  };

  /* PanResponder to handle swipe gestures */
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gesture) => {
        moveX.setValue(gesture.dx);
      },
    }),
  ).current;

  const currentObject = fallingObjects[currentIndex];

  return (
    <ImageBackground source={gameBg} style={styles.container}>
      <View style={styles.overlay}></View>
      <GameAppBar title="Match and Sort" instructions={instructions} />
      <ScoreCard score={score} total={fallingObjects.length} />

      {isLoading ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color={theme.colorSummerSky} />
        </View>
      ) : (
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
                <SvgXml
                  xml={cachedSvgs[currentObject.id]}
                  width={fallingObjectSize}
                  height={fallingObjectSize}
                />
              </Animated.View>
            </View>
          )}

          {/* Buckets */}
          <View style={styles.row}>
            {buckets.map((bucket, index) => {
              return (
                <View
                  key={index}
                  style={{
                    position: "absolute",
                    left: bucket.x - bucketWidth / 2,
                  }}
                >
                  <SvgXml
                    xml={cachedSvgs[bucket.id]}
                    width={bucketWidth}
                    height={150}
                  />
                </View>
              );
            })}
          </View>
        </View>
      )}

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
