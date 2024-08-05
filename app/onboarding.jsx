import { View, Text, Image, ScrollView } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ImageBackground } from "react-native";
import { images } from "../constants";
import CustomButton from "../components/CustomButton";
import { Redirect, router } from "expo-router";

const onboarding = () => {
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
