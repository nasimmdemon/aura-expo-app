import {
  Client,
  Account,
  ID,
  Avatars,
  Databases,
  Query,
  Storage,
} from "react-native-appwrite";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default appwriteConfig = {
  endpoint: "https://cloud.appwrite.io/v1",
  platform: "com.emonadi.aura",
  projectId: "672ef5b10003412b1493",
  databaseId: "672ef7e7001022bccb8a",
  userCollectionId: "672ef80f00009a410908",
  videoCollectionId: "672ef85c001d23f8fa99",
  storageId: "672ef9d600165a138320",
};

const client = new Client();
client
  .setEndpoint(appwriteConfig.endpoint)
  .setProject(appwriteConfig.projectId) // Your Project ID
  .setPlatform(appwriteConfig.platform);

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);

//Create new user on appWrite Database
export const createUser = async (email, password, username) => {
  // Register User
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
    const newUser = databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      {
        accountId: newAccount.$id,
        email,
        username,
        avatar: avatarUrl,
      }
    );

    return newUser;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

//Sign In User on appWrite Database

export async function signIn(email, password) {
  try {
    const session = await account.createEmailPasswordSession(email, password);
    await AsyncStorage.setItem("session", JSON.stringify(session)); // Save session to AsyncStorage
    return session;
  } catch (error) {
    throw new Error(error);
  }
}

//Sign Out User from Appwrite

export const signOut = async () => {
  try {
    await account.deleteSession("current");
    await AsyncStorage.removeItem("session"); // Remove session on logout
    console.log("Signout success");
  } catch (error) {
    throw new Error(error);
  }
};

//Get current User from Appwrite

export const getCurrentUser = async () => {
  try {
    const currentAccount = await account.get();
    if (!currentAccount) throw Error("No account found");

    const currentUser = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );
    return currentUser.documents[0];
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};
