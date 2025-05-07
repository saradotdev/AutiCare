import { useEffect, useRef } from "react";
import { AppState, AppStateStatus } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { format } from "date-fns";

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

  const startTimer = () => {
    if (intervalRef.current) return;

    intervalRef.current = setInterval(() => {
      saveSessionTime(10); // save 10 seconds every time
    }, 10000);

    console.log("▶️ Timer started");
  };

  const stopTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      console.log("⏹️ Timer stopped");
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
