import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { InputEmail, Welcome } from "../screens";

export type RootStackParamList = {
  Welcome: undefined;
  InputEmail: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export const Navigation = () => (
  <NavigationContainer>
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Welcome" component={Welcome} />
      <Stack.Screen name="InputEmail" component={InputEmail} />
    </Stack.Navigator>
  </NavigationContainer>
);
