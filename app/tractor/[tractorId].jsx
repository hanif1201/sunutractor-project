import {
  View,
  Text,
  Image,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useState, useEffect } from "react";
import icons from "../../constants/icons";
import { getTractorById, getUserById } from "../../lib/appwrite";
import { useRoute } from "@react-navigation/native";
import {
  getCurrentUser,
  getTractorCountByUser,
  findOrCreateChatRoom,
} from "../../lib/appwrite";
import { useNavigation } from "@react-navigation/native";
import CustomButton from "../../components/CustomButton";

const TractorDetailsScreen = () => {
  const navigation = useNavigation();
  const [userName, setUserName] = useState("");
  const route = useRoute();
  const [tractorDetails, setTractorDetails] = useState(null);
  const [userDetails, setUserDetails] = useState(null); // State for user details

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await getCurrentUser();
        setUserName(userData.username || "User");
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchTractorDetails = async () => {
      try {
        const tractor = await getTractorById(route.params.documentId);
        setTractorDetails(tractor);

        // Fetch user details based on the userId from tractor details
        const user = await getUserById(tractor.userId); // Use the new function
        console.log("Fetched User Details:", user); // Log the fetched user details
        setUserDetails(user); // Ensure this is set correctly
      } catch (error) {
        console.error(error);
      }
    };
    fetchTractorDetails();
  }, [route.params.documentId]);
  if (!tractorDetails) {
    return <ActivityIndicator />;
  }

  const handleBackToHome = () => {
    navigation.navigate("home");
  };

  const handleContactOwner = async () => {
    try {
      const currentUser = await getCurrentUser(); // Fetch the current user
      console.log("Current User in handleContactOwner:", currentUser); // Log the current user

      if (!currentUser) {
        throw new Error("User not authenticated");
      }

      const chatRoomId = await findOrCreateChatRoom(
        currentUser.$id,
        tractorDetails.userId
      ); // Use the current user's ID

      // Log userDetails to ensure it contains the avatar
      console.log("User Details in handleContactOwner:", userDetails);

      // Pass the owner's name and avatar URL
      navigation.navigate("tractor/ChatScreen", {
        chatRoomId,
        ownerName: userDetails.username,
        ownerAvatar: userDetails.avatar || null,
      }); // Navigate to the chat room
    } catch (error) {
      console.error("Error creating or finding chat room:", error);
      Alert.alert("Error", "Could not create or find chat room.");
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-GM", {
      style: "currency",
      currency: "GMD",
      minimumFractionDigits: 2,
    }).format(price);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {/* Fixed Header */}
      <View
        style={{
          position: "absolute",
          top: 25,
          left: 0,
          right: 0,
          zIndex: 1,
          backgroundColor: "white",
          padding: 10,
        }}
      >
        <View className='flex flex-row items-center'>
          <View className='p-2 border-lightDark rounded-lg border-2'>
            <TouchableOpacity onPress={handleBackToHome}>
              <Image
                source={icons.arrowleft}
                resizeMode='contain'
                style={{ width: 20, height: 20, tintColor: "#292D32" }}
              />
            </TouchableOpacity>
          </View>
          <Text className='font-pmedium text-lg ml-4'>Tractor Details</Text>
        </View>
      </View>

      {/* Scrollable Content */}
      <ScrollView
        contentContainerStyle={{ paddingTop: 100, paddingBottom: 100 }}
      >
        {/* Add padding to avoid overlap with the fixed header */}
        <View className='flex flex-row justify-center items-center mx-5 mt-5'>
          <Image
            source={{ uri: tractorDetails.thumbnail }}
            className='w-full h-72 rounded-lg'
          />
        </View>
        {/* <View className='flex flex-row justify-between items-center m-5'>
          <View className='flex flex-row items-center'>
            <Image
              source={{ uri: user?.avatar }} // Use the avatar URL from the user object
              className='w-10 h-10 rounded-full' // Adjust size and make it circular
            />
            <View>
              <Text className='font-psemibold text-sm'>{userName}</Text>
              <Text className='font-pregular text-xs'>verified</Text>
            </View>
          </View>
          <View>
            <Text>Hello</Text>
          </View>
        </View> */}
        <View className='m-5'>
          <View className='flex flex-row justify-between items-center  bg-[#EAFFEB] p-5'>
            <Text className='mt-1 font-pmedium text-lg '>
              {tractorDetails.make} {tractorDetails.model}
            </Text>
            <Text className='mt-1 font-psemibold text-2xl text-primary'>
              {formatPrice(tractorDetails.price)}
              <Text className='text-grey font-pregular'>/day</Text>
            </Text>
          </View>

          <Text className='text-xl py-4 font-psemibold'>SPECIFICATION</Text>
          <View className='border-lightDark border rounded px-4 py-4'>
            <Text className='font-pregular text-base'>
              • Length: 141.7 in (359.5 cm)
            </Text>
            <Text className='font-pregular text-base'>
              • Width: 72.8 in (185.0 cm)
            </Text>
            <Text className='font-pregular text-base'>
              • Height: 102.4 in (260.0 cm)
            </Text>
            <Text className='font-pregular text-base'>
              • Wheelbase: 84.6 in (214.8 cm)
            </Text>
            <Text className='font-pregular text-base'>
              • Weight: 6,260 lbs (2,835 kg)
            </Text>
            <Text className='font-pregular text-base'>
              • Payload Capacity: 2,500 lbs (1,134 kg)
            </Text>
            <Text className='font-pregular text-base'>
              • Fuel Tank Capacity: 21.1 gal (79.8 L)
            </Text>
            <Text className='font-pregular text-base'>
              • Tire Size: 12.4-24 R1
            </Text>
          </View>
        </View>
      </ScrollView>
      {/* Fixed View at the Bottom */}
      <View
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          padding: 16,

          borderTopWidth: 1,
        }}
        className='h-[70px]'
      >
        <CustomButton title='Contact Owner' handlePress={handleContactOwner} />
      </View>
    </SafeAreaView>
  );
};

export default TractorDetailsScreen;
