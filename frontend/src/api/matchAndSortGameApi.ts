import { API_URL } from "../constants";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const startMatchAndSortGameSession = async () => {
  try {
    const token = await AsyncStorage.getItem("jwtToken");
    const childId = await AsyncStorage.getItem(`childId-${token}`); // Retrieve stored child ID

    if (!childId) throw new Error("Child ID not found");

    const response = await fetch(
      `${API_URL}children/${childId}/start-session/MATCHSORT/`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log("Match And Sort Session Started:", data);

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

export const fetchMatchAndSortGameAssets = async () => {
  try {
    const token = await AsyncStorage.getItem("jwtToken");
    const childId = await AsyncStorage.getItem(`childId-${token}`); // Retrieve stored child ID

    if (!childId) throw new Error("Child ID not found");

    const difficultyLevel = await startMatchAndSortGameSession(); // Get difficulty level

    const response = await fetch(
      `${API_URL}children/${childId}/match-and-sort/3/`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );

    const data = await response.json();
    console.log("Match And Sort Game Assets:", data);
    return data;
  } catch (error) {
    console.error("Error fetching game assets:", error);
  }
};

export const endMatchAndSortGameSession = async (
  correctAnswers: number,
  incorrectAnswers: number,
) => {
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
      body: JSON.stringify({
        correct_answers: correctAnswers,
        incorrect_answers: incorrectAnswers,
      }),
    });

    const data = await response.json();
    console.log("Match And Sort Session Ended:", data);
    return data;
  } catch (error) {
    console.error("Error ending game session:", error);
  }
};
