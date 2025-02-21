import React, { useEffect, useState } from "react";
import { View, ActivityIndicator, ImageBackground } from "react-native";
import { styles } from "./index.styles";
import { fetchData } from "../../../api/childrenApi";
import theme from "../../../../theme";
import { MyButton, MyText } from "../../../components";
import Ionicons from "@expo/vector-icons/Ionicons";

const homeBg = require("../../../assets/images/HomeBackground.png");

export default function Home() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await fetchData();
        console.log(response);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, []);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={theme.colorSummerSky} />
      </View>
    );
  }

  return (
    <ImageBackground source={homeBg} style={styles.container}>
      <MyButton
        textColor={theme.colorWhite}
        style={styles.changeTab}
        icon={<Ionicons name="person" size={24} color="white" />}
      >
        <MyText>Guardian</MyText>
      </MyButton>
    </ImageBackground>
  );
}
