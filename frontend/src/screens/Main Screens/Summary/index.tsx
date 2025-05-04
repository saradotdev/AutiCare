import React, { useEffect, useState } from "react";
import { View } from "react-native";
import theme from "../../../../theme";
import { MyButton, MyText } from "../../../components";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../../types";
import { StackNavigationProp } from "@react-navigation/stack";
import { format } from "date-fns";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { styles } from "./index.styles";

// Current date
const today = new Date();
const formattedDate = format(today, "MMMM do");

export default function Guardian() {
  const [practiceTime, setPracticeTime] = useState<number>(0);
  const [timeSpent, setTimeSpent] = useState<number>(0);
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [isTimeExceeded, setIsTimeExceeded] = useState<boolean>(false);

  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    const loadPracticeTimeAndTimeSpent = async () => {
      const [storedPracticeTime, storedTimeSpent] = await Promise.all([
        AsyncStorage.getItem("timeOfPractice"),
        getTimeSpentToday(),
      ]);

      const parsedPracticeTime = storedPracticeTime
        ? parseInt(storedPracticeTime)
        : 0;
      const formattedTimeSpent = Math.floor((storedTimeSpent || 0) / 60);

      setPracticeTime(parsedPracticeTime);
      setTimeSpent(formattedTimeSpent);

      if (parsedPracticeTime > 0) {
        const percent = (formattedTimeSpent / parsedPracticeTime) * 100;
        setProgressPercent(percent);
      }

      setIsTimeExceeded(formattedTimeSpent >= parsedPracticeTime);
    };

    loadPracticeTimeAndTimeSpent(); // Load immediately

    const intervalId = setInterval(() => {
      loadPracticeTimeAndTimeSpent();
    }, 30000);

    return () => clearInterval(intervalId);
  }, []);

  // Get the time spent today from AsyncStorage
  const getTimeSpentToday = async (): Promise<number> => {
    const todayKey = `sessionTime-${format(new Date(), "yyyy-MM-dd")}`;
    const time = await AsyncStorage.getItem(todayKey);
    return time ? parseInt(time) : 0;
  };

  return (
    <View>
      {/* Header */}
      <View style={styles.header}>
        <MyText style={styles.title}>Summary</MyText>

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
              navigation.navigate("Home");
            }}
          >
            Child
          </MyButton>
        )}
      </View>

      <View style={styles.content}>
        {/* Date */}
        <View>
          <MyText style={styles.today}>Today</MyText>
          <MyText style={styles.date}>{formattedDate}</MyText>
        </View>

        {/* Session Time */}
        <View style={styles.sessionContainer}>
          <MyText style={styles.sessionTime}>
            {timeSpent}/{practiceTime}
          </MyText>
          <MyText style={styles.sessionText}>Minutes played</MyText>

          <View style={styles.progressBar}>
            <View
              style={[styles.progressFill, { width: `${progressPercent}%` }]}
            />
          </View>
        </View>
      </View>
    </View>
  );
}
