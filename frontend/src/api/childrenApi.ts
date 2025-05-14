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

    // Extract child_id from API response and store it for later use
    const childId = response.data.id;
    await AsyncStorage.setItem(`childId-${token}`, childId.toString());

    console.log("Child created with ID:", childId);
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

    const children = response.data;

    if (children.length > 0) {
      const childId = children[0].id; // Selecting the first child profile for now
      await AsyncStorage.setItem(`childId-${token}`, childId.toString());

      // Extract time_of_practice from API response and store it for later use
      const timeOfPractice = children[0].time_of_practice;
      await AsyncStorage.setItem(
        `timeOfPractice-${childId}`,
        timeOfPractice.toString(),
      );

      console.log("Child ID stored:", childId);
      console.log("Time of practice stored:", timeOfPractice);
    } else {
      console.warn("No child profiles found for this user.");
    }

    return children;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
