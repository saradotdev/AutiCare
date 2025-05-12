import { RootStackParamList } from "./navigation.types";

export interface GameCardProps {
  title: string;
  color: string;
  Image: React.FC;
  onPress: () => void;
}

export type GameAppBarProps = {
  title: string;
  instructions: string[];
};

export type Game = {
  id: string;
  title: string;
  color: string;
  Image: () => JSX.Element;
  screen: keyof RootStackParamList;
};

export interface MyModalProps {
  visible: boolean;
  text?: string;
  buttonText?: string;
  onClose: () => void;
  children?: React.ReactNode;
}

export interface ScoreCardProps {
  score: number;
  total: number;
}

export interface Bucket {
  id: string;
  color: string;
  image_url: string;
  x: number;
}

export interface FallingObject {
  id: string;
  color: string;
  target_bucket_id: string;
  image_url: string;
}

export interface LevelButtonProps {
  level: number;
  onPress: () => void;
  isLocked?: boolean;
  style: any;
}

type Dialogue = {
  character: string;
  text: string;
};

type Option = {
  id: number;
  text: string;
  is_correct: boolean;
};

export type SocialScenario = {
  id: number;
  title: string;
  age_group: string;
  difficulty: number;
  character1_name: string;
  character2_name: string;
  dialogues: Dialogue[];
  options: Option[];
  session_id: number;
};
