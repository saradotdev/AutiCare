import { API_URL } from "../constants";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const startFacialExpressionsSession = async () => {
  try {
    const token = await AsyncStorage.getItem("jwtToken");
    const childId = await AsyncStorage.getItem(`childId-${token}`); // Retrieve stored child ID

    if (!childId) throw new Error("Child ID not found");

    const response = await fetch(
      `${API_URL}children/${childId}/start-session/FACIAL/`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );

    const data = await response.json();
    console.log("Facial Expressions Session Started:", data);

    const gameSessionId = data.session_id;
    await AsyncStorage.setItem(
      `gameSessionId-${childId}`,
      String(gameSessionId),
    ); // storing gameSessionId in storage

    return data.difficulty_level; // Return the difficulty level
  } catch (error) {
    console.error("Error starting game session:", error);
  }
};

export const fetchFacialExpressions = async () => {
  try {
    const token = await AsyncStorage.getItem("jwtToken");
    const childId = await AsyncStorage.getItem(`childId-${token}`); // Retrieve stored child ID

    if (!childId) throw new Error("Child ID not found");

    const difficultyLevel = await startFacialExpressionsSession(); // Get difficulty level

    const response = await fetch(
      `${API_URL}children/${childId}/facial-expressions/${difficultyLevel}/`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );

    const data = await response.json();
    console.log("Facial Expressions:", data);
    return data;
  } catch (error) {
    console.error("Error fetching facial expressions:", error);
  }
};

export const endFacialExpressionsSession = async () => {
  try {
    const token = await AsyncStorage.getItem("jwtToken");
    const childId = await AsyncStorage.getItem(`childId-${token}`); // Retrieve stored child ID
    const gameSessionId = await AsyncStorage.getItem(
      `gameSessionId-${childId}`,
    ); // Retrieve stored game session ID

    if (!childId) throw new Error("Child ID not found");

    const response = await fetch(`${API_URL}sessions/${gameSessionId}/end/`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    console.log("Facial Expressions Game Session Started:", data);
    return data;
  } catch (error) {
    console.error("Error starting game session:", error);
  }
};
