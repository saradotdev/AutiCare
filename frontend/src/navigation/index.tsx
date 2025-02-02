import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import {
  ChildTest,
  ForgotPassword,
  InputEmail,
  InputPassword,
  ResetPassword,
  SignIn,
  VerificationCode,
  Welcome,
} from "../screens";

export type RootStackParamList = {
  Welcome: undefined;
  InputEmail: undefined;
  InputPassword: { email: string };
  SignIn: undefined;
  ForgotPassword: undefined;
  VerificationCode: undefined;
  ResetPassword: undefined;
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
      <Stack.Screen name="VerificationCode" component={VerificationCode} />
      <Stack.Screen name="ResetPassword" component={ResetPassword} />
      <Stack.Screen name="ChildTest" component={ChildTest} />
    </Stack.Navigator>
  </NavigationContainer>
);
