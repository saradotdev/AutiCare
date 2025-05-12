import React, { useCallback, useState } from "react";
import { View } from "react-native";
import theme from "../../../../theme";
import { MyButton, MyText } from "../../../components";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../../types";
import { StackNavigationProp } from "@react-navigation/stack";
import { format } from "date-fns";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { styles } from "./index.styles";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useTimeLimit } from "../../../context";

const formattedDate = format(new Date(), "MMMM do");

export default function Summary() {
  const [practiceTime, setPracticeTime] = useState<number>(0);
  const [timeSpent, setTimeSpent] = useState<number>(0);
  const [progressPercent, setProgressPercent] = useState<number>(0);

  const [isTimeExceeded, setIsTimeExceeded] = useState(false);
  const { checkIfTimeExceeded } = useTimeLimit(); // using the context to get the time limit status

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

        if (parsedPracticeTime > 0) {
          const percent = (timeSpentInMinutes / parsedPracticeTime) * 100;
          setProgressPercent(percent);
        }
      };

      loadData();
    }, [checkIfTimeExceeded]),
  );

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
              navigation.reset({ index: 0, routes: [{ name: "Home" }] });
            }}
          >
            Child
          </MyButton>
        )}
      </View>

      <View style={styles.summaryContainer}>
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

      <View style={styles.reportContainer}>
        <MyText style={styles.reportTitle}>Report</MyText>
        <View style={styles.infoContainer}>
          <Ionicons
            name="information"
            size={24}
            color="white"
            style={styles.infoIcon}
          />
          <MyText style={styles.infoText}>
            Today, {timeSpent} minutes were played
          </MyText>
        </View>
        <MyButton
          textColor={theme.colorWhite}
          style={styles.cta}
          onPress={() => {
            navigation.navigate("Report");
          }}
        >
          See Detailed Report
        </MyButton>
      </View>
    </View>
  );
}
