import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
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
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState(""); // Required for email update
  const [updating, setUpdating] = useState(false);

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const fetchedUser = await getCurrentUser();
        console.log("Fetched User:", fetchedUser); // Debugging line
        setUser(fetchedUser);
        setEmail(fetchedUser.email || ""); // Initialize state
        setUsername(fetchedUser.username || ""); // Initialize state
        setPhone(fetchedUser.phone || ""); // Initialize state
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleUpdate = async () => {
    setUpdating(true); // Start updating
    try {
      const userData = {
        email: email, // Use the current state value
        username: username, // Use the current state value
        phone: phone, // Use the current state value
      };

      console.log("Updating user with data:", userData); // Debugging line

      await updateUserProfile(userData); // Remove password parameter if not needed
      Alert.alert("Success", "User details updated successfully");
    } catch (error) {
      if (error.message.includes("email is already in use")) {
        Alert.alert(
          "Error",
          "The email address is already associated with another account."
        );
      } else {
        Alert.alert("Error", error.message);
      }
    } finally {
      setUpdating(false); // End updating
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

      <FormField
        title='Name'
        value={username} // Use state variable
        placeholder='Enter your name'
        handleChangeText={setUsername} // Update state directly
        otherStyles='mt-10'
      />
      <FormField
        title='Email'
        value={email} // Use state variable
        placeholder='Enter your email'
        handleChangeText={setEmail} // Update state directly
        keyboardType='email-address'
        otherStyles='mt-10'
      />
      <FormField
        title='Phone'
        value={phone} // Use state variable
        placeholder='Enter your phone number'
        handleChangeText={setPhone} // Update state directly
        keyboardType='phone-pad'
        otherStyles='mb-10 mt-10'
      />

      <CustomButton
        title='Update Profile'
        handlePress={handleUpdate}
        isLoading={updating}
      />
    </ScrollView>
  );
};

export default EditProfileScreen;
