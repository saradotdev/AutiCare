import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import {
  AgePicker,
  ChildTest,
  ForgotPassword,
  GenderSelector,
  Home,
  InputEmail,
  InputPassword,
  ResetPassword,
  SetGoal,
  SignIn,
  SpeechLevel,
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
  AgePicker: undefined;
  GenderSelector: undefined;
  SpeechLevel: undefined;
  SetGoal: undefined;
  Home: undefined;
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
      <Stack.Screen name="AgePicker" component={AgePicker} />
      <Stack.Screen name="GenderSelector" component={GenderSelector} />
      <Stack.Screen name="SpeechLevel" component={SpeechLevel} />
      <Stack.Screen name="SetGoal" component={SetGoal} />
      <Stack.Screen name="Home" component={Home} />
    </Stack.Navigator>
  </NavigationContainer>
);
