import axios from "axios";

const API_URL = "http://192.168.1.104:8000/api/";

export const registerUser = async (email: string, password: string) => {
  try {
    const response = await axios.post(
      `${API_URL}auth/register/`,
      {
        email,
        password,
      },
      {
        headers: {
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

export const loginUser = async (email: string, password: string) => {
  try {
    const response = await axios.post(`${API_URL}auth/login/`, {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
