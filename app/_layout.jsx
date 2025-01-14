import { useEffect } from "react";
import { useFonts } from "expo-font";
// import "react-native-url-polyfill/auto";
import { SplashScreen, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import GlobalProvider from "../context/GlobalProvider";
import OwnerDetails from "./tractor/OwnerDetails";
import TractorDetailsScreen from "./tractor/[tractorId]";

export default function RootLayout() {
  // Prevent the splash screen from auto-hiding before asset loading is complete.
  SplashScreen.preventAutoHideAsync();
  const [fontsLoaded, error] = useFonts({
    "Poppins-Black": require("../assets/fonts/Poppins-Black.ttf"),
    "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
    "Poppins-ExtraBold": require("../assets/fonts/Poppins-ExtraBold.ttf"),
    "Poppins-ExtraLight": require("../assets/fonts/Poppins-ExtraLight.ttf"),
    "Poppins-Light": require("../assets/fonts/Poppins-Light.ttf"),
    "Poppins-Medium": require("../assets/fonts/Poppins-Medium.ttf"),
    "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
    "Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
    "Poppins-Thin": require("../assets/fonts/Poppins-Thin.ttf"),
  });

  useEffect(() => {
    if (error) throw error;

    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, error]);

  if (!fontsLoaded) {
    return null;
  }

  if (!fontsLoaded && !error) {
    return null;
  }

  return (
    <GlobalProvider>
      <Stack>
        <Stack.Screen name='index' options={{ headerShown: false }} />
        {/* <Stack.Screen name='onboarding' options={{ headerShown: false }} /> */}
        <Stack.Screen name='(auth)' options={{ headerShown: false }} />
        <Stack.Screen name='(tabs)' options={{ headerShown: false }} />
        <Stack.Screen
          name='tractor/[tractorId]'
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name='tractor/OwnerDetails'
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name='tractor/UserTractorsScreen'
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name='tractor/EditTractorDetails'
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name='tractor/EditProfileScreen'
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name='tractor/ChatScreen'
          options={{ headerShown: false }}
        />
      </Stack>
      <StatusBar backgroundColor='#218225' style='light' />
    </GlobalProvider>
  );
}
