import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  Image, // Import Image
  TextInput,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { getChatRooms, getUserById } from "../../lib/appwrite"; // Import the function to get user by ID
import { useGlobalContext } from "../../context/GlobalProvider"; // Import the context
import CustomInput from "../../components/CustomInput";
import icons from "../../constants/icons";

const ChatListScreen = () => {
  const { user, loading } = useGlobalContext(); // Access user and loading state from context
  const [chatRooms, setChatRooms] = useState([]);
  const [usernames, setUsernames] = useState({}); // State to hold usernames
  const [avatars, setAvatars] = useState({}); // State to hold avatars
  const [error, setError] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    if (user && user.$id) {
      // Ensure user ID is available
      fetchChatRooms(user.$id); // Use user ID from context
    }
  }, [user]);

  const fetchChatRooms = async (currentUserId) => {
    if (!currentUserId) {
      console.error("Current user ID is not defined.");
      return; // Exit if user ID is not available
    }

    try {
      const rooms = await getChatRooms(currentUserId);
      setChatRooms(rooms);
      fetchUserDetails(rooms); // Fetch usernames and avatars after getting chat rooms
    } catch (error) {
      console.error("Error fetching chat rooms:", error);
      setError("Failed to load chat rooms. Please try again.");
    }
  };

  const fetchUserDetails = async (rooms) => {
    const userIds = rooms
      .flatMap((room) => room.participants)
      .filter((id) => id !== user.$id);
    const uniqueUserIds = [...new Set(userIds)]; // Get unique user IDs

    const fetchedUsernames = {};
    const fetchedAvatars = {};
    for (const id of uniqueUserIds) {
      const userData = await getUserById(id); // Fetch user data by ID
      fetchedUsernames[id] = userData.username; // Assuming userData contains a username property
      fetchedAvatars[id] = userData.avatar; // Assuming userData contains an avatar property
    }
    setUsernames(fetchedUsernames); // Set the fetched usernames
    setAvatars(fetchedAvatars); // Set the fetched avatars
  };

  const navigateToChat = (chatRoomId) => {
    navigation.navigate("tractor/ChatScreen", {
      chatRoomId,
      currentUserId: user.$id,
    });
  };

  if (loading) {
    return <ActivityIndicator size='large' color='#0000ff' />;
  }

  if (error) {
    return <Text>{error}</Text>;
  }

  if (!user) {
    return <Text>Please log in to see your chat rooms.</Text>; // Handle case when user is not logged in
  }

  return (
    <SafeAreaView className=' mt-12  h-full '>
      <View className='flex-row items-center border border-grey rounded-full p-2 mx-4'>
        <Image
          source={icons.searchnormal} // Replace with your icon source
          className='w-5 h-5 mr-2' // Adjust size and margin as needed
          style={{ tintColor: "grey" }}
        />
        <TextInput
          placeholder={"Search Messages"}
          value={""}
          // onChangeText={}
          className='flex-1 text-white' // Allow the TextInput to take the remaining space
          style={{ padding: 0, tintColor: "white" }} // Remove default padding
          placeholderTextColor='grey' // Change placeholder text color here
        />
      </View>
      <View style={styles.container}>
        <FlatList
          data={chatRooms}
          renderItem={({ item }) => {
            // Find the other participant's ID
            const otherParticipantId = item.participants.find(
              (id) => id !== user.$id
            );
            const otherParticipantName =
              usernames[otherParticipantId] || "Unknown"; // Get the username or fallback to "Unknown"
            const otherParticipantAvatar = avatars[otherParticipantId]; // Get the avatar

            return (
              <TouchableOpacity
                onPress={() =>
                  navigateToChat(
                    item.$id,
                    otherParticipantAvatar,
                    otherParticipantName
                  )
                }
                style={styles.chatRoom}
              >
                <View style={styles.chatRoomContent}>
                  {otherParticipantAvatar ? (
                    <Image
                      source={{ uri: otherParticipantAvatar }} // Use the avatar URL
                      style={styles.avatar} // Style for the avatar
                    />
                  ) : (
                    <View style={styles.avatarPlaceholder} /> // Placeholder if no avatar
                  )}
                  <View style={styles.chatText}>
                    <Text>Chat with {otherParticipantName}</Text>
                    {/* Display username instead of ID */}
                    <Text>{item.lastMessage}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          }}
          keyExtractor={(item) => item.$id}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  chatRoom: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#CCCCCC",
  },
  chatRoomContent: {
    flexDirection: "row", // Align items in a row
    alignItems: "center", // Center items vertically
  },
  avatar: {
    width: 40, // Set width for the avatar
    height: 40, // Set height for the avatar
    borderRadius: 20, // Make it circular
    marginRight: 10, // Space between avatar and text
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#CCCCCC", // Placeholder color
    marginRight: 10,
  },
  chatText: {
    flex: 1, // Allow text to take remaining space
  },
});

export default ChatListScreen;
