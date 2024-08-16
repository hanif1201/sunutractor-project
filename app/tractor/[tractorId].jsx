import { Stack, useLocalSearchParams, useRouter } from "expo-router";

import { useRoute } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";

import CustomButton from "../../components/CustomButton";
import {
  View,
  SafeAreaView,
  Text,
  Image,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useState, useEffect } from "react";
import icons from "../../constants/icons";
import { tractor } from "../../data/tractor";

const TractorDetailsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const tractorId = route.params.tractorId;
  const [tractorDetails, setTractorDetails] = useState({});

  useEffect(() => {
    const findTractor = tractor.find((item) => item.id === tractorId);
    if (findTractor) {
      setTractorDetails(findTractor);
    }
  }, [tractorId]);

  if (!tractorDetails) {
    return <ActivityIndicator />;
  }

  return (
    <SafeAreaView className=' mt-12  h-full '>
      <View className='ml-5'>
        <Image
          source={icons.leftArrow}
          resizeMode='contain'
          style={{ width: 30, height: 30, tintColor: "#000" }}
        />
      </View>
      <ScrollView className='mb-16'>
        <View className='flex flex-row justify-center items-center mx-5 mt-5'>
          <Image
            source={{ uri: tractorDetails.image }}
            className='w-full h-72 rounded-lg'
          />
        </View>
        <View className='m-5 space-y-2'>
          <Text className='font-psemibold text-2xl '>Tractor Details</Text>
          <Text className='font-psemibold text-2xl '>
            Model: {tractorDetails.name}
          </Text>
          <Text className='text-primary font-psemibold text-2xl'>
            Price: {tractorDetails.price}
          </Text>
          <Text className='font-psemibold text-xl '>
            Location: {tractorDetails.location}
          </Text>
          <Text className=' text-xl pb-4 font-pregular'>
            Description: {tractorDetails.description}
          </Text>

          {/* Add more details as needed */}
        </View>
        <TouchableOpacity
          key={tractor.id}
          onPress={() =>
            navigation.navigate("tractor/OwnerDetails", {
              ownerData: tractorDetails.owner,
            })
          }
          activeOpacity={0.7}
          className='bg-primary rounded-md min-h-[42px] flex flex-row justify-center items-center  py-2 mx-2 mb-1 '
        >
          <Text className={`text-white font-psemibold `}>Contact Owner</Text>
        </TouchableOpacity>
        <TouchableOpacity
          key={tractor.id}
          onPress={() =>
            navigation.navigate("tractor/OwnerDetails", {
              ownerData: tractorDetails.owner,
            })
          }
          activeOpacity={0.7}
          className='bg-primary rounded-md min-h-[42px] flex flex-row justify-center items-center mt-4 py-2 mx-1 mb-1 '
        >
          <Text className={`text-white font-psemibold `}>Rent Now</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default TractorDetailsScreen;
