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
import Svg, { Path } from "react-native-svg";
import { StackNavigationProp } from "@react-navigation/stack";
import { LevelButtonProps, RootStackParamList } from "../../../types";

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

  const goBack = () => {
    navigation.goBack();
  };

  // All levels are now unlocked
  const isLevelLocked = (level: number) => false;

  // Calculate positions for the snake pattern - adjusted to match the image more closely
  // Using absolute positions that work with scrolling
  const levelPositions = [
    { top: height * 0.15, left: width * 0.45 }, // Level 1 (center-top)
    { top: height * 0.25, left: width * 0.7 }, // Level 2 (right)
    { top: height * 0.35, left: width * 0.25 }, // Level 3 (left)
    { top: height * 0.47, left: width * 0.55 }, // Level 4 (right)
    { top: height * 0.59, left: width * 0.35 }, // Level 5 (left)
    { top: height * 0.71, left: width * 0.65 }, // Level 6 (right)
    { top: height * 0.83, left: width * 0.45 }, // Level 7 (center-bottom)
  ];

  // Calculate the total content height to ensure scrolling works properly
  const contentHeight = height * 1.1; // Make it a bit taller than screen height

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../../../assets/images/background.png")}
        style={styles.backgroundImage}
        imageStyle={styles.backgroundImageStyle}
      >
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.header}>
            <TouchableOpacity onPress={goBack} style={styles.backButton}>
              <MaterialIcons
                name="arrow-back"
                size={24}
                color={theme.colorSummerSky}
              />
            </TouchableOpacity>
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
              {/* SVG Path connecting the level buttons */}
              <Svg
                height={contentHeight}
                width="100%"
                style={styles.pathContainer}
              >
                <Path
                  d={`M ${width * 0.45} ${height * 0.18} 
                      C ${width * 0.6} ${height * 0.2}, ${width * 0.65} ${height * 0.22}, ${width * 0.7} ${height * 0.28}
                      S ${width * 0.5} ${height * 0.32}, ${width * 0.25} ${height * 0.38}
                      S ${width * 0.4} ${height * 0.42}, ${width * 0.55} ${height * 0.5}
                      S ${width * 0.4} ${height * 0.54}, ${width * 0.35} ${height * 0.62}
                      S ${width * 0.55} ${height * 0.67}, ${width * 0.65} ${height * 0.74}
                      S ${width * 0.55} ${height * 0.78}, ${width * 0.45} ${height * 0.86}`}
                  stroke="#DDDDDD"
                  strokeWidth="10"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray="5,5"
                />
              </Svg>

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
