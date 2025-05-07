import { format } from "date-fns";
import { API_URL } from "../constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchData } from "./childrenApi";

export const startAppSession = async () => {
  await fetchData(); // to get the child data

  const token = await AsyncStorage.getItem("jwtToken");
  const childId = await AsyncStorage.getItem(`childId-${token}`);

  if (!childId) throw new Error("Child ID not found");

  const sessionKey = `sessionStarted-${childId}-${format(new Date(), "yyyy-MM-dd")}`;
  const alreadyStarted = await AsyncStorage.getItem(sessionKey);

  if (!alreadyStarted) {
    try {
      const response = await fetch(
        `${API_URL}children/${childId}/app-usage/start/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      const data = await response.json();

      // 💡 Save sessionKey if response is OK *or* API says session already exists
      if (response.ok || data?.detail?.includes("already exists")) {
        await AsyncStorage.setItem(sessionKey, "true");
        console.log("App session handled:", data);
        return data;
      }

      // Otherwise, treat it as a failure
      throw new Error(`Unexpected error: ${JSON.stringify(data)}`);
    } catch (error) {
      console.error("Error starting app session:", error);
    }
  }
};

export const checkActiveSession = async () => {
  const token = await AsyncStorage.getItem("jwtToken");
  const childId = await AsyncStorage.getItem(`childId-${token}`);

  if (!token || !childId) {
    console.error("Missing token or child ID");
    return null;
  }

  try {
    const response = await fetch(
      `${API_URL}children/${childId}/app-usage/check/`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );

    const data = await response.json();

    if (!response.ok) {
      console.warn("No active session or error checking session:", data);
      return null;
    }

    return data.id;
  } catch (error) {
    console.error("Error checking active session:", error);
    return null;
  }
};

export const endAppSession = async (durationInSeconds: number) => {
  const sessionId = await checkActiveSession();

  if (!sessionId) {
    console.warn("No active session to end");
    return;
  }

  const token = await AsyncStorage.getItem("jwtToken");
  if (!token) {
    console.error("JWT token not found");
    return;
  }

  try {
    const response = await fetch(`${API_URL}app-usage/${sessionId}/end/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ duration: durationInSeconds }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(`Error ending session: ${JSON.stringify(data)}`);
    }

    console.log("App session ended successfully:", data);
    return data;
  } catch (error) {
    console.error("Error in endAppSession:", error);
  }
};
