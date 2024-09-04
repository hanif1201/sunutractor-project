import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { getChatRooms } from "../../lib/appwrite";

const ChatListScreen = ({ currentUserId }) => {
  const [chatRooms, setChatRooms] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    fetchChatRooms();
  }, []);

  const fetchChatRooms = async () => {
    try {
      const rooms = await getChatRooms(currentUserId);
      setChatRooms(rooms);
    } catch (error) {
      console.error("Error fetching chat rooms:", error);
    }
  };

  const navigateToChat = (chatRoomId) => {
    navigation.navigate("ChatScreen", { chatRoomId, currentUserId });
  };

  const renderChatRoom = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigateToChat(item.$id)}
      style={styles.chatRoom}
    >
      <Text>
        Chat with {item.participants.find((id) => id !== currentUserId)}
      </Text>
      <Text>{item.lastMessage}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={chatRooms}
        renderItem={renderChatRoom}
        keyExtractor={(item) => item.$id}
      />
    </View>
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
});

export default ChatListScreen;
