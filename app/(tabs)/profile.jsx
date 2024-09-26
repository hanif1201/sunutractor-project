import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import React, { useState, useEffect } from "react";
import { router } from "expo-router";
import images from "../../constants/images";
import icons from "../../constants/icons";
import { signOut } from "../../lib/appwrite";
import { useGlobalContext } from "../../context/GlobalProvider";
import { getCurrentUser, getTractorCountByUser } from "../../lib/appwrite";
import { useNavigation } from "@react-navigation/native";

import tractor from "../../data/tractor";
import { useRoute } from "@react-navigation/native";
import CustomButton from "../../components/CustomButton";

const profile = () => {
  const navigation = useNavigation();
  const { user, setUser, setIsLogged } = useGlobalContext();
  const [tractorCount, setTractorCount] = useState(0);
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await getCurrentUser();
        setUserName(userData.username || "User");
        setEmail(userData.email || "Email");
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchTractorCount = async () => {
      try {
        const user = await getCurrentUser();
        if (user) {
          const count = await getTractorCountByUser(user.$id);
          setTractorCount(count);
        }
      } catch (error) {
        console.error("Error fetching tractor count:", error);
      }
    };

    fetchTractorCount();
  }, []);

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
  const logout = async () => {
    await signOut();
    setUser(null);
    setIsLogged(false);

    router.replace("/sign-in");
  };

  const submit = () => {
    router.push("/tractor/EditProfileScreen");
  };
  return (
    <SafeAreaView className=' mt-12  h-full '>
      <ScrollView className='px-4'>
        <Text className='font-pmedium text-lg text-center'>My Account</Text>
        <View className='border border-primary w-full flex flex-row'>
          <View className=' '>
            <Image
              source={{ uri: user?.avatar }} // Use the avatar URL from the user object
              className='w-16 h-16 rounded-full' // Adjust size and make it circular
            />
          </View>
          <View>
            <Text>{userName}</Text>
            <Text>{email}</Text>
            <Text>+1 234 567 8900</Text>
          </View>
          <View className='p-2 '>
            <Image
              source={icons.arrowleft}
              resizeMode='contain'
              style={{ width: 20, height: 20, tintColor: "#292D32" }}
            />
          </View>
        </View>
        <View className='flex flex-row r mx-20'>
          <Image
            source={{ uri: user?.avatar }} // Use the avatar URL from the user object
            className='w-24 h-24 rounded-full' // Adjust size and make it circular
          />
        </View>
        <View>
          <Text className=' text-2xl pb-4  mt-5 font-pbold flex justify-center items-center text-center'>
            Welcome to Sunutractor, {userName}
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate("tractor/EditProfileScreen")}
            activeOpacity={0.7}
            className='bg-primary rounded-md min-h-[42px] flex flex-row justify-center items-center mt-4 py-2 mx-1 mb-1 '
          >
            <Text className={`text-white font-psemibold `}>Edit Profile</Text>
          </TouchableOpacity>
        </View>
        <View>
          {/* 001 */}
          <TouchableOpacity
            onPress={() => router.push("/tractor/UserTractorsScreen")}
          >
            <View className='flex flex-row justify-between border-b-2 border-primary py-2'>
              <View className='flex flex-row items-center'>
                <Text className='font-pbold bg-primary text-white rounded-lg p-1'>
                  Ads
                </Text>
                <Text className='font-pbold text-lg ml-3'>My Tractors</Text>
              </View>
              <View className='flex flex-row items-center'>
                <Text className='font-pbold text-lg ml-3'>{tractorCount}</Text>
                <Text> Ads</Text>
                <Image
                  source={icons.right}
                  resizeMode='contain'
                  className='w-6 h-4 '
                  style={{ tintColor: "#336431" }}
                />
              </View>
            </View>
          </TouchableOpacity>

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
              <Text className='font-pbold text-lg ml-3'>{tractorCount}</Text>
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
          <TouchableOpacity onPress={logout}>
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
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default profile;
