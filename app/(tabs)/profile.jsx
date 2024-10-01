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
        <View className='border rounded-lg border-lightDark w-full flex flex-row justify-between items-center mt-5 p-4'>
          <View className=' flex flex-row justify-between items-center'>
            <Image
              source={{ uri: user?.avatar }} // Use the avatar URL from the user object
              className='w-16 h-16 rounded-full' // Adjust size and make it circular
            />
            <View className='ml-4 space-y-1'>
              <Text className='font-psemibold text-base'>{userName}</Text>
              <Text className='font-pregular text-xs'>{email}</Text>
              <Text className='font-pregular text-sm'>+1 234 567 8900</Text>
            </View>
          </View>

          <View className='p-2 '>
            <TouchableOpacity onPress={submit}>
              <Image
                source={icons.edit}
                resizeMode='contain'
                style={{ width: 20, height: 20, tintColor: "#292D32" }}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View className='border rounded-lg border-lightDark w-full flex flex-col space-y-6 items-start mt-5 p-4'>
          {/* 000 */}
          <TouchableOpacity
            onPress={() => router.push("/tractor/UserTractorsScreen")}
          >
            <View className='flex flex-row items-center'>
              <Image
                source={icons.addcircle}
                resizeMode='contain'
                style={{ width: 25, height: 25, tintColor: "#292D32" }}
              />
              <Text className='font-pregular text-base ml-3'>My Tractors</Text>
            </View>
          </TouchableOpacity>
          {/* 000 */}
          <TouchableOpacity
            onPress={() => router.push("/tractor/UserTractorsScreen")}
          >
            <View className='flex flex-row items-center'>
              <Image
                source={icons.messageQuestion}
                resizeMode='contain'
                style={{ width: 20, height: 20, tintColor: "#292D32" }}
              />
              <Text className='font-pregular text-base ml-3'>
                Help & Support
              </Text>
            </View>
          </TouchableOpacity>
          {/* 000 */}
          <TouchableOpacity
            onPress={() => router.push("/tractor/UserTractorsScreen")}
          >
            <View className='flex flex-row items-center'>
              <Image
                source={icons.shield}
                resizeMode='contain'
                style={{ width: 20, height: 20, tintColor: "#292D32" }}
              />
              <Text className='font-pregular text-base ml-3'>
                Terms of Service
              </Text>
            </View>
          </TouchableOpacity>
          {/* 000 */}
          <TouchableOpacity
            onPress={() => router.push("/tractor/UserTractorsScreen")}
          >
            <View className='flex flex-row items-center'>
              <Image
                source={icons.infoCircle}
                resizeMode='contain'
                style={{ width: 20, height: 20, tintColor: "#292D32" }}
              />
              <Text className='font-pregular text-base ml-3'>
                Privacy Policy
              </Text>
            </View>
          </TouchableOpacity>
          {/* 000 */}
          <TouchableOpacity
            onPress={() => router.push("/tractor/UserTractorsScreen")}
          >
            <View className='flex flex-row items-center'>
              <Image
                source={icons.starr}
                resizeMode='contain'
                style={{ width: 20, height: 20, tintColor: "#292D32" }}
              />
              <Text className='font-pregular text-base ml-3'>Rate Us</Text>
            </View>
          </TouchableOpacity>
          {/* 000 */}
          <TouchableOpacity
            onPress={() => router.push("/tractor/UserTractorsScreen")}
          >
            <View className='flex flex-row items-center'>
              <Image
                source={icons.share}
                resizeMode='contain'
                style={{ width: 20, height: 20, tintColor: "#292D32" }}
              />
              <Text className='font-pregular text-base ml-3'>
                Share the App
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        <View className='flex flex-row justify-center items-center mt-5 p-4'>
          <TouchableOpacity onPress={logout}>
            <Text className='font-pregular text-base text-danger'>
              Sign Out
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default profile;
