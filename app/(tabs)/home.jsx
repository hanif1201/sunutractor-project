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
import CustomInput from "../../components/CustomInput";

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
  const [activeCategory, setActiveCategory] = useState(null); // State for active category

  const handlePress = (id) => {
    navigation.navigate("TractorDetailsScreen", { id });
  };
  const [searchQuery, setSearchQuery] = useState("");
  const categories = [
    "All",
    "Agricultural tractors",
    "Industrial tractors",
    "Garden tractors",
    "Rotary tillers",
    "Compact tractors",
    "Row crop tractors",
    "Orchard tractors",
    "Loader tractors",
  ];
  const handleCategoryPress = (category) => {
    setActiveCategory(category); // Set the active category
  };

  return (
    <SafeAreaView className=' mt-12  h-full '>
      <View className='flex flex-row justify-between items-center px-4 mb-4 mt-4'>
        <View className='flex flex-row items-center gap-2'>
          <View className='p-2  border-lightDark rounded-lg border-2'>
            <Image
              source={icons.location1}
              resizeMode='contain'
              className='w-2 h-2 p-3  '
            />
          </View>
          <View>
            <Text className='text-base font-pregular text-grey'>
              Your Location
            </Text>

            <Text className='text-base font-psemibold'>Uganda, Africa</Text>
          </View>
        </View>
        <View>
          <View className='p-2  border-lightDark rounded-full border-2'>
            <Image
              source={icons.notification}
              resizeMode='contain'
              className='w-2 h-2 p-3  '
            />
          </View>
        </View>
      </View>
      <View className='px-4 py-4'>
        <CustomInput placeholder='Search Tractor...' />
      </View>

      <ScrollView className='px-4'>
        <View className='flex flex-row justify-between mt-2'>
          <Text className='text-base font-pbold'> Tractor Categories</Text>
        </View>
        {/* Horizontal ScrollView for Categories */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className='my-4'
        >
          {categories.map((category, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handleCategoryPress(category)}
              className={`flex-row items-center mr-4 p-2 rounded-lg text-sm font-pregular ${
                activeCategory === category
                  ? " rounded-full border-primary border "
                  : " "
              }`} // Change background color based on active state
            >
              <Text className='text-base font-pregular'>{category}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

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
