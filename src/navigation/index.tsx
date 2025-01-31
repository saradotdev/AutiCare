import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import {
  ChildTest,
  ForgotPassword,
  InputEmail,
  InputPassword,
  SignIn,
  Welcome,
} from "../screens";

export type RootStackParamList = {
  Welcome: undefined;
  InputEmail: undefined;
  InputPassword: undefined;
  SignIn: undefined;
  ForgotPassword: undefined;
  ChildTest: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export const Navigation = () => (
  <NavigationContainer>
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Welcome" component={Welcome} />
      <Stack.Screen name="InputEmail" component={InputEmail} />
      <Stack.Screen name="InputPassword" component={InputPassword} />
      <Stack.Screen name="SignIn" component={SignIn} />
      <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
      <Stack.Screen name="ChildTest" component={ChildTest} />
    </Stack.Navigator>
  </NavigationContainer>
);
