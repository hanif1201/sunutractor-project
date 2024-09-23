import {
  View,
  Text,
  Image,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect } from "react";
import icons from "../../constants/icons";
import { getTractorById } from "../../lib/appwrite";
import { useRoute } from "@react-navigation/native";

const TractorDetailsScreen = () => {
  const route = useRoute();
  const [tractorDetails, setTractorDetails] = useState(null);

  useEffect(() => {
    const fetchTractorDetails = async () => {
      try {
        const tractor = await getTractorById(route.params.documentId);
        setTractorDetails(tractor);
      } catch (error) {
        console.error(error);
      }
    };
    fetchTractorDetails();
  }, [route.params.documentId]);

  if (!tractorDetails) {
    return <ActivityIndicator />;
  }

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
            <Image
              source={icons.arrowleft}
              resizeMode='contain'
              style={{ width: 30, height: 30, tintColor: "#292D32" }}
            />
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
        <View className='m-5'>
          <View className='flex flex-row justify-around items-center mx-4'>
            <Text className='mt-1 font-pmedium text-base w-4/5'>
              {tractorDetails.make} {tractorDetails.model}
            </Text>
            <Text className='mt-1 font-psemibold text-2xl text-primary'>
              {tractorDetails.price} UGS
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
      </ScrollView>
      {/* Fixed View at the Bottom */}
      <View
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          padding: 16,
          backgroundColor: "white",
          borderTopWidth: 1,
          borderTopColor: "gray",
        }}
      >
        <Text style={{ textAlign: "center" }}>Fixed Bottom View</Text>
      </View>
    </SafeAreaView>
  );
};

export default TractorDetailsScreen;
