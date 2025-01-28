import * as SplashScreen from "expo-splash-screen";
import React, { useCallback, useEffect, useState } from "react";
import { useFonts } from "expo-font";
import { View } from "react-native";
import { Welcome } from "./src/screens";

export default function App(): JSX.Element | null {
  const [appIsReady, setAppIsReady] = useState<boolean>(false);
  const [fontsLoaded] = useFonts({
    IBrand: require("./src/assets/fonts/ibrand.otf"),
  });

  useEffect(() => {
    const prepare = async (): Promise<void> => {
      await SplashScreen.preventAutoHideAsync();
      setAppIsReady(true);
    };
    prepare();
  }, [fontsLoaded]);

  const onLayoutRootView = useCallback(async (): Promise<void> => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <View onLayout={onLayoutRootView}>
      <Welcome />
    </View>
  );
}
