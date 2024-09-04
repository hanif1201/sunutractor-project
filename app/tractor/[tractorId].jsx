import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useNavigation } from "@react-navigation/native";
import { useRoute } from "@react-navigation/native";

import CustomButton from "../../components/CustomButton";
import {
  View,
  SafeAreaView,
  Text,
  Image,
  Alert,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useState, useEffect } from "react";
import icons from "../../constants/icons";
import { getTractorById, findOrCreateChatRoom } from "../../lib/appwrite";
import { useGlobalContext } from "../../context/GlobalProvider"; // Import useGlobalContext

const TractorDetailsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { tractorId } = route.params;
  const { user, isLogged } = useGlobalContext(); // Use the global context

  const [tractorDetails, setTractorDetails] = useState(null);

  useEffect(() => {
    const fetchTractorDetails = async () => {
      try {
        const tractor = await getTractorById(route.params.documentId); // Use the document ID
        setTractorDetails(tractor);
      } catch (error) {
        console.error(error);
        Alert.alert("Error", error.message);
      }
    };
    fetchTractorDetails();
  }, [route.params.documentId]);

  const handleContactOwner = async () => {
    if (!isLogged) {
      Alert.alert("Error", "You must be logged in to contact the owner.");
      return;
    }

    console.log("Current user:", JSON.stringify(user, null, 2));
    console.log("Tractor details:", JSON.stringify(tractorDetails, null, 2));

    if (!user.$id || !tractorDetails.userId) {
      console.error("Invalid user ID or owner ID");
      console.log("user.$id:", user.$id);
      console.log("tractorDetails.userId:", tractorDetails.userId);
      Alert.alert(
        "Error",
        "Unable to start chat due to missing user information."
      );
      return;
    }

    try {
      const chatRoomId = await findOrCreateChatRoom(
        user.$id,
        tractorDetails.userId
      );
      navigation.navigate("tractor/ChatScreen", {
        chatRoomId,
        currentUserId: user.$id,
      });
    } catch (error) {
      console.error("Error opening chat:", error);
      if (error.response) {
        console.error(
          "Error response:",
          JSON.stringify(error.response, null, 2)
        );
      }
      Alert.alert("Error", "Failed to open chat. Please try again.");
    }
  };
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
            source={{ uri: tractorDetails.thumbnail }}
            className='w-full h-72 rounded-lg'
          />
        </View>
        <View className='m-5 space-y-2'>
          <Text className='font-psemibold text-2xl '>Tractor Details</Text>
          <Text className='font-psemibold text-2xl '>
            Model: {tractorDetails.make} {tractorDetails.model}
          </Text>
          <Text className='text-primary font-psemibold text-2xl'>
            Price: {tractorDetails.price}
          </Text>
          <Text className='font-psemibold text-xl '>
            Location: {tractorDetails.region} {tractorDetails.district}{" "}
            {tractorDetails.village}
          </Text>
          <Text className=' text-xl pb-4 font-pregular'>
            Description: {tractorDetails.description}
          </Text>

          {/* Add more details as needed */}
        </View>
        <TouchableOpacity
          onPress={handleContactOwner}
          activeOpacity={0.7}
          className='bg-primary rounded-md min-h-[42px] flex flex-row justify-center items-center py-2 mx-2 mb-1'
        >
          <Text className='text-white font-psemibold'>Contact Owner</Text>
        </TouchableOpacity>
        <TouchableOpacity
          key={tractorDetails.id} // Use tractorDetails.id instead of tractor.id
          onPress={() => navigation.navigate("home")}
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
