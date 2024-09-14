import { View, Text, Image, ScrollView } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "../constants";
import CustomButton from "../components/CustomButton";
import { Redirect, router } from "expo-router";
import { useGlobalContext } from "../context/GlobalProvider";

const onboarding = () => {
  const { loading, isLogged } = useGlobalContext();

  if (!loading && isLogged) return <Redirect href='/home' />;
  return (
    <SafeAreaView className='bg-white h-full'>
      <ScrollView className=' h-full'>
        <View className='h-full'>
          <View className='p-5 h-1/2'>
            <Image
              source={images.tractor}
              className='w-full rounded-lg h-96 object-contain'
            />
          </View>
          <View className='  px-4 h-1/2'>
            <Image
              source={images.logo}
              resizeMode='contain'
              className='w-[300px] h-[200px]  ml-10 justify-center items-center '
            />

            <Text className='text-xl font-psemibold text-center  '>
              Welcome to sunu<Text className='text-danger'>TRACTOR</Text>
            </Text>
            <Text className='text-base font-pregular pt-2 text-center '>
              Please login or Sign-Up to access our tractor rental service and
              browse available tractors in your area
            </Text>

            <CustomButton
              title='GET STARTED NOW'
              handlePress={() => router.push("/sign-up")}
              containerStyles='w-full mt-16 '
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default onboarding;
