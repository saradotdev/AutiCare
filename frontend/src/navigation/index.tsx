import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { RootStackParamList } from "../types";
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
  SocialScenario,
  SpeechLevel,
  VerificationCode,
  Welcome,
  WordSpeech,
} from "../screens";
import WordSpeechGame from "../screens/Games/WordSpeech/GameScreen";

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
      <Stack.Screen name="SocialScenario" component={SocialScenario} />
      <Stack.Screen name="WordSpeech" component={WordSpeech} />
      <Stack.Screen name="WordSpeechGame" component={WordSpeechGame} />
    </Stack.Navigator>
  </NavigationContainer>
);
