import { INewPost, IUpdatePost, IUpdateUser } from "./../../types/index";
import { INewUser } from "@/types";
import { ID, ImageGravity, Models, Query } from "appwrite";
import { account, appwriteConfig, avatars, databases, storage } from "./config";
import { toast } from "@/components/ui/use-toast";

export async function createUserAccount(user: INewUser) {
  try {
    const newAccount = await account.create(
      ID.unique(),
      user.email,
      user.password,
      user.name
    );
    if (!newAccount) throw new Error("Account creation failed");
    // return newAccount

    const avatarUrl = avatars.getInitials(user.name).toString();

    const newUser = await saveUserToDB({
      accountId: newAccount.$id,
      name: newAccount.name,
      email: newAccount.email,
      username: user.username,
      imageurl: avatarUrl,
    });

    return newUser;
  } catch (error) {
    return error;
  }
}

export async function saveUserToDB(userr: {
  accountId: string;
  email: string;
  name: string;
  username?: string;
  imageurl: string; // Change from Url to string
}) {
  try {
    const newUser = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      userr
    );
    return newUser;
  } catch (error) {
    console.log(error);
    return error;
  }
}

export async function signInAccount(user: { email: string; password: string }) {
  try {
    const session = await account.createEmailPasswordSession(
      user.email,
      user.password
    );
    return session;
  } catch (error) {
    console.log(error);
  }
}

export async function getCurrentUser() {
  try {
    const currentAccount = await account.get();
    if (!currentAccount) throw new Error("Could not get current account");

    const currentUser = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );

    if (!currentUser) throw new Error("No user found for the current account");

    return currentUser.documents[0];
  } catch (error) {
    console.log(error);
  }
}
 
 export async function getUserById(userId:string){
  if(!userId)
    return;
  try{
       const user = await databases.getDocument(
        appwriteConfig.databaseId,
        appwriteConfig.userCollectionId,
        userId
       )
       console.log("This will be req user")
       console.log(user)
       return user;
  }
  catch(error){
     console.log(error)
     throw new Error(`There was an error in getUserById ${error}`);
  }
}
export async function SignOutAccount() {
  try {
    const session = await account.deleteSession("current");
    return session;
  } catch (error) {
    console.log(error);
  }
}

export async function createPost(post: INewPost) {
  let uploadedFile;

  try {
    if(post.file.length == 0){
      toast({description:"Please provide an image"})
    }
    // Upload image to storage
    uploadedFile = await uploadFile(post.file[0]);
   
    if (!uploadedFile) throw new Error("Error while uploading file");
    console.log("Uploaded file:", uploadedFile);

    // Get file URL
    const fileUrl = getFilePreview(uploadedFile.$id);
    if (!fileUrl) {
      await deleteFile(uploadedFile.$id);
      throw new Error("Couldn't get file preview");
    }
    console.log("File URL:", fileUrl);

    // Prepare tags
    const tags = post.tags?.replace(/ /g, "").split(",") || [];

    // Create post document
    const newPost = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      ID.unique(),
      {
        creator: post.userId,
        caption: post.caption,
        imageUrl: fileUrl,
        imageId: uploadedFile.$id,
        location: post.location,
        tags: tags,
      }
    );
    if (!newPost) {
      await deleteFile(uploadedFile.$id);
      throw new Error("Error in creating post");
    }
    console.log("New post created:", newPost);

    return newPost;
  } catch (error) {
    console.error("Error in createPost:", error);

    // Ensure file is deleted if any step fails
    if (uploadedFile) {
      await deleteFile(uploadedFile.$id);
    }
     toast({description:'Cannot create  the post'})
    throw error; // Re-throw the error after logging it
  }
}

export async function uploadFile(file: File) {
  try {
    const uploadedFile = await storage.createFile(
      appwriteConfig.storageId,
      ID.unique(),
      file
    );
    return uploadedFile;
  } catch (error) {
    console.log(error);
  }
}

export function getFilePreview(fileId: string) {
  try {
    const fileUrl = storage.getFilePreview(
      appwriteConfig.storageId,
      fileId,
      2000,
      2000,
      ImageGravity.Top,
      100
    );
    return fileUrl;
  } catch (error) {
    console.log(error);
  }
}

export async function deleteFile(fileId: string) {
  try {
    await storage.deleteFile(appwriteConfig.storageId, fileId);

    return { status: "ok" };
  } catch (error) {
    console.log(error);
  }
}

export async function getRecentPosts() {
  const posts = await databases.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.postCollectionId,
    [Query.orderDesc("$createdAt"), Query.limit(20)]
  );

  if (!posts) throw new Error("no new posts");

  return posts;
}

