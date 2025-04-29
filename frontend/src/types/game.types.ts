import { RootStackParamList } from "./navigation";

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
