import { useEffect, useRef } from "react";
import { Audio } from "expo-av";

export const useBackgroundMusic = () => {
  const sound = useRef<Audio.Sound | null>(null);

  const playMusic = async () => {
    if (sound.current) return;
    const { sound: playback } = await Audio.Sound.createAsync(
      require("../assets/sounds/background.mp3"),
      { isLooping: true, volume: 0.5 },
    );
    sound.current = playback;
    await sound.current.playAsync();
  };

  const stopMusic = async () => {
    if (sound.current) {
      await sound.current.stopAsync();
      await sound.current.unloadAsync();
      sound.current = null;
    }
  };

  useEffect(() => {
    return () => {
      stopMusic(); // clean up
    };
  }, []);

  return { playMusic, stopMusic };
};
