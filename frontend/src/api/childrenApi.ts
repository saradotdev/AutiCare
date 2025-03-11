import axios from "axios";
import { API_URL } from "../constants";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const createChild = async (
  age: string,
  gender: string,
  speechLevel: string,
  timeOfPractice: number,
) => {
  try {
    const token = await AsyncStorage.getItem("jwtToken");

    const response = await axios.post(
      `${API_URL}children/`,
      {
        age: age,
        gender: gender,
        speech_level: speechLevel,
        time_of_practice: timeOfPractice,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );

    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const fetchData = async () => {
  try {
    const token = await AsyncStorage.getItem("jwtToken");

    const response = await axios.get(`${API_URL}children/`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
