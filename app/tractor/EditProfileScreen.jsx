import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import {
  getUser,
  updateUser,
  getCurrentUser,
  updateUserProfile,
} from "../../lib/appwrite";
import FormField from "../../components/FormField";
import CustomButton from "../../components/CustomButton";
import { useRouter } from "expo-router";

import { useNavigation } from "@react-navigation/native";
import Loader from "../../components/Loader";

const EditProfileScreen = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const fetchedUser = await getCurrentUser();
        setUser(fetchedUser);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleUpdate = async () => {
    try {
      if (!user) {
        throw new Error("No user data available");
      }
      await updateUserProfile(user);
      router.back();
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <Loader isLoading={loading} />;
  if (error)
    return (
      <ScrollView className='px-4 mt-20 bg-primary'>
        <Text>Error: {error}</Text>
      </ScrollView>
    );
  if (!user)
    return (
      <ScrollView className='px-4 mt-20 bg-primary'>
        <Text>No user found</Text>
      </ScrollView>
    );

  return (
    <ScrollView className='px-4 mt-20'>
      <Text className='text-2xl text-primary font-psemibold mt-4 text-center'>
        Edit your Profile
      </Text>
      {/* <FormField
                title='Operator Name'
                value={form.operatorName}
                placeholder="Kindly fill in the Operator's name"
                handleChangeText={(e) => setForm({ ...form, operatorName: e })}
        otherStyles='mt-10'
      /> */}

      <FormField
        title='Name'
        value={user.username || ""}
        placeholder='Enter your name'
        handleChangeText={(text) => setUser({ ...user, name: text })}
        otherStyles='mt-10'
      />
      <FormField
        title='Email'
        value={user.email || ""}
        placeholder='Enter your email'
        handleChangeText={(text) => setUser({ ...user, email: text })}
        keyboardType='email-address'
        otherStyles='mt-10'
      />
      <FormField
        title='Phone'
        value={user.phone || ""}
        placeholder='Enter your phone number'
        handleChangeText={(text) => setUser({ ...user, phone: text })}
        keyboardType='phone-pad'
        otherStyles='mb-10 mt-10'
      />
      <CustomButton
        title='Update Profile'
        handlePress={handleUpdate}
        isLoading={false} // Add a state variable if you want to show loading state
      />
    </ScrollView>
  );
};

export default EditProfileScreen;
