import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import {
  getTractorsByUser,
  getCurrentUser,
  deleteTractor,
} from "../../lib/appwrite";
import Loader from "../../components/Loader";
import { useNavigation, useRoute } from "@react-navigation/native";

import icons from "../../constants/icons";

const TractorItem = ({ tractor, onDelete }) => {
  const navigation = useNavigation();

  const handleEdit = () => {
    navigation.navigate("tractor/EditTractorDetails", {
      tractorId: tractor.$id,
    });
  };

  const handleDelete = async () => {
    try {
      await onDelete(tractor.$id);
    } catch (error) {
      console.error("Error deleting tractor:", error);
    }
  };

  return (
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
      <View className='flex flex-row justify-between items-center'>
        <TouchableOpacity
          key={tractor.id}
          onPress={handleEdit}
          activeOpacity={0.7}
          className='bg-primary rounded-md min-h-[42px] w-1/3  mt-4 py-2 mx-1 mb-1 '
        >
          <Text className={`text-white font-psemibold text-center `}>
            Edit Detail
          </Text>
          {/* <ActivityIndicator color='#fff' size='small' className='ml-2' /> */}
        </TouchableOpacity>

        {/* Delete Button */}
        <TouchableOpacity
          key={tractor.id}
          onPress={handleDelete}
          activeOpacity={0.7}
          className='bg-danger rounded-md min-h-[42px] w-1/3 mt-4 py-2 mx-1 mb-1 '
        >
          <Text className={`text-white font-psemibold text-center `}>
            Delete Tractor
          </Text>
          {/* <ActivityIndicator color='#fff' size='small' className='ml-2' /> */}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const UserTractorsScreen = () => {
  const [tractors, setTractors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const route = useRoute();

  const handleDelete = async (tractorId) => {
    try {
      await deleteTractor(tractorId);
      setTractors(tractors.filter((tractor) => tractor.$id !== tractorId));
    } catch (error) {
      console.error("Failed to delete tractor:", error);
      setError("Failed to delete tractor: " + error.message);
    }
  };

  useEffect(() => {
    const fetchTractors = async () => {
      try {
        let userId;
        if (route.params?.userId) {
          userId = route.params.userId;
        } else {
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
  }, []);

  if (loading) {
    return <Loader isLoading={loading} />;
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
      <FlatList
        data={tractors}
        renderItem={({ item }) => (
          <TractorItem tractor={item} onDelete={handleDelete} />
        )}
        keyExtractor={(item) => item.$id}
        ListEmptyComponent={<Text>No tractors found.</Text>}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 40 }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  // ... (keep your existing styles)
});

export default UserTractorsScreen;
