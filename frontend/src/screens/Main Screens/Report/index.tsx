import React, { useCallback, useState } from "react";
import { FlatList, View } from "react-native";
import { MyButton, MyText } from "../../../components";
import { useTimeLimit } from "../../../context";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../../types";
import { StackNavigationProp } from "@react-navigation/stack";
import { FontAwesome } from "@expo/vector-icons";
import theme from "../../../../theme";
import { styles } from "./index.styles";

const DURATION_STATS = [
  {
    id: "1",
    title: "Session Duration",
    value: "10",
    cardBg: theme.colorLightOrange,
    textBg: theme.colorDarkOrange,
  },
  {
    id: "2",
    title: "Usage Limit",
    value: "10",
    cardBg: theme.colorSummerSky,
    textBg: theme.colorDarkSummerSky,
  },
];

const GAME_STATS = [
  {
    id: "1",
    title: "Guess the Expression",
    difficulty: "2",
    score: "93",
    cardBg: theme.colorBlue,
    textBg: theme.colorDarkBlue,
  },
  {
    id: "2",
    title: "Match and Sort",
    difficulty: "1",
    score: "85",
    cardBg: theme.colorCoralRed,
    textBg: theme.colorDarkCoralRed,
  },
  {
    id: "3",
    title: "Social Scenario",
    difficulty: "3",
    score: "78",
    cardBg: theme.colorLime,
    textBg: theme.colorDarkLime,
  },
  {
    id: "4",
    title: "Word Speech",
    difficulty: "2",
    score: "90",
    cardBg: theme.colorCyan,
    textBg: theme.colorDarkCyan,
  },
];

export default function Report() {
  const [isTimeExceeded, setIsTimeExceeded] = useState(false);
  const { checkIfTimeExceeded } = useTimeLimit();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  useFocusEffect(
    useCallback(() => {
      const loadData = async () => {
        const timeExceeded = await checkIfTimeExceeded();
        setIsTimeExceeded(timeExceeded);
      };

      loadData();
    }, [checkIfTimeExceeded]),
  );

  return (
    <View style={{ flex: 1 }}>
      {/* Header */}
      <View style={styles.header}>
        <MyText style={styles.title}>Report</MyText>

        {/* Lock the button when time is exceeded */}
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
        data={GAME_STATS}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
        ListHeaderComponent={
          <>
            {/* Duration Stats */}
            <View style={styles.durationStatsContainer}>
              {DURATION_STATS.map((item) => (
                <View
                  key={item.id}
                  style={[
                    styles.durationCard,
                    { backgroundColor: item.cardBg },
                  ]}
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
          </>
        }
        renderItem={({ item }) => (
          /* Game Stats */
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
