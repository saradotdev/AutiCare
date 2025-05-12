import "react-native-gesture-handler";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect, useState } from "react";
import { useFonts } from "expo-font";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Navigation } from "./src/navigation";
import { TimeLimitProvider } from "./src/context";

SplashScreen.preventAutoHideAsync();

export default function App(): JSX.Element | null {
  const [appIsReady, setAppIsReady] = useState<boolean>(false);
  const [fontsLoaded] = useFonts({
    IBrand: require("./src/assets/fonts/ibrand.otf"),
    PoppinsRegular: require("./src/assets/fonts/Poppins-Regular.ttf"),
    ComicSansMS: require("./src/assets/fonts/Comic-Sans-MS.ttf"),
  });

  useEffect(() => {
    const prepare = async () => {
      if (fontsLoaded) {
        setAppIsReady(true);
        await SplashScreen.hideAsync();
      }
    };
    prepare();
  }, [fontsLoaded]);

  if (!appIsReady) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <TimeLimitProvider>
        <Navigation />
      </TimeLimitProvider>
    </SafeAreaProvider>
  );
}
