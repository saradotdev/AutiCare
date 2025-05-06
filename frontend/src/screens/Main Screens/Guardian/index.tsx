import React, { useEffect } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "@expo/vector-icons/Ionicons";
import theme from "../../../../theme";
import Summary from "../Summary";
import Settings from "../Settings";
import { useBackgroundMusic } from "../../../hooks";

const Tab = createBottomTabNavigator();

export default function Guardian() {
  const { stopMusic } = useBackgroundMusic();

  useEffect(() => {
    stopMusic();
  }, []);

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colorSummerSky,
        tabBarInactiveTintColor: theme.colorDarkGrey,
        tabBarLabelStyle: {
          fontSize: 12,
          fontFamily: theme.ibrand,
        },
        tabBarStyle: {
          backgroundColor: "#fff",
          height: 60,
        },
      }}
    >
      <Tab.Screen
        name="Summary"
        component={Summary}
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="stats-chart" size={26} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={Settings}
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="settings" size={26} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
