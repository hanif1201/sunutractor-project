import {
  Client,
  Account,
  ID,
  Avatars,
  Databases,
  Storage,
  Query,
} from "react-native-appwrite";

const client = new Client();

client
  .setEndpoint("https://cloud.appwrite.io/v1") // Your Appwrite Endpoint
  .setProject(process.env.EXPO_PUBLIC_PROJECT_ID) // Your project ID
  .setPlatform(process.env.EXPO_PUBLIC_PLATFORM); // Your application ID or bundle ID.

const account = new Account(client);
const storage = new Storage(client);
const avatars = new Avatars(client);
const databases = new Databases(client);

// Register user
export async function createUser(email, password, username, phone) {
  try {
    const newAccount = await account.create(
      ID.unique(),
      email,
      password,
      username,
      phone
    );

    if (!newAccount) throw Error;

    const avatarUrl = avatars.getInitials(username);

    await signIn(email, password);

    const newUser = await databases.createDocument(
      process.env.EXPO_PUBLIC_DATABASE_ID,
      process.env.EXPO_PUBLIC_USER_COLLECTION_ID,
      ID.unique(),
      {
        accountId: newAccount.$id,
        email: email,
        username: username,
        avatar: avatarUrl,
        phone: phone,
      }
    );

    return newUser;
  } catch (error) {
    throw new Error(error);
  }
}
// Sign in user
export async function signIn(email, password) {
  try {
    const session = await account.createEmailPasswordSession(email, password);
    return session;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function updateUserProfile(updatedData) {
  try {
    // Fetch the current user's document
    const currentUser = await getCurrentUser();
    console.log("Current User:", currentUser); // Debugging line

    if (!currentUser) {
      throw new Error("User not authenticated");
    }

    // Update the user's document in the database
    const updatedUser = await databases.updateDocument(
      process.env.EXPO_PUBLIC_DATABASE_ID,
      process.env.EXPO_PUBLIC_USER_COLLECTION_ID,
      currentUser.$id,
      updatedData
    );

    console.log("Updated User:", updatedUser); // Debugging line
    return updatedUser;
  } catch (error) {
    console.error("Error updating profile:", error);
    throw new Error(`Failed to update profile: ${error.message}`);
  }
}
// Get Account
export async function getAccount() {
  try {
    const currentAccount = await account.get();

    return currentAccount;
  } catch (error) {
    throw new Error(error);
  }
}

// Get Current User
export async function getCurrentUser() {
  try {
    const currentAccount = await getAccount();
    if (!currentAccount) throw Error;

    const currentUser = await databases.listDocuments(
      process.env.EXPO_PUBLIC_DATABASE_ID,
      process.env.EXPO_PUBLIC_USER_COLLECTION_ID,
      [Query.equal("accountId", currentAccount.$id)]
    );

    if (!currentUser) throw Error;

    return currentUser.documents[0];
  } catch (error) {
    console.log(error);
    return null;
  }
}

// // Sign Out
// export async function signOut() {
//   try {
//     const session = await account.deleteSession("current");

//     return session;
//   } catch (error) {
//     throw new Error(error);
//   }
// }

// Create a Tractor
export async function createTractor(tractorData) {
  try {
    if (!tractorData.make || !tractorData.model) {
      throw new Error("Invalid tractor data");
    }

    const currentUser = await getCurrentUser();
    if (!currentUser) {
      throw new Error("User not authenticated");
    }

    const thumbnailUrl = await uploadFile(tractorData.thumbnail, "image");
    const tractorId = ID.unique();
    const tractor = await databases.createDocument(
      process.env.EXPO_PUBLIC_DATABASE_ID,
      process.env.EXPO_PUBLIC_TRACTOR_COLLECTION_ID,
      tractorId,
      {
        ...tractorData,
        thumbnail: thumbnailUrl,
        userId: currentUser.$id,
      }
    );

    return tractor.$id;
  } catch (error) {
    if (error.message === "Invalid tractor data") {
      throw new Error("Please provide all required tractor details");
    } else if (error.message === "User not authenticated") {
      throw new Error("You must be logged in to create a tractor");
    } else {
      console.error("Error creating tractor:", error);
      throw new Error("Failed to create tractor: " + error.message);
    }
  }
}

// Get Tractors
export async function getAllTractors() {
  try {
    const response = await databases.listDocuments(
      process.env.EXPO_PUBLIC_DATABASE_ID,
      process.env.EXPO_PUBLIC_TRACTOR_COLLECTION_ID
    );

    const tractors = response.documents; // Assuming the documents property contains the array of tractor objects

    return tractors;
  } catch (error) {
    throw new Error(error);
  }
}

//Get tractors by Id

export async function getTractorById(documentId) {
  try {
    const response = await databases.getDocument(
      process.env.EXPO_PUBLIC_DATABASE_ID,
      process.env.EXPO_PUBLIC_TRACTOR_COLLECTION_ID,
      documentId
    );

    return response;
  } catch (error) {
    if (error.code === 404) {
      throw new Error(`Tractor with ID ${documentId} not found`);
    } else {
      throw new Error(`Error fetching tractor: ${error.message}`);
    }
  }
}

// Upload File
export async function uploadFile(file, type) {
  if (!file) return;

  const { mimeType, ...rest } = file;
  const asset = { type: mimeType, ...rest };

  try {
    const uploadedFile = await storage.createFile(
      process.env.EXPO_PUBLIC_STORAGE_ID,
      ID.unique(),
      asset
    );

    const fileUrl = await getFilePreview(uploadedFile.$id, type);
    return fileUrl;
  } catch (error) {
    throw new Error(error);
  }
}

// Get File Preview
export async function getFilePreview(fileId, type) {
  let fileUrl;

  try {
    if (type === "video") {
      fileUrl = storage.getFileView(appwriteConfig.storageId, fileId);
    } else if (type === "image") {
      fileUrl = storage.getFilePreview(
        process.env.EXPO_PUBLIC_STORAGE_ID,
        fileId,
        2000,
        2000,
        "top",
        100
      );
    } else {
      throw new Error("Invalid file type");
    }

    if (!fileUrl) throw Error;

    return fileUrl;
  } catch (error) {
    throw new Error(error);
  }
}

// Logout
export async function signOut() {
  try {
    await account.deleteSession("current");
    return { success: true };
  } catch (error) {
    console.error("Logout failed:", error);
    return { success: false, error: error.message };
  }
}

// Get number of tractors created by a user
export async function getTractorCountByUser(userId) {
  try {
    const tractors = await databases.listDocuments(
      process.env.EXPO_PUBLIC_DATABASE_ID,
      process.env.EXPO_PUBLIC_TRACTOR_COLLECTION_ID,
      [Query.equal("userId", userId)]
    );

    return tractors.total;
  } catch (error) {
    console.error("Error fetching tractor count:", error);
    throw new Error(`Failed to get tractor count: ${error.message}`);
  }
}

// Get tractors created by a user
export async function getTractorsByUser(userId) {
  try {
    const response = await databases.listDocuments(
      process.env.EXPO_PUBLIC_DATABASE_ID,
      process.env.EXPO_PUBLIC_TRACTOR_COLLECTION_ID,
      [Query.equal("userId", userId)]
    );

    return response.documents;
  } catch (error) {
    console.error("Error fetching user's tractors:", error);
    throw new Error(`Failed to get user's tractors: ${error.message}`);
  }
}

// Function to delete a tractor
export const deleteTractor = async (tractorId) => {
  try {
    await databases.deleteDocument(
      process.env.EXPO_PUBLIC_DATABASE_ID,
      process.env.EXPO_PUBLIC_TRACTOR_COLLECTION_ID,
      tractorId
    );
    return true;
  } catch (error) {
    console.error("Error deleting tractor:", error);
    throw error;
  }
};

// Function to get a single tractor by ID
export const getTractor = async (tractorId) => {
  try {
    const tractor = await databases.getDocument(
      process.env.EXPO_PUBLIC_DATABASE_ID,
      process.env.EXPO_PUBLIC_TRACTOR_COLLECTION_ID,
      tractorId
    );
    return tractor;
  } catch (error) {
    console.error("Error fetching tractor:", error);
    throw error;
  }
};

// Function to update a tractor
export const updateTractor = async (tractorId, updatedData) => {
  try {
    const updatedTractor = await databases.updateDocument(
      process.env.EXPO_PUBLIC_DATABASE_ID,
      process.env.EXPO_PUBLIC_TRACTOR_COLLECTION_ID,
      tractorId,
      updatedData
    );
    return updatedTractor;
  } catch (error) {
    console.error("Error updating tractor:", error);
    throw error;
  }
};

// Create a new chat room
export const createChatRoom = async (user1Id, user2Id) => {
  try {
    const chatRoomId = ID.unique();
    const chatRoom = await databases.createDocument(
      process.env.EXPO_PUBLIC_DATABASE_ID,
      process.env.EXPO_PUBLIC_CHATROOM_COLLECTION_ID,
      chatRoomId,
      {
        participants: [user1Id, user2Id],
        lastMessage: null,
        lastMessageTime: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    );
    return chatRoom.$id;
  } catch (error) {
    console.error("Error creating chat room:", error);
    throw error;
  }
};

// Get chat rooms for a user
export const getChatRooms = async (currentUserId) => {
  const databaseId = process.env.EXPO_PUBLIC_DATABASE_ID;
  const chatroomsCollectionId = process.env.EXPO_PUBLIC_CHATROOM_COLLECTION_ID;

  if (!currentUserId) {
    throw new Error("Current user ID is required to fetch chat rooms.");
  }

  try {
    const response = await databases.listDocuments(
      databaseId,
      chatroomsCollectionId,
      [
        Query.equal("participants", [currentUserId]), // Adjust this if necessary
        Query.limit(100), // Limit the number of rooms fetched
      ]
    );
    return response.documents; // Return the list of chat rooms
  } catch (error) {
    console.error("Error fetching chat rooms:", error);
    throw error; // Rethrow the error for handling in the component
  }
};

// Update a chat room
export const updateChatRoom = async (userId, chatRoomId, updateData) => {
  try {
    const chatRoom = await databases.getDocument(
      process.env.EXPO_PUBLIC_DATABASE_ID,
      process.env.EXPO_PUBLIC_CHATROOM_COLLECTION_ID,
      chatRoomId
    );
    if (!chatRoom.participants.includes(userId)) {
      throw new Error("User is not a participant in this chat room");
    }

    if (updateData.participants) {
      delete updateData.participants;
    }

    updateData.updatedAt = new Date().toISOString();

    const updatedChatRoom = await databases.updateDocument(
      process.env.EXPO_PUBLIC_DATABASE_ID,
      process.env.EXPO_PUBLIC_CHATROOM_COLLECTION_ID,
      chatRoomId,
      updateData
    );
    return updatedChatRoom;
  } catch (error) {
    console.error("Error updating chat room:", error);
    throw error;
  }
};

// Send a message
export const sendMessage = async (userId, chatRoomId, content) => {
  try {
    const chatRoom = await databases.getDocument(
      process.env.EXPO_PUBLIC_DATABASE_ID,
      process.env.EXPO_PUBLIC_CHATROOM_COLLECTION_ID,
      chatRoomId
    );
    if (!chatRoom.participants.includes(userId)) {
      throw new Error("User is not a participant in this chat room");
    }
    const message = await databases.createDocument(
      process.env.EXPO_PUBLIC_DATABASE_ID,
      process.env.EXPO_PUBLIC_MESSAGES_COLLECTION_ID,
      ID.unique(),
      {
        chatRoomId,
        senderId: userId,
        content,
        timestamp: new Date().toISOString(),
        read: false,
      }
    );

    // Update the chat room's last message
    await updateChatRoom(userId, chatRoomId, {
      lastMessage: content,
      lastMessageTime: message.timestamp,
    });

    return message;
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
};

// Get messages for a chat room
export const getMessages = async (userId, chatRoomId) => {
  try {
    const chatRoom = await databases.getDocument(
      process.env.EXPO_PUBLIC_DATABASE_ID,
      process.env.EXPO_PUBLIC_CHATROOM_COLLECTION_ID,
      chatRoomId
    );
    if (!chatRoom.participants.includes(userId)) {
      throw new Error("User is not a participant in this chat room");
    }
    const messages = await databases.listDocuments(
      process.env.EXPO_PUBLIC_DATABASE_ID,
      process.env.EXPO_PUBLIC_MESSAGES_COLLECTION_ID,
      [Query.equal("chatRoomId", chatRoomId), Query.orderDesc("timestamp")]
    );
    return messages.documents;
  } catch (error) {
    console.error("Error fetching messages:", error);
    throw error;
  }
};

// Update a message
export const updateMessage = async (userId, messageId, updateData) => {
  try {
    const message = await databases.getDocument(
      process.env.EXPO_PUBLIC_DATABASE_ID,
      process.env.EXPO_PUBLIC_MESSAGES_COLLECTION_ID,
      messageId
    );

    if (message.senderId !== userId) {
      throw new Error("User can only update their own messages");
    }

    delete updateData.senderId;
    delete updateData.chatRoomId;
    delete updateData.timestamp;

    const updatedMessage = await databases.updateDocument(
      process.env.EXPO_PUBLIC_DATABASE_ID,
      process.env.EXPO_PUBLIC_MESSAGES_COLLECTION_ID,
      messageId,
      updateData
    );
    return updatedMessage;
  } catch (error) {
    console.error("Error updating message:", error);
    throw error;
  }
};

export const findOrCreateChatRoom = async (currentUserId, ownerId) => {
  const databaseId = process.env.EXPO_PUBLIC_DATABASE_ID;
  const chatroomsCollectionId = process.env.EXPO_PUBLIC_CHATROOM_COLLECTION_ID;

  console.log(
    `Attempting to find or create chat room. Database ID: ${databaseId}, Collection ID: ${chatroomsCollectionId}`
  );
  console.log(`Current User ID: ${currentUserId}, Owner ID: ${ownerId}`);

  if (!currentUserId || !ownerId) {
    console.error("Invalid user IDs provided");
    throw new Error("User IDs must be valid");
  }

  try {
    // Fetch chat rooms where both users are participants
    console.log("Fetching existing chat rooms...");
    const existingRooms = await databases.listDocuments(
      databaseId,
      chatroomsCollectionId,
      [
        Query.equal("participants", [currentUserId]), // Ensure this is valid
        Query.limit(100),
      ]
    );

    console.log(
      `Found ${existingRooms.documents.length} potential matching rooms`
    );

    // Filter rooms to find one where both users are participants
    const matchingRoom = existingRooms.documents.find(
      (room) =>
        room.participants.includes(currentUserId) &&
        room.participants.includes(ownerId)
    );

    if (matchingRoom) {
      console.log(`Existing chat room found: ${matchingRoom.$id}`);
      return matchingRoom.$id;
    } else {
      console.log("No existing chat room found. Creating new one.");
      // Create new chat room
      const newRoom = await databases.createDocument(
        databaseId,
        chatroomsCollectionId,
        ID.unique(),
        {
          participants: [currentUserId, ownerId],
          lastMessage: null,
          lastMessageTime: null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
      );
      console.log(`New chat room created: ${newRoom.$id}`);
      return newRoom.$id;
    }
  } catch (error) {
    console.error("Error finding or creating chat room:", error);
    if (error.response) {
      console.error("Error response:", JSON.stringify(error.response, null, 2));
    }
    throw error;
  }
};

export const getUserById = async (userId) => {
  // Replace with your actual API call to fetch user details
  const response = await databases.getDocument(
    process.env.EXPO_PUBLIC_DATABASE_ID,
    process.env.EXPO_PUBLIC_USER_COLLECTION_ID,
    userId
  );
  return response; // Assuming this returns user data including username
};

export const getTractorByMakeAndModel = async (make, model) => {
  try {
    // Prepare query conditions
    const queryConditions = [];
    if (make) {
      queryConditions.push(Query.equal("make", make));
    }
    if (model) {
      queryConditions.push(Query.equal("model", model));
    }

    // Ensure at least one condition is present
    if (queryConditions.length === 0) {
      throw new Error("At least one of make or model is required for search.");
    }

    const response = await databases.listDocuments(
      process.env.EXPO_PUBLIC_DATABASE_ID,
      process.env.EXPO_PUBLIC_TRACTOR_COLLECTION_ID,
      queryConditions
    );

    if (response.documents.length === 0) {
      return null; // No results found
    }

    return response.documents[0]; // Assuming you want the first match
  } catch (error) {
    console.error("Error fetching tractor by make and model:", error);
    throw new Error(
      `Failed to get tractor by make and model: ${error.message}`
    );
  }
};

export const toggleFavoriteTractor = async (userId, tractorId) => {
  try {
    // Check if the tractor is already a favorite
    const response = await databases.listDocuments(
      process.env.EXPO_PUBLIC_DATABASE_ID,
      process.env.EXPO_PUBLIC_FAVORITES_COLLECTION_ID, // Replace with your favorites collection ID
      [Query.equal("userId", userId), Query.equal("tractorId", tractorId)]
    );

    if (response.documents.length > 0) {
      // If it exists, remove it
      await databases.deleteDocument(
        process.env.EXPO_PUBLIC_DATABASE_ID,
        process.env.EXPO_PUBLIC_FAVORITES_COLLECTION_ID,
        response.documents[0].$id
      );
    } else {
      // If it doesn't exist, add it
      await databases.createDocument(
        process.env.EXPO_PUBLIC_DATABASE_ID,
        process.env.EXPO_PUBLIC_FAVORITES_COLLECTION_ID,
        ID.unique(),
        {
          userId,
          tractorId,
          isFavorite: true,
        }
      );
    }
  } catch (error) {
    console.error("Error toggling favorite tractor:", error);
    throw new Error("Failed to toggle favorite tractor: " + error.message);
  }
};

export const getFavoriteTractors = async (userId) => {
  try {
    const response = await databases.listDocuments(
      process.env.EXPO_PUBLIC_DATABASE_ID,
      process.env.EXPO_PUBLIC_FAVORITES_COLLECTION_ID, // Replace with your favorites collection ID
      [Query.equal("userId", userId)]
    );

    // Extract tractor IDs from the response
    return response.documents.map((doc) => doc.tractorId);
  } catch (error) {
    console.error("Error fetching favorite tractors:", error);
    throw new Error("Failed to fetch favorite tractors: " + error.message);
  }
};

export const removeTractorFromFavorites = async (userId, tractorId) => {
  try {
    // Find the favorite document for the given user and tractor
    const response = await databases.listDocuments(
      process.env.EXPO_PUBLIC_DATABASE_ID,
      process.env.EXPO_PUBLIC_FAVORITES_COLLECTION_ID,
      [Query.equal("userId", userId), Query.equal("tractorId", tractorId)]
    );

    if (response.documents.length === 0) {
      throw new Error("Favorite not found");
    }

    // Assuming there's only one document per userId and tractorId combination
    const favoriteDocId = response.documents[0].$id;

    // Delete the favorite document
    await databases.deleteDocument(
      process.env.EXPO_PUBLIC_DATABASE_ID,
      process.env.EXPO_PUBLIC_FAVORITES_COLLECTION_ID,
      favoriteDocId
    );

    console.log(
      `Successfully removed tractor with ID ${tractorId} from favorites for user ${userId}`
    );
    return true;
  } catch (error) {
    console.error("Error removing tractor from favorites:", error);
    throw new Error(
      "Failed to remove tractor from favorites: " + error.message
    );
  }
};
