import React from "react";
import { useGlobalContext } from "../../context/GlobalProvider";
import { getFavoriteTractors, getTractorById } from "../../lib/appwrite";
import {
  StyleSheet,
  Text,
  View,
  Image,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
} from "react-native";
import images from "../../constants/images";

const Favourites = () => {
  const { user, loading } = useGlobalContext();
  const [favoriteTractors, setFavoriteTractors] = React.useState([]);

  React.useEffect(() => {
    if (user) {
      const fetchFavoriteTractors = async () => {
        try {
          const tractorIds = await getFavoriteTractors(user.$id);
          console.log("Fetched Tractor IDs:", tractorIds); // Debugging line

          const tractors = await Promise.all(
            tractorIds.map(async (id) => {
              const tractor = await getTractorById(id);
              console.log("Fetched Tractor:", tractor); // Debugging line
              return tractor;
            })
          );

          setFavoriteTractors(tractors);
          console.log("Favorite Tractors:", tractors); // Debugging line
        } catch (error) {
          console.error("Error fetching favorite tractors:", error);
        }
      };

      fetchFavoriteTractors();
    }
  }, [user]);

  if (loading) {
    return <Text>Loading...</Text>; // Or a loading spinner
  }

  const renderTractor = ({ item }) => (
    <View style={styles.tractorItem}>
      <Text style={styles.tractorName}>
        {item.make} {item.model}
      </Text>
      <Image source={{ uri: item.thumbnail }} style={styles.tractorImage} />
      <Text style={styles.tractorDetails}>Price: ${item.price}</Text>
      <Text style={styles.tractorDetails}>
        Location: {item.village}, {item.district}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {favoriteTractors.length === 0 ? (
        <View style={styles.emptyState}>
          <Image
            source={images.nothingHere}
            resizeMode='contain'
            style={styles.emptyImage}
          />
          <Text style={styles.emptyText}>Add to Favourites</Text>
          <Text style={styles.emptySubText}>
            Make it easy to find the tractors that matter most
          </Text>
          <TouchableOpacity
            onPress={() => {}}
            activeOpacity={0.7}
            style={styles.addButton}
          >
            <Text style={styles.addButtonText}>Add to Favourites</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={favoriteTractors}
          renderItem={renderTractor}
          keyExtractor={(item) => item.$id.toString()}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  tractorItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  tractorName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  tractorImage: {
    width: 100,
    height: 100,
    marginVertical: 10,
  },
  tractorDetails: {
    fontSize: 14,
    color: "#555",
  },
  emptyState: {
    paddingHorizontal: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyImage: {
    width: 270,
    height: 216,
  },
  emptyText: {
    fontSize: 18,
    textAlign: "center",
    color: "#424242",
  },
  emptySubText: {
    fontSize: 14,
    textAlign: "center",
    color: "#424242",
    marginTop: 8,
  },
  addButton: {
    borderRadius: 5,
    padding: 12,
    alignItems: "center",
    margin: 16,
  },
  addButtonText: {
    color: "#007BFF",
    fontSize: 14,
  },
});

export default Favourites;
