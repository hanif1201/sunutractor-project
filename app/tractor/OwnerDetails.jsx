import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  SafeAreaView,
  ScrollView,
} from "react-native";
import icons from "../../constants/icons";
import { useRoute } from "@react-navigation/native";

const OwnerDetails = () => {
  const route = useRoute();

  const { ownerData } = route.params;

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
            source={{ uri: ownerData.image }}
            className='w-full h-72 rounded-lg'
          />
        </View>
        <View className='m-5 space-y-2'>
          {/* <Text className='font-psemibold text-2xl '>Tractor Details</Text> */}
          <Text className='font-psemibold text-2xl '>
            Name: {ownerData.name}
          </Text>
          <Text className='text-primary font-psemibold text-2xl'>
            Fulfilled Contract: {ownerData.contract}
          </Text>
          {/* <Text className='font-psemibold text-xl '>
            Location: {tractorDetails.location}
          </Text> */}
          <Text className=' text-xl pb-4 font-pregular'>
            Ads: {ownerData.ads}
          </Text>
          <Text className=' text-xl pb-4 font-pregular'>
            Tel No: +1 8080808080
          </Text>
          <Text className=' text-xl pb-4 font-pregular'>
            Email Address: Ab@gmail.com
          </Text>

          {/* Add more details as needed */}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
});

export default OwnerDetails;
