import { Stack, useLocalSearchParams, useRouter } from "expo-router";

import { useRoute } from "@react-navigation/native";
import {
  View,
  SafeAreaView,
  Text,
  Image,
  StyleSheet,
  Pressable,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect } from "react";
import icons from "../../constants/icons";
import { tractor } from "../../data/tractor";

const TractorDetailsScreen = () => {
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
      <View>
        <Text>Tractor Details</Text>
        <Text>Model: {tractorDetails.model}</Text>
        <Text>Year: {tractorDetails.year}</Text>
        <Text>Price: {tractorDetails.price}</Text>
        {/* Add more details as needed */}
      </View>
    </SafeAreaView>
  );
};

export default TractorDetailsScreen;

const styles = StyleSheet.create({});
