import React, { useEffect, useState } from "react";
import {
  View,
  ActivityIndicator,
  ImageBackground,
  FlatList,
  Modal,
  TouchableOpacity,
} from "react-native";
import { styles } from "./index.styles";
import { fetchData } from "../../../api/childrenApi";
import theme from "../../../../theme";
import { GameCard, MyButton, MyText } from "../../../components";
import Ionicons from "@expo/vector-icons/Ionicons";
import { GameCard1, GameCard2 } from "../../../assets";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../../types";
import { StackNavigationProp } from "@react-navigation/stack";
import { Game } from "../../../types";
import Entypo from "@expo/vector-icons/Entypo";
import { useBackgroundMusic, useSessionTracker } from "../../../hooks";

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
  {
    id: "3",
    title: "Social Scenario",
    color: theme.colorCoralRed,
    Image: () => <GameCard1 />,
    screen: "SocialScenario",
  },
  {
    id: "4",
    title: "Word Speech",
    color: theme.colorOrangeRed,
    Image: () => <GameCard2 />,
    screen: "WordSpeech",
  },
];

const keys = [
  ["1", "2", "3"],
  ["4", "5", "6"],
  ["7", "8", "9"],
  ["", "0", "⌫"],
];

export default function Home() {
  const { stopTimer } = useSessionTracker(); // start session tracking

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<Game[]>([]);

  const [modalVisible, setModalVisible] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const { playMusic } = useBackgroundMusic();

  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    playMusic();

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

  useEffect(() => {
    if (pinInput.length === 4 && pinInput === generatedCode) {
      setTimeout(() => {
        setModalVisible(false);
        setPinInput("");
        stopTimer(); // stop session tracking before navigating to Guardian
        navigation.reset({ index: 0, routes: [{ name: "Guardian" }] });
      }, 300);
    }
  }, [pinInput]);

  const numberToWords = (numStr: string) => {
    const digitWords = [
      "ZERO",
      "ONE",
      "TWO",
      "THREE",
      "FOUR",
      "FIVE",
      "SIX",
      "SEVEN",
      "EIGHT",
      "NINE",
    ];
    return numStr
      .split("")
      .map((d) => digitWords[parseInt(d)])
      .join(", ");
  };

  const handleKeyPress = (key: string) => {
    if (key === "⌫") {
      setPinInput((prev) => prev.slice(0, -1));
    } else if (key !== "") {
      if (pinInput.length < 4) {
        setPinInput((prev) => prev + key);
      }
    }
  };

  return (
    <ImageBackground source={homeBg} style={styles.container}>
      <MyButton
        textColor={theme.colorWhite}
        style={styles.changeTab}
        icon={<Ionicons name="person" size={24} color="white" />}
        onPress={() => {
          const random = Math.floor(1000 + Math.random() * 9000).toString();
          setGeneratedCode(random);
          setPinInput("");
          setModalVisible(true);
        }}
      >
        <MyText>Guardian</MyText>
      </MyButton>

      {loading ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color={theme.colorSummerSky} />
        </View>
      ) : (
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
        />
      )}

      <Modal transparent visible={modalVisible} animationType="slide">
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <TouchableOpacity
              hitSlop={20}
              style={styles.modalCloseButton}
              onPress={() => setModalVisible(false)}
            >
              <Entypo name="cross" size={24} color="white" />
            </TouchableOpacity>
            <MyText style={styles.modalTitle}>Grown-Ups Only</MyText>
            <MyText style={styles.modalText}>
              We need to make sure that you are a grown-up
            </MyText>
            <MyText style={styles.modalSubText}>
              To access, please enter the code
            </MyText>
            <MyText style={styles.code}>{numberToWords(generatedCode)}</MyText>
            <MyText style={styles.input}>{pinInput}</MyText>

            {/* Number Pad */}
            <View style={styles.keypadContainer}>
              {keys.map((row, rowIndex) => (
                <View key={rowIndex} style={styles.row}>
                  {row.map((key) => (
                    <TouchableOpacity
                      activeOpacity={0.8}
                      hitSlop={20}
                      key={key}
                      style={styles.key}
                      onPress={() => handleKeyPress(key)}
                      disabled={key === ""}
                    >
                      <MyText style={styles.keyText}>{key}</MyText>
                    </TouchableOpacity>
                  ))}
                </View>
              ))}
            </View>
          </View>
        </View>
      </Modal>
    </ImageBackground>
  );
}
