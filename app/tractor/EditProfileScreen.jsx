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
    <ScrollView className='px-4 mt-20 bg-primary'>
      <Text style={styles.title}>Edit Profile</Text>
      <TextInput
        style={styles.input}
        value={user.name || ""}
        onChangeText={(text) => setUser({ ...user, name: text })}
        placeholder='Name'
      />
      <TextInput
        style={styles.input}
        value={user.email || ""}
        onChangeText={(text) => setUser({ ...user, email: text })}
        placeholder='Email'
        keyboardType='email-address'
      />
      <TextInput
        style={styles.input}
        value={user.phone}
        onChangeText={(text) => setUser({ ...user, phone: text })}
        placeholder='Phone'
        keyboardType='phone-pad'
      />
      <TouchableOpacity style={styles.button} onPress={handleUpdate}>
        <Text style={styles.buttonText}>Update Profile</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",

    marginTop: 15,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default EditProfileScreen;
