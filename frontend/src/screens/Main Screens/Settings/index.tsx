import React, { useCallback, useState } from "react";
import { FlatList, TouchableOpacity, View } from "react-native";
import { MyButton, MyText } from "../../../components";
import theme from "../../../../theme";
import { FontAwesome } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../../types";
import { StackNavigationProp } from "@react-navigation/stack";
import { styles } from "./index.styles";
import { useTimeLimit } from "../../../context";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Ionicons from "@expo/vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SETTINGS_OPTIONS = [
  {
    id: "1",
    title: "Account",
    screen: "Account",
    icon: (
      <MaterialCommunityIcons
        name="account"
        size={24}
        color={theme.colorSummerSky}
      />
    ),
  },
  {
    id: "2",
    title: "Notifications",
    screen: "Notifications",
    icon: (
      <Ionicons name="notifications" size={24} color={theme.colorCoralRed} />
    ),
  },
  {
    id: "3",
    title: "Child Profiles",
    screen: "ChildProfiles",
    icon: <FontAwesome name="child" size={24} color={theme.colorGreen} />,
  },
  {
    id: "4",
    title: "About",
    screen: "About",
    icon: (
      <Ionicons name="information-circle" size={24} color={theme.colorYellow} />
    ),
  },
  {
    id: "5",
    title: "Privacy Policy",
    screen: "PrivacyPolicy",
    icon: (
      <MaterialCommunityIcons
        name="script-text-key"
        size={24}
        color={theme.colorPurple}
      />
    ),
  },
  {
    id: "6",
    title: "Terms of Service",
    screen: "TermsOfService",
    icon: (
      <MaterialCommunityIcons
        name="text-box-check"
        size={24}
        color={theme.colorLightGreen}
      />
    ),
  },
];

export default function Settings() {
  const [isTimeExceeded, setIsTimeExceeded] = useState<boolean>(false);
  const { checkIfTimeExceeded } = useTimeLimit(); // using the context to get the time limit status

  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const handlePress = (screen: string) => {
    navigation.navigate(screen as any);
  };

  useFocusEffect(
    useCallback(() => {
      const loadData = async () => {
        const timeExceeded = await checkIfTimeExceeded();
        setIsTimeExceeded(timeExceeded);
      };

      loadData();
    }, [checkIfTimeExceeded]),
  );

  const handleSignOut = async () => {
    try {
      await AsyncStorage.removeItem("jwtToken");
      navigation.reset({ index: 0, routes: [{ name: "Welcome" }] });
    } catch (e) {
      console.error("Error signing out:", e);
    }
  };

  return (
    <View>
      <View style={styles.header}>
        <MyText style={styles.title}>Settings</MyText>

        {/* Lock the button when time is exceeded */}
        {isTimeExceeded ? (
          <MyButton
            textColor={theme.colorWhite}
            style={styles.changeTab}
            icon={<FontAwesome name="lock" size={24} color="white" />}
            onPress={() => {}}
            disabled
          >
            Child
          </MyButton>
        ) : (
          <MyButton
            textColor={theme.colorWhite}
            style={styles.changeTab}
            icon={<FontAwesome name="child" size={24} color="white" />}
            onPress={() => {
              navigation.reset({ index: 0, routes: [{ name: "Home" }] });
            }}
          >
            Child
          </MyButton>
        )}
      </View>

      <View style={styles.container}>
        <FlatList
          data={SETTINGS_OPTIONS}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.optionRow}
              onPress={() => handlePress(item.screen)}
            >
              <View style={styles.optionTextContainer}>
                <View style={styles.optionIcon}>{item.icon}</View>
                <MyText style={styles.optionText}>{item.title}</MyText>
              </View>
              <Ionicons
                name="chevron-forward"
                size={24}
                color={theme.colorMediumGrey}
              />
            </TouchableOpacity>
          )}
        />
      </View>

      <MyButton textColor={theme.colorRed} onPress={handleSignOut}>
        Sign out
      </MyButton>
    </View>
  );
}
