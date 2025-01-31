import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import {
  SignIn,
  ChildTest,
  InputEmail,
  InputPassword,
  Welcome,
} from "../screens";
import { MyAppBar } from "../components";

export type RootStackParamList = {
  Welcome: undefined;
  InputEmail: undefined;
  InputPassword: undefined;
  SignIn: undefined;
  ChildTest: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

// all screens in the app
const screens = {
  Welcome,
  InputEmail,
  InputPassword,
  SignIn,
  ChildTest,
};

// screens that need MyAppBar with their custom titles
const screensWithAppBar: Record<string, string> = {
  InputEmail: "Register with E-mail",
  InputPassword: "Register with E-mail",
};

export const Navigation = () => (
  <NavigationContainer>
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {Object.entries(screens).map(([name, component]) => (
        <Stack.Screen
          key={name}
          name={name as keyof RootStackParamList}
          component={component}
          options={
            screensWithAppBar[name]
              ? {
                  headerShown: true,
                  header: () => <MyAppBar title={screensWithAppBar[name]} />,
                }
              : undefined
          }
        />
      ))}
    </Stack.Navigator>
  </NavigationContainer>
);
