import React, { useCallback, useState } from "react";
import { Dimensions, FlatList, View } from "react-native";
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
  },
  {
    id: "2",
    title: "Usage Limit",
    value: "10",
  },
];

const GAME_STATS = [
  {
    id: "1",
    title: "Guess the Expression",
    difficulty: "2",
    score: "93",
  },
  {
    id: "2",
    title: "Match and Sort",
    difficulty: "1",
    score: "85",
  },
  {
    id: "3",
    title: "Social Scenario",
    difficulty: "3",
    score: "78",
  },
];

export default function Report() {
  const [isTimeExceeded, setIsTimeExceeded] = useState<boolean>(false);
  const { checkIfTimeExceeded } = useTimeLimit(); // using the context to get the time limit status

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
    <View>
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

      <View style={styles.container}>
        <View style={styles.durationStatsContainer}>
          {DURATION_STATS.map((item) => (
            <View key={item.id} style={[styles.durationCard]}>
              <MyText style={styles.durationTitle}>{item.title}</MyText>
              <View style={styles.durationValueContainer}>
                <MyText style={styles.durationValue}>
                  {item.value} Minutes
                </MyText>
              </View>
            </View>
          ))}
        </View>

        <FlatList
          data={GAME_STATS}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.gameStatsCard}>
              <MyText style={styles.gameTitle}>{item.title}</MyText>
              <View>
                <MyText>Difficulty Level</MyText>
                <MyText>Level {item.difficulty}</MyText>
              </View>
              <View>
                <MyText>Overall Score</MyText>
                <MyText>{item.score}%</MyText>
              </View>
            </View>
          )}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  );
}
