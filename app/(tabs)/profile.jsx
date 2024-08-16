import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  Image,
} from "react-native";
import React from "react";
import images from "../../constants/images";
import icons from "../../constants/icons";

import tractor from "../../data/tractor";
import { useRoute } from "@react-navigation/native";
import CustomButton from "../../components/CustomButton";

const profile = () => {
  // const route = useRoute();
  // const tractorId = route.params.tractorId;
  // const [tractorDetails, setTractorDetails] = useState({});

  // useEffect(() => {
  //   const findTractor = tractor.find((item) => item.id === tractorId);
  //   if (findTractor) {
  //     setTractorDetails(findTractor);
  //   }
  // }, [tractorId]);

  // if (!tractorDetails) {
  //   return <ActivityIndicator />;

  // }

  const submit = () => {};
  return (
    <SafeAreaView className=' mt-12  h-full '>
      <ScrollView className='px-4'>
        <View className='flex flex-row justify-center items-center mx-20'>
          <Image source={images.john} className='w-full h-52 rounded-lg' />
        </View>
        <View>
          <Text className=' text-2xl pb-4  mt-5 font-pbold flex justify-center items-center text-center'>
            Welcome to Sunutractor, John
          </Text>
          <CustomButton
            title='Edit Profile'
            handlePress={submit}
            containerStyles='my-7'
          />
        </View>
        <View>
          {/* 001 */}
          <View className='flex flex-row justify-between border-b-2 border-primary py-2'>
            <View className='flex flex-row items-center'>
              <Text className='font-pbold bg-primary text-white rounded-lg p-1'>
                Ads
              </Text>
              <Text className='font-pbold text-lg ml-3'>My Ads</Text>
            </View>
            <View className='flex flex-row items-center'>
              <Text className='font-pbold text-lg ml-3'>8</Text>
              <Text> Ads</Text>
              <Image
                source={icons.right}
                resizeMode='contain'
                className='w-6 h-4 '
                style={{ tintColor: "#336431" }}
              />
            </View>
          </View>
          {/* 002 */}
          <View className='flex flex-row justify-between border-b-2 border-primary py-2'>
            <View className='flex flex-row items-center'>
              <Image
                source={icons.circle}
                resizeMode='contain'
                className='w-6 h-4 '
                style={{ tintColor: "#336431" }}
              />

              <Text className='font-pbold text-lg ml-3'>
                {" "}
                Contract Fulfilled
              </Text>
            </View>
            <View className='flex flex-row items-center'>
              <Text className='font-pbold text-lg ml-3'>8</Text>
              <Text> Contracts</Text>
              <Image
                source={icons.right}
                resizeMode='contain'
                className='w-6 h-4 '
                style={{ tintColor: "#336431" }}
              />
            </View>
          </View>
          {/* 003 */}
          <View className='flex flex-row justify-between border-b-2 border-primary py-2'>
            <View className='flex flex-row items-center'>
              <Text className='font-pbold bg-primary text-white rounded-lg p-1'>
                Ads
              </Text>
              <Text className='font-pbold text-lg ml-3'>My Ads</Text>
            </View>
            <View className='flex flex-row items-center'>
              <Text className='font-pbold text-lg ml-3'>8</Text>
              <Text> Ads</Text>
            </View>
          </View>
          {/* 004 */}
          <View className='flex flex-row justify-between border-b-2 border-primary py-2'>
            <View className='flex flex-row items-center'>
              <Text className='font-pbold bg-primary text-white rounded-lg p-1'>
                Ads
              </Text>
              <Text className='font-pbold text-lg ml-3'>My Ads</Text>
            </View>
            <View className='flex flex-row items-center'>
              <Text className='font-pbold text-lg ml-3'>8</Text>
              <Text> Ads</Text>
            </View>
          </View>
          {/* 005 */}
          <View className='flex flex-row justify-between border-b-2 border-primary py-2'>
            <View className='flex flex-row items-center'>
              <Image
                source={icons.question}
                resizeMode='contain'
                className='w-6 h-6 '
                style={{ tintColor: "#336431" }}
              />
              <Text className='font-pbold text-lg ml-3'>Help</Text>
            </View>
          </View>
          {/* 006 */}
          <View className='flex flex-row justify-between border-b-2 border-primary py-2'>
            <View className='flex flex-row items-center'>
              <Image
                source={icons.logout}
                resizeMode='contain'
                className='w-6 h-6'
              />
              <Text className='font-pbold text-lg ml-3'>Log Out</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default profile;
