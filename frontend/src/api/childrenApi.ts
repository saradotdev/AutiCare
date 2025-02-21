import axios from "axios";
import { API_URL } from "../constants";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
