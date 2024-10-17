import "ts-node/register";
import { ExpoConfig, ConfigContext } from "expo/config";
import { googleAuthClientId } from "./config";
// const googleAuthClientId = "478181534282-99tiak05tb5o7v8itji656n01lc3m82u";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "app-tpl",
  slug: "app-tpl",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  scheme: "tpl",
  userInterfaceStyle: "automatic",
  splash: {
    image: "./assets/images/splash.png",
    resizeMode: "contain",
    backgroundColor: "#ffffff",
  },
  ios: {
    supportsTablet: true,
    bundleIdentifier: "com.demo.tpl",
    infoPlist: {
      NSAppTransportSecurity: {
        NSAllowsArbitraryLoads: true,
      },
    },
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/images/adaptive-icon.png",
      backgroundColor: "#ffffff",
    },
    package: "com.demo.tpl",
  },
  plugins: [
    "expo-router",
    [
      "@react-native-google-signin/google-signin",
      {
        iosUrlScheme: `com.googleusercontent.apps.${googleAuthClientId}`,
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
  },
});
