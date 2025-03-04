import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { RootStackParamList } from "../types/navigation";
import {
  AgePicker,
  ChildTest,
  ForgotPassword,
  GenderSelector,
  GuessExpression,
  Home,
  InputEmail,
  InputPassword,
  MatchAndSort,
  ResetPassword,
  SetGoal,
  SignIn,
  SpeechLevel,
  VerificationCode,
  Welcome,
} from "../screens";

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
      <Stack.Screen name="GuessExpression" component={GuessExpression} />
      <Stack.Screen name="MatchAndSort" component={MatchAndSort} />
    </Stack.Navigator>
  </NavigationContainer>
);