export async function likePost(
  postId: string,
  likesArray: string[]
): Promise<Models.Document | null> {
  try {
    const updatedPost = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      postId,
      { likes: likesArray }
    );

    if (!updatedPost) {
      console.error("Failed to update post likes count");
      throw new Error("There was an issue updating the post likes count");
    }

    console.log("Post updated successfully:", updatedPost);
    return updatedPost;
  } catch (error) {
    console.error("Error updating post likes:", error);
    return null;
  }
}

export async function savePost(postId: string, userId: string) {
  try {
    const updatedPost = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.savesCollectionId,
      ID.unique(),
      {
        user: userId,
        post: postId,
      }
    );

    if (!updatedPost) {
      console.log(updatedPost);
      throw new Error("There was an issue in saving post");
    } else return updatedPost;
  } catch (error) {
    console.log(error);
  }
}

export async function deleteSavedPost(savedRecordId: string) {
  try {
    const statusCode = await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.savesCollectionId,
      savedRecordId
    );
    if (!statusCode) {
      console.log(statusCode);
      throw new Error("Cant delete the saed post from saved collections");
    }
  } catch (error) {
    console.log(error);
  }
}

export async function getPostById(postId: string) {
  try {
    const post = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      postId
    );
    return post;
  } catch (error) {
    console.log(error);
    throw new Error("There was an error in getPostBYid api")
  }
}

// export async function updatePost(post: IUpdatePost) {
//   const hasFileToUpdate = post.file.length > 0;
//   console.log(hasFileToUpdate);
//   try {
//     // Upload image to storage
//     let image = {
//       imageUrl: post.imageUrl,
//       imageId: post.imageId,
//     };
//     console.log(image)
//     if (hasFileToUpdate) {
//          const uploadedFile = await uploadFile(post.file[0]);
//          if( !uploadFile){
//           console.log("line 286 pr chude guru")
//          }
//         if (!uploadedFile) throw new Error("There was an issue in updating post");
//         const fileUrl = getFilePreview(uploadedFile.$id);
//         if (!fileUrl) {
//         await deleteFile(uploadedFile.$id);
//         throw new Error("Couldn't get file preview");
//         }
//         console.log("File URL:", fileUrl);
//         image = { ...image, imageUrl: fileUrl, imageId: uploadedFile.$id };
//     }
//     // Prepare tags
//     const tags = post.tags?.replace(/ /g, "").split(",") ;
//     console.log(tags)
//     // Create post document
//     console.log('final')
//     console.log(post.caption)
//     console.log(image.imageUrl)
//     console.log(image.imageId)
//     console.log( post.location)
//     console.log(post.postId)
//     console.log(tags)
//     const updatedPost = await databases.updateDocument(
//       appwriteConfig.databaseId,
//       appwriteConfig.postCollectionId,
//       post.postId,
//       {
//         caption: post.caption,
//         imageUrl: image.imageUrl,
//         imageId: image.imageId,
//         location: post.location,
//         tags: tags,
//       }
//     );
//     if (!updatedPost) {
//       console.log("line 320 pr chude gurur")
//       await deleteFile(post.imageId);
//       throw new Error("Error in creating post");
//     }
//     console.log("New post created:");
//     console.log(updatedPost)

//     return updatedPost;
//   } catch (error) {
//     console.log("Error in createPost:", error);
//     // Ensure file is deleted if any step fails
//     throw error; // Re-throw the error after logging it
//   }
// }

export async function updatePost(post: IUpdatePost) {
  const hasFileToUpdate = post.file.length > 0;
  //console.log(hasFileToUpdate);
  try {
    // Upload image to storage
    let image = {
      imageUrl: post.imageUrl,
      imageId: post.imageId,
    };
    if (hasFileToUpdate) {
      const uploadedFile = await uploadFile(post.file[0]);
      if (!uploadedFile) {
        console.log("Error uploading file");
        throw new Error("There was an issue in updating post");
      }
      const fileUrl = getFilePreview(uploadedFile.$id);
      if (!fileUrl) {
        await deleteFile(uploadedFile.$id);
        throw new Error("Couldn't get file preview");
      }
      console.log("File URL:", fileUrl);
      image = { ...image, imageUrl: fileUrl, imageId: uploadedFile.$id };
    }
    // Prepare tags
    const tags = post.tags?.replace(/ /g, "").split(",") || [];
    const updatedPost = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      post.postId,
      {
        caption: post.caption,
        imageUrl: image.imageUrl,
        imageId: image.imageId,
        location: post.location,
        tags: tags,
      }
    );
    if (!updatedPost) {
      console.log("Error updating post")
      await deleteFile(post.imageId);
      throw new Error("Error in updating post");
    }
    console.log("Post updated successfully:");
    console.log(updatedPost)

    return updatedPost;
  } catch (error) {
    console.log("Error in updatePost:", error);
    // Ensure file is deleted if any step fails
    throw error; // Re-throw the error after logging it
  }
}

