import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
// import heart from "../../assets/icons/heart-regular.png";
import icons from "../../constants/icons";
import images from "../../constants/images";
import { tractor } from "../../data/tractor";
import { useNavigation } from "@react-navigation/native";
import useAppwrite from "../../lib/useAppwrite";
import { getAllTractors } from "../../lib/appwrite";
import { createRouter } from "expo-router";

const home = () => {
  const { data: tractors, refetch } = useAppwrite(getAllTractors);

  const navigation = useNavigation();

  const handlePress = (id) => {
    navigation.navigate("TractorDetailsScreen", { id });
  };
  const [searchQuery, setSearchQuery] = useState("");
  const categories = [
    { name: "All", image: "https://via.placeholder.com/150" },
    { name: "Tractors", image: "https://via.placeholder.com/150" },
    { name: "Home & Garden", image: "https://via.placeholder.com/150" },
  ];

  return (
    <SafeAreaView className=' mt-12  h-full '>
      <View className='px-4 mb-4 mt-4'>
        <TextInput
          className='h-10 border border-gray-300 rounded px-3 font-pregular'
          placeholder='What would you like to rent??'
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      <ScrollView className='px-4'>
        <View className='flex flex-row justify-between'>
          <Text className='text-lg font-pbold'>Categories</Text>
          <Text className='text-blue-500 font-pregular'>See all</Text>
        </View>
        <View className='flex flex-row flex-wrap justify-between mt-4'>
          {categories.map((category, index) => (
            <View key={index} className='w-1/3 p-2'>
              <Image
                source={{ uri: category.image }}
                className='w-full h-24 rounded'
              />
              <Text className='text-center mt-2 font-pregular'>
                {category.name}
              </Text>
            </View>
          ))}
        </View>
        {/* <View className='flex flex-row justify-between'>
          <Text className='text-lg font-bold'>Featured</Text>
          <Text className='text-blue-500'>See all</Text>
        </View> */}
        <View className='flex flex-row justify-between'>
          <Text className='text-lg font-pbold'>Recommended For You</Text>
          <Text className='text-blue-500 font-pregular'>See all</Text>
        </View>

        <View className='flex flex-row flex-wrap justify-around mt-4 mb-40'>
          {tractors.map((tractor, index) => (
            <View
              key={index}
              className='w-full  min-h-[300px] m-1 border-black border-2'
            >
              <Image
                source={{ uri: tractor.thumbnail }}
                className='w-full h-52 rounded'
              />
              <View className='flex flex-row justify-between items-center pr-2'>
                <Text className='text-start mt-1 font-psemibold text-lg w-4/5'>
                  {tractor.make} {tractor.model}
                </Text>
                <Image
                  source={icons.heart}
                  resizeMode='contain'
                  style={{ width: 24, height: 24, tintColor: "#000" }}
                />
              </View>
              <View>
                <Text className='text-start mt-1 font-pbold text-sm'>
                  {tractor.price}/hr
                </Text>
              </View>
              <View className='flex flex-row items-center'>
                <Image
                  source={icons.location}
                  resizeMode='contain'
                  style={{ width: 16, height: 16, tintColor: "#000" }}
                />
                <Text className='text-start mt-1 font-pbold text-sm'>
                  {tractor.region}
                  {tractor.district}
                  {tractor.village}
                </Text>
              </View>
              <TouchableOpacity
                key={tractor.id}
                onPress={() =>
                  navigation.navigate("tractor/[tractorId]", {
                    documentId: tractor.$id, // Pass the document ID
                  })
                }
                activeOpacity={0.7}
                className='bg-primary rounded-md min-h-[42px] flex flex-row justify-center items-center mt-4 py-2 mx-1 mb-1 '
              >
                <Text className={`text-white font-psemibold `}>
                  Check Detail
                </Text>
                {/* <ActivityIndicator color='#fff' size='small' className='ml-2' /> */}
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default home;
