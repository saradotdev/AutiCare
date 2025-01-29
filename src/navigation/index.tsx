import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { InputEmail, InputPassword, Welcome } from "../screens";
import { MyAppBar } from "../components";

export type RootStackParamList = {
  Welcome: undefined;
  InputEmail: undefined;
  InputPassword: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export const Navigation = () => (
  <NavigationContainer>
    <Stack.Navigator>
      <Stack.Screen
        name="Welcome"
        component={Welcome}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="InputEmail"
        component={InputEmail}
        options={{
          header: () => <MyAppBar title="Register with E-mail" />,
        }}
      />
      <Stack.Screen
        name="InputPassword"
        component={InputPassword}
        options={{
          header: () => <MyAppBar title="Register with E-mail" />,
        }}
      />
    </Stack.Navigator>
  </NavigationContainer>
);
