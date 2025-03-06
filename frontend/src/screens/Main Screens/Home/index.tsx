import React, { useEffect, useState } from "react";
import {
  View,
  ActivityIndicator,
  ImageBackground,
  FlatList,
} from "react-native";
import { styles } from "./index.styles";
import { fetchData } from "../../../api/childrenApi";
import theme from "../../../../theme";
import { GameCard, MyButton, MyText } from "../../../components";
import Ionicons from "@expo/vector-icons/Ionicons";
import { GameCard1, GameCard2 } from "../../../assets";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../../types/navigation";
import { StackNavigationProp } from "@react-navigation/stack";
import { Game } from "../../../types";

const homeBg = require("../../../assets/images/HomeBackground.png");

const GAMES: Game[] = [
  {
    id: "1",
    title: "Guess the expression",
    color: theme.colorSummerSky,
    Image: () => <GameCard1 />,
    screen: "GuessExpression",
  },
  {
    id: "2",
    title: "Match and Sort",
    color: theme.colorBlue,
    Image: () => <GameCard2 />,
    screen: "MatchAndSort",
  },
];

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<Game[]>([]);
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await fetchData();
        console.log(response);
        setData(GAMES);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, []);

  return (
    <ImageBackground source={homeBg} style={styles.container}>
      <MyButton
        textColor={theme.colorWhite}
        style={styles.changeTab}
        icon={<Ionicons name="person" size={24} color="white" />}
      >
        <MyText>Guardian</MyText>
      </MyButton>

      <FlatList
        data={loading ? [] : data} // Pass empty array while loading
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <GameCard
            title={item.title}
            color={item.color}
            Image={item.Image}
            onPress={() => navigation.navigate(item.screen as never)}
          />
        )}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          loading ? (
            <View style={styles.loader}>
              <ActivityIndicator size="large" color={theme.colorSummerSky} />
            </View>
          ) : null
        }
      />
    </ImageBackground>
  );
}
