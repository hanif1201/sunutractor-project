import { StyleSheet, Text, View, Image, SafeAreaView } from "react-native";
import { router } from "expo-router";
import React from "react";
import images from "../../constants/images";
import CustomButton from "../../components/CustomButton";
import { TouchableOpacity } from "react-native";

const favourites = () => {
  const handleButtonPress = {};
  return (
    <SafeAreaView className=' h-full flex justify-center'>
      <View className=' px-4 justify-between items-center'>
        <Image
          source={images.nothingHere}
          resizeMode='contain'
          className='w-[270px] h-[216px]'
        />

        <Text className='text-lg text-center font-pmedium text-[#424242]'>
          Add to Favourites
        </Text>
        <Text className='text-sm text-center font-pregular text-[#424242] mt-2'>
          Make it easy to find the tractors that matter most
        </Text>
      </View>
      <TouchableOpacity
        onPress={handleButtonPress}
        activeOpacity={0.7}
        style={{
          borderRadius: 5,
          padding: 12,
          alignItems: "center",
          margin: 16,
        }}
      >
        <Text className='text-primary font-pregular text-sm'>
          Add to Favourites
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default favourites;

const styles = StyleSheet.create({});
