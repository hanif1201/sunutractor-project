import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { getTractor, updateTractor } from "../../lib/appwrite";
import { useNavigation, useRoute } from "@react-navigation/native";

const EditTractorScreen = () => {
  const [tractor, setTractor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigation = useNavigation();
  const route = useRoute();

  useEffect(() => {
    const fetchTractor = async () => {
      try {
        const tractorId = route.params?.tractorId;
        if (!tractorId) {
          throw new Error("No tractor ID provided");
        }
        const fetchedTractor = await getTractor(tractorId);
        setTractor(fetchedTractor);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTractor();
  }, []);
  const handleUpdate = async () => {
    try {
      const tractorId = route.params?.tractorId;
      if (!tractor || !tractorId) {
        throw new Error("No tractor data or ID available");
      }
      // Remove $databaseId and other Appwrite-specific fields before updating
      const {
        $id,
        $createdAt,
        $updatedAt,
        $permissions,
        $databaseId,
        $collectionId,
        ...updateData
      } = tractor;
      await updateTractor(tractorId, updateData);
      navigation.goBack();
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error}</Text>;
  if (!tractor) return <Text>No tractor found</Text>;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Edit Tractor</Text>
      <TextInput
        style={styles.input}
        value={tractor.make}
        onChangeText={(text) => setTractor({ ...tractor, make: text })}
        placeholder='Make'
      />
      <TextInput
        style={styles.input}
        value={tractor.model}
        onChangeText={(text) => setTractor({ ...tractor, model: text })}
        placeholder='Model'
      />
      <TextInput
        style={styles.input}
        value={tractor.price}
        onChangeText={(text) => setTractor({ ...tractor, price: text })}
        placeholder='Price'
        keyboardType='numeric'
      />
      <TextInput
        style={styles.input}
        value={tractor.region}
        onChangeText={(text) => setTractor({ ...tractor, region: text })}
        placeholder='Region'
      />
      <TextInput
        style={styles.input}
        value={tractor.district}
        onChangeText={(text) => setTractor({ ...tractor, district: text })}
        placeholder='District'
      />
      <TextInput
        style={styles.input}
        value={tractor.village}
        onChangeText={(text) => setTractor({ ...tractor, village: text })}
        placeholder='Village'
      />
      <TouchableOpacity style={styles.button} onPress={handleUpdate}>
        <Text style={styles.buttonText}>Update Tractor</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default EditTractorScreen;
