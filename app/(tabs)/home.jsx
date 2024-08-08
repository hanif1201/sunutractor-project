import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  Image,
} from "react-native";
import React, { useState } from "react";

const home = () => {
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
              <View className='flex flex-row'>
                <Text className='text-start mt-1 font-bold text-lg'>
                  {tractor.name}
                </Text>
                <Text className='text-start mt-2 text-sm'>{tractor.name}</Text>
              </View>
              <View>
                <Text className='text-start mt-1'>{tractor.price}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default home;
