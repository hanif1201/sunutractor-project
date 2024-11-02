import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  Image,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  ImageBackground,
} from "react-native";

import React, { useState, useEffect } from "react";
import CustomInput from "../../components/CustomInput";

// import heart from "../../assets/icons/heart-regular.png";
import icons from "../../constants/icons";
import images from "../../constants/images";
import { tractor } from "../../data/tractor";
import { useNavigation } from "@react-navigation/native";
import useAppwrite from "../../lib/useAppwrite";
import {
  getAllTractors,
  getTractorByMakeAndModel,
  toggleFavoriteTractor,
  getFavoriteTractors,
} from "../../lib/appwrite";
import { createRouter } from "expo-router";
import tractorImage from "../../assets/images/tractor.png"; // Adjust the path as necessary
import CustomButton from "../../components/CustomButton";
import { useGlobalContext } from "../../context/GlobalProvider"; // Adjust the path as necessary

const home = () => {
  const image = {};
  const { user, loading } = useGlobalContext(); // Access user and loading state
  // Ensure user is available before making calls that require user ID
  if (loading) {
    return <Text>Loading...</Text>; // Or some other loading indicator
  }

  if (!user) {
    return <Text>Please log in to view tractors.</Text>; // Handle unauthenticated state
  }

  const [favoriteTractors, setFavoriteTractors] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [searchResult, setSearchResult] = useState(null); // State for search result
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();
  const [activeCategory, setActiveCategory] = useState("All"); // State for active category
  const [tractors, setTractors] = useState([]);

  const handlePress = (id) => {
    navigation.navigate("TractorDetailsScreen", { id });
  };
  useEffect(() => {
    fetchTractors();
  }, []);

  const fetchTractors = async () => {
    try {
      const data = await getAllTractors();
      setTractors(data);
    } catch (error) {
      console.error("Error fetching tractors:", error);
      Alert.alert("Error", "Failed to load tractors.");
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchTractors();
    setRefreshing(false);
  };

  const categories = [
    "All",
    "Agricultural tractors",
    "Industrial tractors",
    "Garden tractors",
    "Rotary tillers",
    "Compact tractors",
    "Row crop tractors",
    "Orchard tractors",
    "Loader tractors",
  ];
  const handleCategoryPress = (category) => {
    setActiveCategory(category); // Set the active category
  };

  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (query.trim() === "") {
      setSearchResult(null);
      return;
    }

    // Split the query into make and model
    const [make, model] = query.split(" ").map((str) => str.trim());

    try {
      const tractor = await getTractorByMakeAndModel(make, model);
      setSearchResult(tractor);
    } catch (error) {
      console.error("Error searching for tractor:", error);
      setSearchResult(null);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-GM", {
      style: "currency",
      currency: "GMD",
      minimumFractionDigits: 2,
    }).format(price);
  };

  const filteredTractors =
    activeCategory === "All"
      ? tractors
      : tractors.filter((tractor) => tractor.category === activeCategory);

  useEffect(() => {
    const fetchFavoriteTractors = async () => {
      try {
        const favorites = await getFavoriteTractors(user.$id);
        setFavoriteTractors(favorites);
      } catch (error) {
        console.error("Error fetching favorite tractors:", error);
      }
    };

    fetchFavoriteTractors();
  }, [user]);

  const toggleFavorite = async (tractorId) => {
    try {
      await toggleFavoriteTractor(user.$id, tractorId);
      const updatedFavorites = await getFavoriteTractors(user.$id);
      setFavoriteTractors(updatedFavorites);
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  return (
    <SafeAreaView className=' mt-6  h-full '>
      <View className='border-b border-grey'>
        <View
          className='bg-primary pt-6 px-4 pb-6 rounded-b-3xl'
          // style={{ borderBottomWidth: 1, borderBottomColor: "black" }}
        >
          <View className=' w-full  '>
            <View className='flex flex-row justify-between items-center mb-4 mt-4'>
              <View className='flex flex-row items-center gap-2'>
                <View className='p-2 border-lightDark rounded-lg border-2'>
                  <Image
                    source={icons.location1}
                    resizeMode='contain'
                    className='w-2 h-2 p-3 text-white'
                    style={{ tintColor: "white" }} // Change the tint color here
                  />
                </View>
                <View>
                  <Text className='text-base font-pregular text-white'>
                    Your Location
                  </Text>
                  <Text className='text-base font-psemibold text-white'>
                    Gambia, Africa
                  </Text>
                </View>
              </View>
              <View>
                <View className='p-2 border-lightDark rounded-full border-2'>
                  <Image
                    source={icons.notification}
                    resizeMode='contain'
                    className='w-2 h-2 p-3'
                    style={{ tintColor: "white" }}
                  />
                </View>
              </View>
            </View>
            <View className='py-4'>
              <CustomInput
                placeholder='Search Tractor...'
                value={searchQuery}
                onChangeText={handleSearch} // Handle input change
              />
            </View>
          </View>
        </View>
        <View className='flex flex-row justify-between mt-6 px-4'>
          <Text className='text-base font-psemibold'> Tractor Categories</Text>
        </View>

        {/* Horizontal ScrollView for Categories */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className='my-4 px-4'
        >
          {categories.map((category, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handleCategoryPress(category)}
              className={`flex-row items-center mr-4 p-2 rounded-lg text-sm font-pregular ${
                activeCategory === category
                  ? " rounded-full border-primary border bg-primary text-white "
                  : " "
              }`} // Change background color based on active state
            >
              <Text className='text-base font-pregular'>{category}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView
        className='px-4'
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View className='flex flex-row flex-wrap justify-around mt-4 mb-40'>
          {searchResult ? (
            <View className='w-full min-h-[300px] m-1 border-grey border rounded-2xl'>
              <View className='p-1'>
                <View style={{ position: "relative" }}>
                  <Image
                    source={{ uri: searchResult.thumbnail }}
                    className='w-full h-52 rounded-2xl'
                  />
                  <TouchableOpacity
                    onPress={() => toggleFavorite(searchResult.$id)}
                    style={{
                      position: "absolute",
                      bottom: 10, // Adjust as needed
                      left: 10, // Adjust as needed
                      backgroundColor: "white",
                      borderRadius: 30, // Half of the width/height to make it circular
                      padding: 10, // Adjust padding to ensure the icon fits well
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Image
                      source={
                        favoriteTractors.includes(searchResult.$id)
                          ? icons.favoriteFilled
                          : icons.favoriteOutline
                      }
                      resizeMode='contain'
                      style={{ width: 25, height: 25, tintColor: "#FFC700" }}
                    />
                  </TouchableOpacity>
                </View>
              </View>
              <View className='flex flex-row justify-between items-center pr-2'>
                <Text className='text-start mt-1 pl-1 font-pmedium text-base w-4/5'>
                  {searchResult.make} {searchResult.model}
                </Text>
                <Text className='text-start mt-1 font-psemibold text-sm text-primary '>
                  {formatPrice(searchResult.price)}
                  <Text className='text-grey font-pregular'>/day</Text>
                </Text>
              </View>
              <View className='flex flex-row justify-between items-center pr-2 mt-4 pb-4'>
                <View className='flex flex-row '>
                  <Image
                    source={icons.location1}
                    resizeMode='contain'
                    className='w-1 h-1 p-3 text-white'
                    style={{ tintColor: "grey" }}
                  />
                  <Text className='text-start mt-1 pl-1 font-pmedium text-base '>
                    {searchResult.district}
                  </Text>
                </View>
                <View className='flex flex-row '>
                  <Image
                    source={icons.document}
                    resizeMode='contain'
                    className='w-1 h-1 p-3 text-white'
                    style={{ tintColor: "grey" }}
                  />
                  <Text className='text-start mt-1 pl-1 font-pmedium text-base '>
                    manual
                  </Text>
                </View>
                <View className='flex flex-row '>
                  <CustomButton
                    title='BOOK NOW'
                    handlePress={() =>
                      navigation.navigate("tractor/[tractorId]", {
                        documentId: searchResult.$id,
                      })
                    }
                    containerStyles=' px-4'
                  />
                </View>
              </View>
            </View>
          ) : (
            filteredTractors.map((tractor, index) => (
              <View
                key={index}
                className='w-full  min-h-[300px] m-1 border-grey border rounded-2xl'
              >
                <View className='p-1'>
                  <View style={{ position: "relative" }}>
                    <Image
                      source={{ uri: tractor.thumbnail }}
                      className='w-full h-52 rounded-2xl'
                    />
                    <TouchableOpacity
                      onPress={() => toggleFavorite(tractor.$id)}
                      style={{
                        position: "absolute",
                        bottom: 10, // Adjust as needed
                        left: 10, // Adjust as needed
                        backgroundColor: "white",
                        borderRadius: 30, // Half of the width/height to make it circular
                        padding: 10, // Adjust padding to ensure the icon fits well
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Image
                        source={
                          favoriteTractors.includes(tractor.$id)
                            ? icons.favoriteFilled
                            : icons.favoriteOutline
                        }
                        resizeMode='contain'
                        style={{ width: 25, height: 25, tintColor: "#FFC700" }}
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                <View className='flex flex-row justify-between items-center pr-2'>
                  <Text className='text-start mt-1 pl-1 font-pmedium text-base w-4/5'>
                    {tractor.make} {tractor.model}
                  </Text>

                  <Text className='text-start mt-1 font-psemibold text-sm text-primary'>
                    {formatPrice(tractor.price)}
                    <Text className='text-grey font-pregular'>/day</Text>
                  </Text>
                </View>
                <View className='flex flex-row justify-between items-center pr-2 mt-4 pb-4'>
                  <View className='flex flex-row '>
                    <Image
                      source={icons.location1}
                      resizeMode='contain'
                      className='w-1 h-1 p-3 text-white'
                      style={{ tintColor: "grey" }} // Change the tint color here
                    />
                    <Text className='text-start mt-1 pl-1 font-pmedium text-base '>
                      {tractor.district}
                    </Text>
                  </View>

                  <View className='flex flex-row '>
                    <Image
                      source={icons.document}
                      resizeMode='contain'
                      className='w-1 h-1 p-3 text-white'
                      style={{ tintColor: "grey" }} // Change the tint color here
                    />
                    <Text className='text-start mt-1 pl-1 font-pmedium text-base '>
                      manual
                    </Text>
                  </View>

                  <View className='flex flex-row '>
                    <CustomButton
                      title='BOOK NOW'
                      handlePress={() =>
                        navigation.navigate("tractor/[tractorId]", {
                          documentId: tractor.$id, // Pass the document ID
                        })
                      }
                      containerStyles=' px-4'
                      // isLoading={isSubmitting}
                    />
                  </View>
                </View>

                {/* <TouchableOpacity
                key={tractor.id}
                onPress={() =>
                  navigation.navigate("tractor/[tractorId]", {
                    documentId: tractor.$id, // Pass the document ID
                  })
                }
                activeOpacity={0.7}
                className='bg-primary rounded-md min-h-[42px] flex flex-row justify-center items-center mt-4 py-2 mx-1 mb-1 '
              >
                <Text className={`text-white font-psemibold `}>
                  Check Detail
                </Text>
                <ActivityIndicator color='#fff' size='small' className='ml-2' />
              </TouchableOpacity> */}
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default home;
