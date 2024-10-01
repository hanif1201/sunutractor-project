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
import CustomButton from "../../components/CustomButton";
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
    <View className='w-full  min-h-[300px] m-1 border-grey border rounded-2xl'>
      <View className='p-1'>
        <Image
          source={{ uri: tractor.thumbnail }}
          className='w-full h-52 rounded-2xl '
        />
      </View>
      <View className='flex flex-row justify-between items-center pr-2'>
        <Text className='text-start mt-1 pl-1 font-pmedium text-base w-4/5'>
          {tractor.make} {tractor.model}
        </Text>
        <Text className='text-start mt-1 font-psemibold text-sm text-primary'>
          {tractor.price} UGS
          <Text className='text-grey font-pregular'>/day</Text>
        </Text>
      </View>

      <CustomButton
        title='Edit tractor'
        containerStyles='mt-7 mb-4 mx-3'
        handlePress={handleEdit}
      />
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
      <View className='ml-5 mb-5 flex flex-row items-center'>
        <View className='p-2 border-lightDark rounded-lg border-2'>
          <Image
            source={icons.arrowleft}
            resizeMode='contain'
            style={{ width: 20, height: 20, tintColor: "#292D32" }}
          />
        </View>
        <Text className='font-pmedium text-lg ml-4'>My tractors</Text>
      </View>
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
