import React, { useCallback, useEffect, useState } from "react";
import { FlatList, View } from "react-native";
import { MyButton, MyText } from "../../../components";
import { useTimeLimit } from "../../../context";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../../types";
import { StackNavigationProp } from "@react-navigation/stack";
import { FontAwesome } from "@expo/vector-icons";
import theme from "../../../../theme";
import { styles } from "./index.styles";
import { fetchGameProgressData } from "../../../api/gameProgressApi";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { format } from "date-fns";

// Map game codes to display properties
const GAME_DEFINITIONS = [
  {
    gameCode: "FACIAL",
    title: "Guess the Expression",
    cardBg: theme.colorBlue,
    textBg: theme.colorDarkBlue,
  },
  {
    gameCode: "MATCHSORT",
    title: "Match and Sort",
    cardBg: theme.colorCoralRed,
    textBg: theme.colorDarkCoralRed,
  },
  {
    gameCode: "SOCIAL",
    title: "Social Scenario",
    cardBg: theme.colorLime,
    textBg: theme.colorDarkLime,
  },
  // {
  //   gameCode: "WORD",
  //   title: "Word Speech",
  //   cardBg: theme.colorCyan,
  //   textBg: theme.colorDarkCyan,
  // },
];

export default function Report() {
  const [isTimeExceeded, setIsTimeExceeded] = useState(false);
  const [gameStats, setGameStats] = useState<any[]>([]);
  const [timeSpent, setTimeSpent] = useState<number>(0);
  const [practiceTime, setPracticeTime] = useState<number>(0);

  const { checkIfTimeExceeded } = useTimeLimit();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  useFocusEffect(
    useCallback(() => {
      const loadData = async () => {
        const timeExceeded = await checkIfTimeExceeded();
        setIsTimeExceeded(timeExceeded);

        const token = await AsyncStorage.getItem("jwtToken");
        const childId = await AsyncStorage.getItem(`childId-${token}`);
        if (!childId) return;

        const todayKey = `sessionTime-${childId}-${format(new Date(), "yyyy-MM-dd")}`;
        const practiceKey = `timeOfPractice-${childId}`;

        const storedPracticeTime = await AsyncStorage.getItem(practiceKey);
        const storedTimeSpent = await AsyncStorage.getItem(todayKey);

        const parsedPracticeTime = storedPracticeTime
          ? parseInt(storedPracticeTime)
          : 0;
        const parsedTimeSpent = storedTimeSpent ? parseInt(storedTimeSpent) : 0;

        const timeSpentInMinutes = Math.floor(parsedTimeSpent / 60);

        setPracticeTime(parsedPracticeTime);
        setTimeSpent(timeSpentInMinutes);
      };
      loadData();
    }, [checkIfTimeExceeded]),
  );

  useEffect(() => {
    const loadProgressData = async () => {
      try {
        const allStats = await Promise.all(
          GAME_DEFINITIONS.map(async (game) => {
            const data = await fetchGameProgressData(game.gameCode);
            return {
              ...game,
              difficulty: data?.current_difficulty ?? "N/A",
              score: data?.score_percentage?.toFixed(0) ?? "N/A",
            };
          }),
        );
        setGameStats(allStats);
      } catch (err) {
        console.error("Error loading progress data", err);
      }
    };

    loadProgressData();
  }, []);

  const dynamicDurationStats = [
    {
      id: "1",
      title: "Session Duration",
      value: timeSpent.toString(),
      cardBg: theme.colorLightOrange,
      textBg: theme.colorDarkOrange,
    },
    {
      id: "2",
      title: "Usage Limit",
      value: practiceTime.toString(),
      cardBg: theme.colorSummerSky,
      textBg: theme.colorDarkSummerSky,
    },
  ];

  return (
    <View style={{ flex: 1 }}>
      {/* Header */}
      <View style={styles.header}>
        <MyText style={styles.title}>Report</MyText>

        {isTimeExceeded ? (
          <MyButton
            textColor={theme.colorWhite}
            style={styles.changeTab}
            icon={<FontAwesome name="lock" size={24} color="white" />}
            onPress={() => {}}
            disabled
          >
            Child
          </MyButton>
        ) : (
          <MyButton
            textColor={theme.colorWhite}
            style={styles.changeTab}
            icon={<FontAwesome name="child" size={24} color="white" />}
            onPress={() => {
              navigation.reset({ index: 0, routes: [{ name: "Home" }] });
            }}
          >
            Child
          </MyButton>
        )}
      </View>

      <FlatList
        data={gameStats}
        keyExtractor={(item) => item.gameCode}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
        ListHeaderComponent={
          <View style={styles.durationStatsContainer}>
            {dynamicDurationStats.map((item) => (
              <View
                key={item.id}
                style={[styles.durationCard, { backgroundColor: item.cardBg }]}
              >
                <MyText style={styles.text}>{item.title}</MyText>
                <MyText
                  style={[
                    styles.textBackground,
                    { backgroundColor: item.textBg },
                  ]}
                >
                  {item.value} Minutes
                </MyText>
              </View>
            ))}
          </View>
        }
        renderItem={({ item }) => (
          <View
            style={[styles.gameStatsCard, { backgroundColor: item.cardBg }]}
          >
            <MyText
              style={[styles.textBackground, { backgroundColor: item.textBg }]}
            >
              {item.title}
            </MyText>
            <View style={styles.row}>
              <MyText style={styles.subText}>Difficulty Level</MyText>
              <MyText
                style={[
                  styles.subTextBackground,
                  { backgroundColor: item.textBg },
                ]}
              >
                Level {item.difficulty}
              </MyText>
            </View>
            <View style={styles.row}>
              <MyText style={styles.subText}>Overall Score</MyText>
              <MyText
                style={[
                  styles.subTextBackground,
                  { backgroundColor: item.textBg },
                ]}
              >
                {item.score}%
              </MyText>
            </View>
          </View>
        )}
      />
    </View>
  );
}
