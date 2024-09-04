import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { getMessages, sendMessage } from "../../lib/appwrite";
import { useGlobalContext } from "../../context/GlobalProvider"; // Import useGlobalContext
import { useNavigation, useRoute } from "@react-navigation/native"; // Import useRoute

const ChatScreen = () => {
  const route = useRoute(); // Get the route object
  const { chatRoomId, currentUserId } = route.params; // Access params from route
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const { user } = useGlobalContext();

  console.log("Current User:", user); // Log the user object

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const fetchedMessages = await getMessages(user.$id, chatRoomId);
      setMessages(fetchedMessages);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const handleSend = async () => {
    if (inputMessage.trim() === "") return;
    try {
      await sendMessage(user.$id, chatRoomId, inputMessage);
      setInputMessage("");
      fetchMessages(); // Fetch messages again to update the list
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const renderMessage = ({ item }) => (
    <View
      style={
        item.senderId === user.$id ? styles.sentMessage : styles.receivedMessage
      }
    >
      <Text>{item.content}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.$id}
        inverted
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={inputMessage}
          onChangeText={setInputMessage}
          placeholder='Type a message...'
        />
        <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
          <Text>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sentMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#DCF8C6",
    padding: 10,
    margin: 5,
    borderRadius: 10,
  },
  receivedMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#FFFFFF",
    padding: 10,
    margin: 5,
    borderRadius: 10,
  },
  inputContainer: {
    flexDirection: "row",
    padding: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#CCCCCC",
    borderRadius: 20,
    paddingHorizontal: 10,
  },
  sendButton: {
    marginLeft: 10,
    justifyContent: "center",
  },
});

export default ChatScreen;
