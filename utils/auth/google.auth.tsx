import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import AntDesign from "@expo/vector-icons/AntDesign";
import { supabase } from "@/utils/supabase";
import { AuthTokenResponse } from "@supabase/supabase-js";
import { IOSClientId } from '@/config';

type GoogleAuthProps = {
  loginSuccessCallback: (data: AuthTokenResponse["data"]) => void;
};

export default function ({ loginSuccessCallback }: GoogleAuthProps) {
  GoogleSignin.configure({
    scopes: ["https://www.googleapis.com/auth/drive.readonly"],
    iosClientId: IOSClientId,
  });

  const signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      if (userInfo.data?.idToken) {
        const { data, error } = await supabase.auth.signInWithIdToken({
          provider: "google",
          token: userInfo.data.idToken,
        });
        if (!error) loginSuccessCallback(data);
      } else {
        throw new Error("no ID token present!");
      }
    } catch (error: any) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
      } else {
        // some other error happened
      }
    }
  };

  return (
    <AntDesign name="google" size={24} color="black" onPress={signIn} />
  );
}
