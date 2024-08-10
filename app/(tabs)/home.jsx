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

const home = () => {
  const handlePress = () => {};
  const [searchQuery, setSearchQuery] = useState("");
  const categories = [
    { name: "All", image: "https://via.placeholder.com/150" },
    { name: "Tractors", image: "https://via.placeholder.com/150" },
    { name: "Home & Garden", image: "https://via.placeholder.com/150" },
  ];

  const tractors = [
    {
      name: "Tractor 1",
      image: "https://via.placeholder.com/150",
      location: "Kampala",
      price: "UGX 100,000",
      rating: 4,
      reviews: 20,
    },
    {
      name: "Tractor 2",
      image: "https://via.placeholder.com/150",
      location: "Kampala",
      price: "UGX 100,000",
      rating: 4,
      reviews: 20,
    },
    {
      name: "Tractor 3",
      image: "https://via.placeholder.com/150",
      location: "Kampala",
      price: "UGX 100,000",
      rating: 4,
      reviews: 20,
    },
    {
      name: "Tractor 4",
      image: "https://via.placeholder.com/150",
      location: "Kampala",
      price: "UGX 100,000",
      rating: 4,
      reviews: 20,
    },
    {
      name: "Tractor 5",
      image: "https://via.placeholder.com/150",
      location: "Kampala",
      price: "UGX 100,000",
      rating: 4,
      reviews: 20,
    },
    {
      name: "Tractor 6",
      image: "https://via.placeholder.com/150",
      location: "Kampala",
      price: "UGX 100,000",
      rating: 4,
      reviews: 20,
    },
  ];

  return (
    <SafeAreaView className=' mt-12  h-full '>
      <View className='px-4 mb-4 mt-4'>
        <TextInput
          className='h-10 border border-gray-300 rounded px-3'
          placeholder='What would you like to rent??'
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      <ScrollView className='px-4'>
        <View className='flex flex-row justify-between'>
          <Text className='text-lg font-bold'>Categories</Text>
          <Text className='text-blue-500'>See all</Text>
        </View>
        <View className='flex flex-row flex-wrap justify-between mt-4'>
          {categories.map((category, index) => (
            <View key={index} className='w-1/3 p-2'>
              <Image
                source={{ uri: category.image }}
                className='w-full h-24 rounded'
              />
              <Text className='text-center mt-2'>{category.name}</Text>
            </View>
          ))}
        </View>
        {/* <View className='flex flex-row justify-between'>
          <Text className='text-lg font-bold'>Featured</Text>
          <Text className='text-blue-500'>See all</Text>
        </View> */}
        <View className='flex flex-row justify-between'>
          <Text className='text-lg font-bold'>Recommended For You</Text>
          <Text className='text-blue-500'>See all</Text>
        </View>

        <View className='flex flex-row flex-wrap justify-around mt-4 mb-40'>
          {tractors.map((tractor, index) => (
            <View key={index} className='w-[170px] m-1 border-black border-2'>
              <Image
                source={{ uri: tractor.image }}
                className='w-full h-24 rounded'
              />
              <View className='flex flex-row justify-between items-center pr-2'>
                <Text className='text-start mt-1 font-semibold text-lg'>
                  {tractor.name}
                </Text>
                <Image
                  source={icons.heart}
                  resizeMode='contain'
                  style={{ width: 24, height: 24, tintColor: "#000" }}
                />
              </View>
              <View>
                <Text className='text-start mt-1 font-bold text-sm'>
                  {tractor.price}/hr
                </Text>
              </View>
              <View className='flex flex-row items-center'>
                <Image
                  source={icons.location}
                  resizeMode='contain'
                  style={{ width: 16, height: 16, tintColor: "#000" }}
                />
                <Text className='text-start mt-1 font-bold text-sm'>
                  {tractor.location}
                </Text>
              </View>
              <TouchableOpacity
                onPress={handlePress}
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
