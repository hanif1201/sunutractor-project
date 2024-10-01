import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import Loader from "../../components/Loader";
import { getTractor, updateTractor, uploadFile } from "../../lib/appwrite";
import { useNavigation, useRoute } from "@react-navigation/native";
import FormField from "../../components/FormField";
import CustomButton from "../../components/CustomButton";
import * as DocumentPicker from "expo-document-picker";
import icons from "../../constants/icons";

const EditTractorScreen = () => {
  const [tractor, setTractor] = useState(null);
  const [newImage, setNewImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const navigation = useNavigation();
  const route = useRoute();

  useEffect(() => {
    const fetchTractor = async () => {
      try {
        const tractorId = route.params?.tractorId;
        if (!tractorId) throw new Error("No tractor ID provided");
        const fetchedTractor = await getTractor(tractorId);

        setTractor(fetchedTractor);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTractor();
  }, [route.params?.tractorId]);

  const handleImagePick = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "image/*",
        copyToCacheDirectory: false,
      });

      if (!result.canceled) {
        setNewImage(result.assets[0]);
      }
    } catch (err) {
      Alert.alert(
        "Error",
        "Failed to pick image. Please check your internet connection and try again. Error: " +
          err.message
      );
    }
  };

  const handleUpdate = async () => {
    setIsUpdating(true);
    try {
      const tractorId = route.params?.tractorId;
      if (!tractor || !tractorId) {
        throw new Error("No tractor data or ID available");
      }
      const {
        $id,
        $createdAt,
        $updatedAt,
        $permissions,
        $databaseId,
        $collectionId,
        ...updateData
      } = tractor;

      // Upload new image if changed
      if (newImage) {
        try {
          const thumbnailUrl = await uploadFile(newImage, "image");

          updateData.thumbnail = thumbnailUrl;
        } catch (uploadError) {
          Alert.alert(
            "Upload Error",
            "Failed to upload new image. The tractor will be updated without changing the image. Error: " +
              uploadError.message
          );
          // Don't throw the error, continue with the update without changing the image
        }
      } else {
      }

      const updatedTractor = await updateTractor(tractorId, updateData);

      navigation.goBack();
    } catch (err) {
      setError(err.message);
      Alert.alert(
        "Update Error",
        "Failed to update tractor. Please check your internet connection and try again. Error: " +
          err.message
      );
    } finally {
      setIsUpdating(false);
    }
  };
  if (loading) return <Loader isLoading={loading} />;
  if (error) return <Text>Error: {error}</Text>;
  if (!tractor) return <Text>No tractor found</Text>;

  return (
    <ScrollView className='px-4 mt-12 '>
      <View className='ml-5 mb-5 flex flex-row items-center'>
        <View className='p-2 border-lightDark rounded-lg border-2'>
          <Image
            source={icons.arrowleft}
            resizeMode='contain'
            style={{ width: 20, height: 20, tintColor: "#292D32" }}
          />
        </View>
        <Text className='font-pmedium text-lg ml-4'>Edit tractor details</Text>
      </View>

      <TouchableOpacity onPress={handleImagePick} className='mb-4'>
        {newImage?.uri || tractor.thumbnail ? (
          <Image
            source={{ uri: newImage?.uri || tractor.thumbnail }}
            className='w-full h-48 rounded-lg'
            resizeMode='cover'
          />
        ) : (
          <View className='w-full h-48 bg-gray-300 rounded-lg flex items-center justify-center'>
            <Text>Tap to add image</Text>
          </View>
        )}
      </TouchableOpacity>

      <FormField
        title='Make'
        value={tractor.make}
        placeholder='Enter make'
        handleChangeText={(text) => setTractor({ ...tractor, make: text })}
        otherStyles='mt-'
      />
      <FormField
        title='Model'
        value={tractor.model}
        placeholder='Enter model'
        handleChangeText={(text) => setTractor({ ...tractor, model: text })}
        otherStyles='mt-4'
      />
      <FormField
        title='Price'
        value={tractor.price}
        placeholder='Enter price'
        handleChangeText={(text) => setTractor({ ...tractor, price: text })}
        keyboardType='numeric'
        otherStyles='mt-4'
      />
      <FormField
        title='Region'
        value={tractor.region}
        placeholder='Enter region'
        handleChangeText={(text) => setTractor({ ...tractor, region: text })}
        otherStyles='mt-4'
      />
      <FormField
        title='District'
        value={tractor.district}
        placeholder='Enter district'
        handleChangeText={(text) => setTractor({ ...tractor, district: text })}
        otherStyles='mt-4'
      />
      <FormField
        title='Village'
        value={tractor.village}
        placeholder='Enter village'
        handleChangeText={(text) => setTractor({ ...tractor, village: text })}
        otherStyles='mt-4 mb-10'
      />
      <CustomButton
        title='Update Tractor'
        handlePress={handleUpdate}
        isLoading={isUpdating}
        otherStyles='mb-4'
      />
      <View className='flex flex-row justify-center items-center mt-2 p-4'>
        <TouchableOpacity>
          <Text className='font-pregular text-base text-danger'>
            Delete Tractor
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default EditTractorScreen;
