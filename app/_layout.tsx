import { Slot } from "expo-router";
import { useEffect  } from "react";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { UserProvider } from "@/hooks/user";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    antoutline: require("@ant-design/icons-react-native/fonts/antoutline.ttf"),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <UserProvider>
      <Slot />
    </UserProvider>
  );
}