export async function deletePost(postId: string, imageId: string) {
  if (!postId || !imageId)
    throw new Error("Something went wrong deleting the post");
  try {
    await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      postId
    );

    return { status: "ok" };
  } catch (error) {
    console.log(error);
  }
}

// Corrected getInfinitePosts function
// export async function getInfinitePosts({ pageParam }: { pageParam?: number }) {
//   const queries: any[] = [Query.orderDesc('$updatedAt'), Query.limit(10)];

//   if (pageParam) {
//     queries.push(Query.cursorAfter(pageParam.toString()));
//   }

//   try {
//     const posts = await databases.listDocuments(
//       appwriteConfig.databaseId,
//       appwriteConfig.postCollectionId,
//       queries
//     );
//     if (!posts) throw new Error("There was an error at getInfinitePosts line 425");
//     return posts;
//   } catch (error) {
//     console.log("There was an error in getInfinitePosts", error);
//     throw error;
//   }
// }
export async function getInfinitePosts({ pageParam }: { pageParam?: string }) {
  const queries: any[] = [Query.orderDesc('$updatedAt'), Query.limit(10)];

  if (pageParam) {
    queries.push(Query.cursorAfter(pageParam)); // Pass the string cursor
  }

  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      queries
    );
    if (!posts) throw new Error("There was an error at getInfinitePosts line 425");
    return posts;
  } catch (error) {
    console.log("There was an error in getInfinitePosts", error);
    throw error;
  }
}


// export async function searchPosts(searchTerm:string){
   

//   try{
//       const posts = await databases.listDocuments(
//         appwriteConfig.databaseId,
//         appwriteConfig.postCollectionId,
//         [Query.search('caption',searchTerm)]
//       )
//       if( !posts)
//         throw new Error("There was an error at SearchPosts line 444")
//   }
//   catch(error){
//       console.log("There was an error in searchPost",error);
//       throw error;

//   }
// }
export async function searchPosts(searchTerm: string) {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      [Query.search('caption', searchTerm)]
    );
    if (!posts) {
      throw new Error("There was an error at searchPosts line 444");
    }
    return posts; // Ensure posts are returned
  } catch (error) {
    console.log("There was an error in searchPosts", error);
    return { documents: [] }; // Return an empty array in case of an error
  }
}

export async function updateUser(user: IUpdateUser) {
  const hasFileToUpdate = user.file.length > 0;
  try {
    let image = {
      imageurl: user.imageurl,
      imageId: user.imageId,
    };

    if (hasFileToUpdate) {
      // Upload new file to appwrite storage
      const uploadedFile = await uploadFile(user.file[0]);
      if (!uploadedFile) throw Error;

      // Get new file url
      const fileUrl = getFilePreview(uploadedFile.$id);
      if (!fileUrl) {
        await deleteFile(uploadedFile.$id);
        throw Error;
      }

      image = { ...image, imageurl: fileUrl, imageId: uploadedFile.$id };
    }

    //  Update user
    const updatedUser = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      user.userId,
      {
        name: user.name,
        bio: user.bio,
        imageurl: image.imageurl,
        imageId: image.imageId,
      }
    );

    // Failed to update
    if (!updatedUser) {
      // Delete new file that has been recently uploaded
      if (hasFileToUpdate) {
        await deleteFile(image.imageId);
      }
      // If no new file uploaded, just throw error
      throw Error;
    }

    // Safely delete old file after successful update
    if (user.imageId && hasFileToUpdate) {
      await deleteFile(user.imageId);
    }

    return updatedUser;
  } catch (error) {
    console.log(error);
  }
}




// //wont be using
// export async  function getUsers(limit?:number) {
//   const queries: any[] = [Query.orderDesc("$createdAt")];

//   if (limit) {
//     queries.push(Query.limit(limit));
//   }

//   try {
//     const users = await databases.listDocuments(
//       appwriteConfig.databaseId,
//       appwriteConfig.userCollectionId,
//       queries
//     );

//     if (!users) throw Error;

//     return users;
//   } catch (error) {
//     console.log(error);
//   }
// }