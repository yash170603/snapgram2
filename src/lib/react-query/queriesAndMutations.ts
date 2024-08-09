import { INewPost, INewUser, IUpdatePost, IUpdateUser } from "@/types";
import { useQuery, useMutation, useQueryClient, useInfiniteQuery} from "@tanstack/react-query";
import {
  createPost,
  createUserAccount,
  deletePost,
  deleteSavedPost,
  getCurrentUser,
  getInfinitePosts,
  getPostById,
  getRecentPosts,

  likePost,
  savePost,
  searchPosts,
  signInAccount,
  SignOutAccount,
  updatePost,
  updateUser
} from "../Appwrite/api";
import { QUERY_KEYS } from "./queryKeys";


export const useCreateUserAccount = () => {
  return useMutation({
    mutationFn: (user: INewUser) => createUserAccount(user),
  });
};

export const useSignInAccount = () => {
  return useMutation({
    mutationFn: (user: { email: string; password: string }) =>
      signInAccount(user),
  });
};

export const useSignOutAccount = () => {
  return useMutation({
    mutationFn: SignOutAccount,
  });
};

export const useCreatePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (post: INewPost) => createPost(post),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      });
    },
  });
};

export const useGetRecentPosts = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
    queryFn: getRecentPosts, 
  });
};

export const useLikePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      postId,
      likesArray,
    }: {
      postId: string;
      likesArray: string[];
    }) => likePost(postId, likesArray),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POST_BY_ID, data?.$id], // Assuming postId is available in the scope
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS], // Assuming postId is available in the scope
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POSTS], // Assuming postId is available in the scope
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER], // Assuming postId is available in the scope
      });
    },
  });
};
// onSuccess: (_, { postId }) => {
//     queryClient.invalidateQueries({
//         queryKey: [QUERY_KEYS.GET_POST_BY_ID, postId]  // Assuming postId is available in the scope
//     })

export const useSavePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postId, userId }: { postId: string; userId: string }) =>
      savePost(postId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS], // Assuming postId is available in the scope
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POSTS], // Assuming postId is available in the scope
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER], // Assuming postId is available in the scope
      });
    },
  });
};

export const useDeleteSavePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (savedRecordId: string) => deleteSavedPost(savedRecordId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS], // Assuming postId is available in the scope
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POSTS], // Assuming postId is available in the scope
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER], // Assuming postId is available in the scope
      });
    },
  });
};

export const useGetCurrentUser =()=>{
     return useQuery({
        queryKey:[QUERY_KEYS.GET_CURRENT_USER],
        queryFn:getCurrentUser
     })
}


export const useGetPostById = (postId:string)=>{
    return useQuery({
        queryKey:[QUERY_KEYS.GET_POST_BY_ID,postId],
        queryFn:()=> getPostById(postId),
       enabled:!!postId
    })
}

export const useUpdatePost = ()=>{
 const queyClient = useQueryClient();
 return useMutation({
      mutationFn:(post:IUpdatePost)=>updatePost(post),
      onSuccess:(data)=>{
        queyClient.invalidateQueries({
          queryKey:[QUERY_KEYS.GET_POST_BY_ID,data?.$id]
        })
      }
 })
}

export const useDeletePost = ()=>{
  const queyClient = useQueryClient();
  return useMutation({
       mutationFn:({postId,imageId}:{postId:string,imageId:string})=>deletePost(postId,imageId),
       onSuccess:()=>{
         queyClient.invalidateQueries({
           queryKey:[QUERY_KEYS.GET_RECENT_POSTS]
         })
       }
  })
 }




// export const useGetPosts = () => {
//   return useInfiniteQuery({
//     queryKey: [QUERY_KEYS.GET_INFINITE_POSTS],
//     queryFn: getInfinitePosts,
//     getNextPageParam: (lastPage) => {
//       if (lastPage && lastPage.documents.length === 0) return null;
//       const lastId = lastPage.documents[lastPage.documents.length - 1].$id;
//       return lastId;
//     },
//   });
// };
export const useGetPosts = () => {
  return useInfiniteQuery({
    queryKey: [QUERY_KEYS.GET_INFINITE_POSTS],
    queryFn: getInfinitePosts,
    getNextPageParam: (lastPage) => {
      if (lastPage && lastPage.documents.length === 0) return null;
      const lastId = lastPage.documents[lastPage.documents.length - 1].$id;
      return lastId;
    },
    initialPageParam: undefined, // This ensures the correct type is used
  });
};


// export const useGetPosts = () => {
//   return useInfiniteQuery<
//     Models.DocumentList<Models.Document>,  // The type of the data returned by the query function
//     Error,                                 // The type of error returned
//     Models.DocumentList<Models.Document>,  // The type of each page in the infinite query
//     string                                 // The type returned by getNextPageParam
//   >({
//     queryKey: ['getInfinitePosts'],       // Ensure queryKey is an array
//     queryFn: getInfinitePosts,
//     getNextPageParam: (lastPage) => {
//       if (lastPage.documents.length === 0) return null;
//       const lastId = lastPage.documents[lastPage.documents.length - 1].$id;
//       return lastId; // Return type should be string, which matches the expected return type
//     },
//   });
// };



export const useSearchPosts = (searchTerm: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.SEARCH_POSTS, searchTerm],
    queryFn: () => searchPosts(searchTerm),
    enabled: !!searchTerm,
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (user: IUpdateUser) => updateUser(user),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_USER_BY_ID, data?.$id],
      });
    },
  });
};


// //wont be using
// export const useGetUsers = (limit?: number) => {
//   return useQuery({
//     queryKey: [QUERY_KEYS.GET_USERS],
//     queryFn: () => getUsers(limit),
//   });
// };
