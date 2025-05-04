export type RootStackParamList = {
  // Auth Flow
  Welcome: undefined;
  InputEmail: undefined;
  InputPassword: { email: string };
  SignIn: undefined;
  ForgotPassword: undefined;
  VerificationCode: undefined;
  ResetPassword: undefined;

  // Onboarding Flow
  ChildTest: undefined;
  AgePicker: undefined;
  GenderSelector: { age: string };
  SpeechLevel: { age: string; gender: string };
  SetGoal: { age: string; gender: string; speechLevel: string };

  // Main Flow
  Home: undefined;
  GuessExpression: undefined;
  MatchAndSort: undefined;
  SocialScenario: undefined;
  WordSpeech: undefined;
  WordSpeechGame: { level: number };
};
