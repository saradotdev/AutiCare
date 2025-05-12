import { useEffect, useRef } from "react";
import { AppState, AppStateStatus } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { format } from "date-fns";
import { endAppSession, startAppSession } from "../api/appSessionApi";

export default function useSessionTracker() {
  const appState = useRef<AppStateStatus>(AppState.currentState);
  const intervalRef = useRef<any>(null);

  const saveSessionTime = async (duration: number) => {
    const token = await AsyncStorage.getItem("jwtToken");
    const childId = await AsyncStorage.getItem(`childId-${token}`);
    if (!childId) return;

    const todayKey = `sessionTime-${childId}-${format(new Date(), "yyyy-MM-dd")}`;
    const existing = await AsyncStorage.getItem(todayKey);
    const updated = (existing ? parseInt(existing) : 0) + duration;
    await AsyncStorage.setItem(todayKey, updated.toString());
    console.log(`🕒 [${childId}] Saved ${duration}s -> total now ${updated}s`);
  };

  const startTimer = async () => {
    if (intervalRef.current) return;

    intervalRef.current = setInterval(() => {
      saveSessionTime(10); // save 10 seconds every time
    }, 10000);

    console.log("▶️ Timer started");

    await startAppSession();
  };

  const stopTimer = async () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      console.log("⏹️ Timer stopped");

      const token = await AsyncStorage.getItem("jwtToken");
      const childId = await AsyncStorage.getItem(`childId-${token}`);
      if (!childId) return;

      const todayKey = `sessionTime-${childId}-${format(new Date(), "yyyy-MM-dd")}`;
      const storedDuration = await AsyncStorage.getItem(todayKey);
      const totalDuration = storedDuration ? parseInt(storedDuration) : 0;
      const durationInMinutes = Math.floor(totalDuration / 60); // convert seconds to minutes

      const timeOfPractice = await AsyncStorage.getItem(
        `timeOfPractice-${childId}`,
      );
      if (!timeOfPractice) return;
      const limitCrossed = durationInMinutes >= parseInt(timeOfPractice);

      await endAppSession(durationInMinutes, limitCrossed);
      console.log(
        `🕒 [${childId}] Session ended, total time: ${durationInMinutes} minutes `,
      );
    }
  };

  const handleAppStateChange = (nextAppState: AppStateStatus) => {
    const wasActive = appState.current === "active";
    const nowActive = nextAppState === "active";

    if (nowActive && !wasActive) {
      startTimer();
    } else if (!nowActive && wasActive) {
      stopTimer();
    }

    appState.current = nextAppState;
  };

  useEffect(() => {
    if (appState.current === "active") {
      startTimer();
    }

    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange,
    );
    return () => {
      stopTimer();
      subscription.remove();
    };
  }, []);

  return { stopTimer };
}
