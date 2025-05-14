import { API_URL } from "../constants";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const startSocialScenarioGameSession = async () => {
  try {
    const token = await AsyncStorage.getItem("jwtToken");
    const childId = await AsyncStorage.getItem(`childId-${token}`); // Retrieve stored child ID

    if (!childId) throw new Error("Child ID not found");

    const response = await fetch(
      `${API_URL}children/${childId}/start-session/SOCIAL/`,
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
    console.log("Social Scenario Session Started:", data);

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

export const fetchSocialScenarios = async () => {
  try {
    const token = await AsyncStorage.getItem("jwtToken");
    const childId = await AsyncStorage.getItem(`childId-${token}`); // Retrieve stored child ID

    if (!childId) throw new Error("Child ID not found");

    const difficultyLevel = await startSocialScenarioGameSession(); // Get difficulty level

    const response = await fetch(
      `${API_URL}children/${childId}/social-scenario-batch/${difficultyLevel}/3/`, // Fetch 3 scenarios
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );

    const data = await response.json();
    console.log("Social Scenarios Found:", data.session_created);
    return data;
  } catch (error) {
    console.error("Error fetching social scenarios:", error);
  }
};

export const endSocialScenarioGameSession = async (
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
    console.log("Social Scenario Game Session Ended:", data);
    return data;
  } catch (error) {
    console.error("Error ending game session:", error);
  }
};
