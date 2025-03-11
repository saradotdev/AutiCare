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
  GenderSelector: { age: string };
  SpeechLevel: { age: string; gender: string };
  SetGoal: { age: string; gender: string; speechLevel: string };
  Home: undefined;
  GuessExpression: undefined;
  MatchAndSort: undefined;
};
