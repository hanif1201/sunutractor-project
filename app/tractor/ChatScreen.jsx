import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import images from "../../constants/images";
import icons from "../../constants/icons";

import {
  getMessages,
  sendMessage,
  getUserById,
  getChatRooms,
} from "../../lib/appwrite";
import { useGlobalContext } from "../../context/GlobalProvider"; // Import useGlobalContext
import { useNavigation, useRoute } from "@react-navigation/native"; // Import useRoute

const ChatScreen = () => {
  const route = useRoute(); // Get the route object
  const { chatRoomId, currentUserId, ownerName, ownerAvatar } = route.params; // Access params from route
  const navigation = useNavigation();

  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const { user } = useGlobalContext();
  console.log("Owner Avatar URL:", ownerAvatar);
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
      <Text
        style={{
          fontSize: 16,
          color: item.senderId === user.$id ? "white" : "black",
        }}
      >
        {item.content}
      </Text>
    </View>
  );
  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <>
      <View className='flex flex-row items-center my-10 mx-5 '>
        <View className='p-2 border-lightDark rounded-lg border-2'>
          <TouchableOpacity onPress={handleBack}>
            <Image
              source={icons.arrowleft}
              resizeMode='contain'
              style={{ width: 20, height: 20, tintColor: "#292D32" }}
            />
          </TouchableOpacity>
        </View>

        <View className='flex flex-row items-center space-x-2 rounded-lg justify-center ml-2'>
          <Image
            source={{ uri: ownerAvatar }}
            resizeMode='contain'
            style={{ width: 54, height: 54, tintColor: "#292D32" }}
            className='w-48 h-48 rounded-full'
          />
          <View>
            <Text className='font-psemibold text-base'>{ownerName}</Text>
            <View className='flex flex-row items-center'>
              <Image
                source={icons.verify}
                resizeMode='contain'
                style={{ width: 20, height: 20, tintColor: "#218225" }}
              />
              <Text className='font-pregular text-base text-primary'>
                Online
              </Text>
            </View>
          </View>
        </View>
      </View>

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
            <Image
              source={icons.group}
              resizeMode='contain'
              style={{ width: 40, height: 40 }}
            />
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sentMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#218225",
    padding: 10,
    margin: 5,
    borderRadius: 10,
    color: "white",
  },
  receivedMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#d2d8d5",
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
    width: "80%",
    height: 50,
  },
  sendButton: {
    marginLeft: 10,
    justifyContent: "center",
  },
});

export default ChatScreen;
