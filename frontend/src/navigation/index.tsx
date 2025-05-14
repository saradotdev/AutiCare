import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { RootStackParamList } from "../types";
import {
  About,
  Account,
  AgePicker,
  ChildProfiles,
  ChildTest,
  ForgotPassword,
  GenderSelector,
  Guardian,
  GuessExpression,
  Home,
  InputEmail,
  InputPassword,
  MatchAndSort,
  Notifications,
  PrivacyPolicy,
  Report,
  ResetPassword,
  SetGoal,
  SignIn,
  SocialScenario,
  SpeechLevel,
  TermsOfService,
  VerificationCode,
  Welcome,
  WordSpeech,
} from "../screens";
import WordSpeechGame from "../screens/Games/WordSpeech/GameScreen";

const Stack = createStackNavigator<RootStackParamList>();

export const Navigation = () => (
  <NavigationContainer>
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* Auth Flow */}
      <Stack.Screen name="Welcome" component={Welcome} />
      <Stack.Screen name="InputEmail" component={InputEmail} />
      <Stack.Screen name="InputPassword" component={InputPassword} />
      <Stack.Screen name="SignIn" component={SignIn} />
      <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
      <Stack.Screen name="VerificationCode" component={VerificationCode} />
      <Stack.Screen name="ResetPassword" component={ResetPassword} />

      {/* Onboarding Flow */}
      <Stack.Screen name="ChildTest" component={ChildTest} />
      <Stack.Screen name="AgePicker" component={AgePicker} />
      <Stack.Screen name="GenderSelector" component={GenderSelector} />
      <Stack.Screen name="SpeechLevel" component={SpeechLevel} />
      <Stack.Screen name="SetGoal" component={SetGoal} />

      {/* Main Flow */}
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Guardian" component={Guardian} />
      <Stack.Screen name="Report" component={Report} />

      {/* Settings Flow */}
      <Stack.Screen name="Account" component={Account} />
      <Stack.Screen name="Notifications" component={Notifications} />
      <Stack.Screen name="ChildProfiles" component={ChildProfiles} />
      <Stack.Screen name="About" component={About} />
      <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicy} />
      <Stack.Screen name="TermsOfService" component={TermsOfService} />

      {/* Games */}
      <Stack.Screen name="GuessExpression" component={GuessExpression} />
      <Stack.Screen name="MatchAndSort" component={MatchAndSort} />
      <Stack.Screen name="SocialScenario" component={SocialScenario} />
      <Stack.Screen name="WordSpeech" component={WordSpeech} />
      <Stack.Screen name="WordSpeechGame" component={WordSpeechGame} />
    </Stack.Navigator>
  </NavigationContainer>
);
