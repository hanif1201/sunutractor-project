import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import { getTractorsByUser, getCurrentUser } from "../../lib/appwrite";
import icons from "../../constants/icons";

const TractorItem = ({ tractor }) => (
  <View className='w-full  min-h-[300px] m-1 border-black border-2'>
    <Image
      source={{ uri: tractor.thumbnail }}
      className='w-full h-52 rounded'
    />
    <View className='flex flex-row justify-between items-center pr-2'>
      <Text className='text-start mt-1 font-psemibold text-lg w-4/5'>
        {tractor.make} {tractor.model}
      </Text>
      <Image
        source={icons.heart}
        resizeMode='contain'
        style={{ width: 24, height: 24, tintColor: "#000" }}
      />
    </View>
    <View>
      <Text className='text-start mt-1 font-pbold text-sm'>
        {tractor.price}/hr
      </Text>
    </View>
    <View className='flex flex-row items-center'>
      <Image
        source={icons.location}
        resizeMode='contain'
        style={{ width: 16, height: 16, tintColor: "#000" }}
      />
      <Text className='text-start mt-1 font-pbold text-sm'>
        {tractor.region}
        {tractor.district}
        {tractor.village}
      </Text>
    </View>
    <TouchableOpacity
      key={tractor.id}
      onPress={() =>
        navigation.navigate("tractor/[tractorId]", {
          documentId: tractor.$id, // Pass the document ID
        })
      }
      activeOpacity={0.7}
      className='bg-primary rounded-md min-h-[42px] flex flex-row justify-center items-center mt-4 py-2 mx-1 mb-1 '
    >
      <Text className={`text-white font-psemibold `}>Check Detail</Text>
      {/* <ActivityIndicator color='#fff' size='small' className='ml-2' /> */}
    </TouchableOpacity>
  </View>
);

const UserTractorsScreen = ({ route }) => {
  const [tractors, setTractors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTractors = async () => {
      try {
        let userId;
        if (route && route.params && route.params.userId) {
          userId = route.params.userId;
        } else {
          // If userId is not provided in route params, get the current user's ID
          const currentUser = await getCurrentUser();
          if (!currentUser) {
            throw new Error("User not authenticated");
          }
          userId = currentUser.$id;
        }

        const userTractors = await getTractorsByUser(userId);
        setTractors(userTractors);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTractors();
  }, [route]);

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (error) {
    return <Text>Error: {error}</Text>;
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
      <Text className='text-2xl text-primary font-psemibold mt-4 text-center'>
        My Listed Tractors
      </Text>
      <View style={styles.container}>
        <FlatList
          data={tractors}
          renderItem={({ item }) => <TractorItem tractor={item} />}
          keyExtractor={(item) => item.$id}
          ListEmptyComponent={<Text>No tractors found.</Text>}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  // ... (keep your existing styles)
});

export default UserTractorsScreen;
