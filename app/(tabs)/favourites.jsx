import { StyleSheet, Text, View, Image, SafeAreaView } from "react-native";
import { router } from "expo-router";
import React from "react";
import images from "../../constants/images";
import CustomButton from "../../components/CustomButton";

const favourites = () => {
  return (
    <SafeAreaView className=' h-full flex justify-center'>
      <View className=' px-4 '>
        <Image
          source={images.empty}
          resizeMode='contain'
          className='w-[270px] h-[216px]'
        />

        <Text className='text-sm text-center font-pmedium text-primary'>
          No tractor Found
        </Text>
        <Text className='text-xl text-center font-psemibold text-primary mt-2'>
          No Favourites Tractors Found
        </Text>

        <CustomButton
          title='Back to Explore'
          handlePress={() => router.push("/home")}
          containerStyles='w-full my-5'
        />
      </View>
    </SafeAreaView>
  );
};

export default favourites;

const styles = StyleSheet.create({});
