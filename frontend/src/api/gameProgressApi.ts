import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { API_URL } from "../constants";

export const fetchGameProgressData = async (gameCode: string) => {
  try {
    const token = await AsyncStorage.getItem("jwtToken");
    const childId = await AsyncStorage.getItem(`childId-${token}`);

    if (!childId) throw new Error("Child ID not found");

    const response = await axios.get(
      `${API_URL}children/${childId}/progress/${gameCode}/`,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    return response.data;
  } catch (error) {
    console.error("Failed to fetch game progress:", error);
    throw error;
  }
};
