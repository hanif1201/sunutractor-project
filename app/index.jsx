import { View, Text, Image, ScrollView } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ImageBackground } from "react-native";
import { images } from "../constants";
import CustomButton from "../components/CustomButton";
import { Redirect, router } from "expo-router";
import { useGlobalContext } from "../context/GlobalProvider";

const onboarding = () => {
  const { loading, isLogged } = useGlobalContext();

  if (!loading && isLogged) return <Redirect href='/home' />;
  return (
    <SafeAreaView className='bg-white h-full'>
      <ScrollView
        contentContainerStyle={{
          height: "100%",
        }}
      >
        <View className='h-[70%] bg-primary'>
          <Image source={images.tractor} />
        </View>
        <View className='h-1/2 bg-white flex justify-start  px-4'>
          <Text className='text-xl font-pmedium pt-10'>Welcome to </Text>
          <Text className='text-3xl font-pblack pt-1 '>
            sunu<Text className='text-danger'>TRACTOR</Text>
          </Text>
          <CustomButton
            title='Get Started'
            handlePress={() => router.push("/sign-up")}
            containerStyles='w-full mt-5 rounded-xl'
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default onboarding;

// import React, { useEffect } from "react";

// import { StatusBar } from "expo-status-bar";
// import { Redirect, router } from "expo-router";
// import { View, Text, Image, ScrollView } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { useNavigation } from "@react-navigation/native";

// import { images } from "../constants";

// const Welcome = () => {
//   const navigation = useNavigation();

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       navigation.navigate("onboarding"); // Replace 'HomePage' with the name of the page you want to navigate to
//     }, 3000); // 3000 milliseconds = 3 seconds

//     return () => clearTimeout(timer); // Cleanup the timer when the component unmounts
//   }, [navigation]);
//   return (
//     <SafeAreaView className='bg-white h-full'>
//       <ScrollView
//         contentContainerStyle={{
//           height: "100%",
//         }}
//       >
//         <View className='w-full flex justify-center items-center h-full px-4'>
//           <Image
//             source={images.logo}
//             className='w-100% '
//             resizeMode='contain'
//           />
//         </View>
//       </ScrollView>
//       <StatusBar backgroundColor='#161622' style='light' />
//     </SafeAreaView>
//   );
// };

// export default Welcome;
