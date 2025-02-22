import axios from "axios";
import { API_URL } from "../constants";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const registerUser = async (email: string, password: string) => {
  try {
    const response = await axios.post(`${API_URL}auth/register/`, {
      email,
      password,
    });

    // logging in user after registration to generate token
    await loginUser(email, password);

    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const loginUser = async (email: string, password: string) => {
  try {
    const response = await axios.post(`${API_URL}auth/login/`, {
      email,
      password,
    });

    const token = response.data.access; // JWT access token from backend
    await AsyncStorage.setItem("jwtToken", token); // storing token in storage

    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
