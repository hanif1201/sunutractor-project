import React from "react";
import { useGlobalContext } from "../../context/GlobalProvider";
import {
  getFavoriteTractors,
  getTractorById,
  removeTractorFromFavorites,
} from "../../lib/appwrite";
import CustomButton from "../../components/CustomButton";
import {
  StyleSheet,
  Text,
  View,
  Image,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ScrollView,
} from "react-native";
import images from "../../constants/images";
import { useNavigation } from "@react-navigation/native";
import icons from "../../constants/icons";

const Favourites = () => {
  const { user, loading } = useGlobalContext();
  const [favoriteTractors, setFavoriteTractors] = React.useState([]);
  const [refreshing, setRefreshing] = React.useState(false);
  const navigation = useNavigation();
  const handleBack = () => {
    navigation.goBack();
  };

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

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await fetchFavoriteTractors();
    setRefreshing(false);
  }, [user]);

  const removeFavoriteTractor = async (tractorId) => {
    try {
      await removeTractorFromFavorites(user.$id, tractorId);

      // Update the local state to reflect the removal
      setFavoriteTractors((prevTractors) =>
        prevTractors.filter((tractor) => tractor.$id !== tractorId)
      );
    } catch (error) {
      console.error("Error removing tractor from favorites:", error);
    }
  };

  React.useEffect(() => {
    if (user) {
      fetchFavoriteTractors();
    }
  }, [user]);

  if (loading) {
    return <Text>Loading...</Text>; // Or a loading spinner
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-GM", {
      style: "currency",
      currency: "GMD",
      minimumFractionDigits: 2,
    }).format(price);
  };

  const renderTractor = ({ item }) => (
    <View className='w-full  min-h-[300px] m-1 border-grey border rounded-2xl px-2 pb-2'>
      <View className='p-1'>
        <Image
          source={{ uri: item.thumbnail }}
          className='w-full h-52 rounded-2xl '
        />
      </View>
      <View className='flex flex-row justify-between items-center pr-2'>
        <Text className='text-start mt-1 pl-1 font-pmedium text-base w-4/5'>
          {item.make} {item.model}
        </Text>
        <Text className='text-start mt-1 font-psemibold text-sm text-primary'>
          {formatPrice(item.price)}
          <Text className='text-grey font-pregular'>/day</Text>
        </Text>
      </View>

      <CustomButton
        title='BOOK NOW'
        handlePress={() =>
          navigation.navigate("tractor/[tractorId]", {
            documentId: item.$id, // Pass the document ID
          })
        }
        containerStyles=' px-4'
        // isLoading={isSubmitting}
      />

      <CustomButton
        title='REMOVE'
        handlePress={() => removeFavoriteTractor(item.$id)}
        containerStyles=' px-4 mt-2'
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View className=' mb-5 mt-5 pt-5 ml-4 flex flex-row items-center'>
        <View className='p-2 border-lightDark rounded-lg border-2'>
          <TouchableOpacity onPress={handleBack}>
            <Image
              source={icons.arrowleft}
              resizeMode='contain'
              style={{ width: 20, height: 20, tintColor: "#292D32" }}
            />
          </TouchableOpacity>
        </View>
        <Text className='font-pmedium text-lg ml-4'>Back to Home</Text>
      </View>
      <FlatList
        data={favoriteTractors}
        renderItem={renderTractor}
        keyExtractor={(item) => item.$id.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
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
              onPress={() => {
                handleBack();
              }}
              activeOpacity={0.7}
              style={styles.addButton}
            >
              <Text style={styles.addButtonText}>Add to Favourites</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingLeft: 20,
    paddingRight: 20,
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
