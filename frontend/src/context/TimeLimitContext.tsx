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

  const getSessionKeyForChild = async (): Promise<string> => {
    const token = await AsyncStorage.getItem("jwtToken");
    const childId = await AsyncStorage.getItem(`childId-${token}`);
    const dateStr = format(new Date(), "yyyy-MM-dd");
    return `sessionTime-${childId}-${dateStr}`;
  };

  const getPracticeKeyForChild = async (): Promise<string> => {
    const token = await AsyncStorage.getItem("jwtToken");
    const childId = await AsyncStorage.getItem(`childId-${token}`);
    return `timeOfPractice-${childId}`;
  };

  const checkTimeLimit = async (): Promise<boolean> => {
    const sessionKey = await getSessionKeyForChild();
    const practiceKey = await getPracticeKeyForChild();

    const timeSpentSeconds = parseInt(
      (await AsyncStorage.getItem(sessionKey)) || "0",
    );
    const practiceLimitMinutes = parseInt(
      (await AsyncStorage.getItem(practiceKey)) || "0",
    );

    const timeSpentMinutes = timeSpentSeconds / 60;
    const exceeded =
      timeSpentMinutes >= practiceLimitMinutes && practiceLimitMinutes > 0;

    setIsTimeExceeded(exceeded);
    return exceeded;
  };

  const checkIfTimeExceeded = async (): Promise<boolean> => {
    const sessionKey = await getSessionKeyForChild();
    const practiceKey = await getPracticeKeyForChild();

    const timeSpentSeconds = parseInt(
      (await AsyncStorage.getItem(sessionKey)) || "0",
    );
    const practiceLimitMinutes = parseInt(
      (await AsyncStorage.getItem(practiceKey)) || "0",
    );

    const timeSpentMinutes = timeSpentSeconds / 60;
    return timeSpentMinutes >= practiceLimitMinutes && practiceLimitMinutes > 0;
  };

  useEffect(() => {
    checkTimeLimit(); // initial check
    const interval = setInterval(checkTimeLimit, 30000); // update every 30 seconds
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
