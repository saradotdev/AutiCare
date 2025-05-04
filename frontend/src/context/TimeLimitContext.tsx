import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { format } from "date-fns";

interface TimeLimitContextType {
  isTimeExceeded: boolean;
  refreshTimeStatus: () => void;
  checkIfTimeExceeded: () => Promise<boolean>;
}

const TimeLimitContext = createContext<TimeLimitContextType>({
  isTimeExceeded: false,
  refreshTimeStatus: () => {},
  checkIfTimeExceeded: async () => false,
});

export const TimeLimitProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isTimeExceeded, setIsTimeExceeded] = useState(false);

  const checkTimeLimit = async () => {
    const practiceTime = parseInt(
      (await AsyncStorage.getItem("timeOfPractice")) || "0",
    );
    const todayKey = `sessionTime-${format(new Date(), "yyyy-MM-dd")}`;
    const timeSpent =
      parseInt((await AsyncStorage.getItem(todayKey)) || "0") / 60;

    const exceeded = timeSpent >= practiceTime && practiceTime > 0;
    setIsTimeExceeded(exceeded);
    return exceeded;
  };

  const checkIfTimeExceeded = async () => {
    const practiceTime = parseInt(
      (await AsyncStorage.getItem("timeOfPractice")) || "0",
    );
    const todayKey = `sessionTime-${format(new Date(), "yyyy-MM-dd")}`;
    const timeSpent =
      parseInt((await AsyncStorage.getItem(todayKey)) || "0") / 60;

    return timeSpent >= practiceTime && practiceTime > 0;
  };

  useEffect(() => {
    checkTimeLimit();
    const interval = setInterval(checkTimeLimit, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <TimeLimitContext.Provider
      value={{
        isTimeExceeded,
        refreshTimeStatus: checkTimeLimit,
        checkIfTimeExceeded,
      }}
    >
      {children}
    </TimeLimitContext.Provider>
  );
};

export const useTimeLimit = () => useContext(TimeLimitContext);
