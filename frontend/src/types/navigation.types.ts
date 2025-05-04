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
  Guardian: undefined;
  Report: undefined;

  // Settings Flow
  Account: undefined;
  Notifications: undefined;
  ChildProfiles: undefined;
  About: undefined;
  PrivacyPolicy: undefined;
  TermsOfService: undefined;

  // Games
  GuessExpression: undefined;
  MatchAndSort: undefined;
  SocialScenario: undefined;
};
