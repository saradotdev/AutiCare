import { API_URL } from "../constants";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const fetchMatchAndSortGameAssets = async () => {
  try {
    const token = await AsyncStorage.getItem("jwtToken");
    const childId = await AsyncStorage.getItem("childId"); // Retrieve stored child ID

    if (!childId) throw new Error("Child ID not found");

    const response = await fetch(
      `${API_URL}children/${childId}/match-and-sort`,
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
