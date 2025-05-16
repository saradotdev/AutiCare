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
import {
  endMatchAndSortGameSession,
  fetchMatchAndSortGameAssets,
} from "../../../api/matchAndSortGameApi";
import { SvgXml } from "react-native-svg";
import { Bucket, FallingObject } from "../../../types";
import theme from "../../../../theme";
import { getMatchAndSortGameInstructions } from "./instructionsData";
import { Audio } from "expo-av";

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
  const [ageGroup, setAgeGroup] = useState<string | null>(null);
  const [bucketSets, setBucketSets] = useState<any[]>([]);
  const [setIndex, setSetIndex] = useState(0);
  const [gameInstructions, setGameInstructions] = useState<string[]>([]);

  const fallAnimation = useRef(new Animated.Value(0)).current;
  const moveX = useRef(new Animated.Value(0)).current;
  const latestMoveX = useRef(0);
  const confettiRef = useRef<any>();

  const latestScore = useRef(score);
  const totalObjects = useRef(0);

  useEffect(() => {
    latestScore.current = score;
  }, [score]);

  useEffect(() => {
    const initializeGame = async () => {
      const data = await fetchMatchAndSortGameAssets();
      setAgeGroup(data.age_group);

      const instructions = getMatchAndSortGameInstructions(
        data.age_group,
        data.difficulty,
      );
      setGameInstructions(instructions);

      if (data.age_group === "9-12") {
        setBucketSets(data.bucket_sets);

        // Flatten all items from all sets for preloading
        const allItems = data.bucket_sets.flatMap((set: any) => [
          ...set.buckets,
          ...set.falling_objects,
        ]);
        const svgCache = await fetchSvgCache(allItems);
        setCachedSvgs(svgCache);

        const total = data.bucket_sets.reduce(
          (sum: any, set: any) => sum + set.falling_objects.length,
          0,
        );
        totalObjects.current = total;
        loadSet(data.bucket_sets[0], data.difficulty);
      } else {
        const numBuckets = data.buckets.length;
        totalObjects.current = data.falling_objects.length;
        const availableWidth = SCREEN_WIDTH - 2;
        setBucketWidth(availableWidth / numBuckets - 5);
        const bucketSpacing = availableWidth / numBuckets;

        const enrichedBuckets: Bucket[] = data.buckets.map(
          (bucket: Bucket, index: number) => ({
            ...bucket,
            x: index * bucketSpacing + bucketSpacing / 2,
          }),
        );

        const allItems = [...enrichedBuckets, ...data.falling_objects];
        const svgCache = await fetchSvgCache(allItems);

        setCachedSvgs(svgCache);

        configureByDifficulty(data.difficulty);
        setBuckets(enrichedBuckets);
        setFallingObjects(data.falling_objects);
        totalObjects.current = data.falling_objects.length;

        setIsLoading(false);
        playSound("prompt");
      }
    };

    initializeGame();

    const moveXListener = moveX.addListener(({ value }) => {
      latestMoveX.current = value;
    });

    return () => {
      moveX.removeListener(moveXListener);
    };
  }, []);

  useEffect(() => {
    return () => {
      const incorrectAnswers = totalObjects.current - latestScore.current;
      endMatchAndSortGameSession(latestScore.current, incorrectAnswers)
        .then(() => console.log("Game session ended"))
        .catch((err) => console.error("Failed to end session", err));
    };
  }, []);

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
      if (ageGroup === "9-12" && setIndex + 1 < bucketSets.length) {
        // Load next set
        const nextSet = bucketSets[setIndex + 1];
        (async () => {
          await loadSet(nextSet);
          setSetIndex((prev) => prev + 1);
          setCurrentIndex(0);
        })();
      } else {
        setGameOver(true);
        confettiRef?.current?.start();
      }
    }
  }, [currentIndex, isLoading]);

  const loadSet = async (set: any, difficulty?: number) => {
    const numBuckets = set.buckets.length;
    const availableWidth = SCREEN_WIDTH - 2;
    setBucketWidth(availableWidth / numBuckets - 5);
    const bucketSpacing = availableWidth / numBuckets;

    const enrichedBuckets: Bucket[] = set.buckets.map(
      (bucket: Bucket, index: number) => ({
        ...bucket,
        x: index * bucketSpacing + bucketSpacing / 2,
      }),
    );

    if (difficulty) configureByDifficulty(difficulty);
    setBuckets(enrichedBuckets);
    setFallingObjects(set.falling_objects);
    setIsLoading(false);
    playSound("prompt");
  };

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
    fallAnimation.stopAnimation();
    moveX.stopAnimation();

    fallAnimation.setValue(0);
    moveX.setValue(0);
    moveX.setOffset(0);
    latestMoveX.current = 0;
    Animated.timing(fallAnimation, {
      toValue: 1,
      duration: fallDuration,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start(() => {
      moveX.extractOffset();
      moveX.stopAnimation((value) => {
        latestMoveX.current = value;
        checkIfCorrect();
        moveX.setValue(0);
      });
    });
  };

  /* Check if the object is dropped in the correct bucket */
  const checkIfCorrect = () => {
    const object = fallingObjects[currentIndex];
    const objectCenterX = SCREEN_WIDTH / 2 + latestMoveX.current;

    const objectLeft = objectCenterX - fallingObjectSize / 2;
    const objectRight = objectCenterX + fallingObjectSize / 2;

    const targetBucket = buckets.find(
      (bucket) => bucket.id === object.target_bucket_id,
    );

    if (targetBucket) {
      const bucketLeft = targetBucket.x - bucketWidth / 2;
      const bucketRight = targetBucket.x + bucketWidth / 2;

      const isInsideBucket =
        objectRight >= bucketLeft && objectLeft <= bucketRight;

      if (isInsideBucket) {
        setScore((prevScore) => prevScore + 1);
        playSound("correct");
      } else {
        playSound("incorrect");
      }
    }

    setCurrentIndex((prevIndex) => prevIndex + 1);
  };

  /* PanResponder to handle swipe gestures */
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        moveX.setOffset(latestMoveX.current);
        moveX.setValue(0);
      },
      onPanResponderMove: (_, gesture) => {
        moveX.setValue(gesture.dx);
      },
      onPanResponderRelease: () => {
        moveX.flattenOffset();
        moveX.stopAnimation((value) => {
          latestMoveX.current = value;
        });
      },
    }),
  ).current;

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
          : [require("../../../assets/voice commands/Swipe the object.wav")];

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

  const currentObject = fallingObjects[currentIndex];

  return (
    <ImageBackground source={gameBg} style={styles.container}>
      <View style={styles.overlay}></View>
      <GameAppBar title="Match and Sort" instructions={gameInstructions} />
      <ScoreCard score={score} total={totalObjects.current} />

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
            {buckets.map((bucket, index) => (
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
            ))}
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
