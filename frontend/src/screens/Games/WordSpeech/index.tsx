import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  SafeAreaView,
  Dimensions,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import theme from "../../../../theme";
import { styles } from "./index.styles";
import { StackNavigationProp } from "@react-navigation/stack";
import { LevelButtonProps, RootStackParamList } from "../../../types";
import { GameAppBar } from "../../../components";
import { gameInstructions } from "./instructionsData";

const { width, height } = Dimensions.get("window");

const LevelButton: React.FC<LevelButtonProps> = ({
  level,
  onPress,
  isLocked = false,
  style,
}) => {
  return (
    <TouchableOpacity
      style={[styles.levelButton, isLocked && styles.lockedLevel, style]}
      onPress={onPress}
      disabled={isLocked}
    >
      {isLocked ? (
        <MaterialIcons name="lock" size={24} color={theme.colorWhite} />
      ) : (
        <Text style={styles.levelText}>{level}</Text>
      )}
    </TouchableOpacity>
  );
};

const WordSpeechLevelsScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const handleLevelPress = (level: number) => {
    // Navigate to the game screen with the selected level
    navigation.navigate("WordSpeechGame", { level });
  };

  // All levels are now unlocked
  const isLevelLocked = (level: number) => false;

  // Calculate positions for the snake pattern - adjusted to match the image more closely
  // Using absolute positions that work with scrolling
  const levelPositions = [
    { top: height * 0.05, left: width * 0.4 }, // Level 1 (center-top)
    { top: height * 0.17, left: width * 0.6 }, // Level 2 (right)
    { top: height * 0.29, left: width * 0.4 }, // Level 3 (left)
    { top: height * 0.41, left: width * 0.6 }, // Level 4 (right)
    { top: height * 0.53, left: width * 0.4 }, // Level 5 (left)
    { top: height * 0.65, left: width * 0.6 }, // Level 6 (right)
    { top: height * 0.77, left: width * 0.4 }, // Level 7 (center-bottom)
  ];

  // Calculate the total content height to ensure scrolling works properly
  const contentHeight = height; // Make it a bit taller than screen height

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../../../assets/images/background.png")}
        style={styles.backgroundImage}
        imageStyle={styles.backgroundImageStyle}
      >
        <View style={styles.overlay}></View>
        <GameAppBar title="Word Speech" instructions={gameInstructions} />
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.header}>
            <Text style={styles.title}>Let's Begin!</Text>
            <View style={{ width: 30 }} />
          </View>

          <ScrollView
            contentContainerStyle={[
              styles.scrollContent,
              { height: contentHeight },
            ]}
          >
            <View style={styles.levelsContainer}>
              {/* Level buttons */}
              {[1, 2, 3, 4, 5, 6, 7].map((level) => (
                <LevelButton
                  key={level}
                  level={level}
                  onPress={() => handleLevelPress(level)}
                  isLocked={isLevelLocked(level)}
                  style={{
                    position: "absolute",
                    top: levelPositions[level - 1].top,
                    left: levelPositions[level - 1].left,
                    backgroundColor: theme.colorSummerSky,
                    zIndex: 10,
                  }}
                />
              ))}
            </View>
          </ScrollView>
        </SafeAreaView>
      </ImageBackground>
    </View>
  );
};

export default WordSpeechLevelsScreen;
