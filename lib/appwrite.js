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
export async function createUser(email, password, username) {
  try {
    const newAccount = await account.create(
      ID.unique(),
      email,
      password,
      username
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
