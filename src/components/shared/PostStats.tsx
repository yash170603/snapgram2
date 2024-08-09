// import {
//   useDeleteSavePost,
//   useGetCurrentUser,
//   useLikePost,
//   useSavePost,
// } from "@/lib/react-query/queriesAndMutations";
// import { checkIsLiked } from "@/lib/utils";
// import { Models } from "appwrite";
// import { Loader } from "lucide-react";
// import { useState, useEffect } from "react";

// type PostStatsProps = {
//   post?: Models.Document;
//   userId: string;
// };

// const PostStats = ({ post, userId }: PostStatsProps) => {
//   const likeList = post?.likes?.map((user: Models.Document) => user.id) || [];
   
//   const [likes, setLikes] = useState<string[]>(likeList);
//   const [isSaved, setIsSaved] = useState(false);

//   const { mutate: likePost } = useLikePost();
  
//   const { mutate: savePost, isPending: isSavingPost } = useSavePost();
//   const { mutate: deleteSavedPost, isPending: isDeletingSaved } = useDeleteSavePost();

//   const { data: currentUser } = useGetCurrentUser();

//   useEffect(() => {
//     if (currentUser && post) {
//       const savedPostRecord = currentUser.save.find((record: Models.Document) => record.post.$id === post.$id);
//       setIsSaved(!!savedPostRecord);
//     }
//   }, [currentUser, post]);

//   const handleLikePost = (e: React.MouseEvent) => {
//     e.stopPropagation();
//     if (!post) return;

//     const hasLiked = likes.includes(userId);
//     const newLikes = hasLiked
//       ? likes.filter((id) => id !== userId)
//       : [...likes, userId];

//     setLikes(newLikes);
//     likePost({ postId: post.$id, likesArray: newLikes });
//   };

//   const handleSavePost = (e: React.MouseEvent) => {
//     e.stopPropagation();
//     if (!currentUser || !post) return;

//     if (isSaved) {
//       const savedPostRecord = currentUser.save.find((record: Models.Document) => record.post.$id === post.$id);
//       if (savedPostRecord) {
//         deleteSavedPost(savedPostRecord.$id);
//         setIsSaved(false);
//       }
//     } else {
//       savePost({ postId: post.$id, userId });
//       setIsSaved(true);
//     }
//   };

//   return (
//     <div className="flex justify-between items-center z-20">
//       <div className="flex gap-2 mr-5">
//         <img
//           src={checkIsLiked(likes, userId) ? "/assets/icons/liked.svg" : "/assets/icons/like.svg"}
//           alt="like"
//           width={20}
//           height={20}
//           onClick={handleLikePost}
//           className="cursor-pointer"
//         />
//         <p className="small-medium lg:base-medium">{likes.length}</p>
//       </div>
//       <div className="flex gap-2 mr-5">
//         {isSavingPost || isDeletingSaved ? (
//           <Loader />
//         ) : (
//           <img
//             src={isSaved ? "/assets/icons/saved.svg" : "/assets/icons/save.svg"}
//             alt="save"
//             width={20}
//             height={20}
//             onClick={handleSavePost}
//             className="cursor-pointer"
//           />
//         )}
//       </div>
//     </div>
//   );
// };

// export default PostStats;

import {
  useDeleteSavePost,
  useGetCurrentUser,
  useLikePost,
  useSavePost,
} from "@/lib/react-query/queriesAndMutations";
import { checkIsLiked } from "@/lib/utils";
import { Models } from "appwrite";
import { Loader } from "lucide-react";
import { useState, useEffect } from "react";

type PostStatsProps = {
  post?: Models.Document;
  userId: string;
};

const PostStats = ({ post, userId }: PostStatsProps) => {
  const likeList = post?.likes.map((user: Models.Document) => user?.$id) || [];
  // console.log(post);
  // (likeList.length>0)?console.log('element exist'):console.log("lauda mera")
  // console.log(likeList)
   
  const [likes, setLikes] = useState<string[]>(likeList);
  const [isSaved, setIsSaved] = useState(false);

  const { mutate: likePost } = useLikePost();
  
  const { mutate: savePost, isPending: isSavingPost } = useSavePost();
  const { mutate: deleteSavedPost, isPending: isDeletingSaved } = useDeleteSavePost();

  const { data: currentUser } = useGetCurrentUser();

  useEffect(() => {
    if (currentUser && post) {
      const savedPostRecord = currentUser.save.find((record: Models.Document) => record.post?.$id === post?.$id);
      setIsSaved(!!savedPostRecord);
    }
  }, [currentUser, post]);

  const handleLikePost = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!post) return;

    const hasLiked = likes.includes(userId);
    const newLikes = hasLiked
      ? likes.filter((id) => id !== userId)
      : [...likes, userId];

    setLikes(newLikes);
    likePost({ postId: post.$id, likesArray: newLikes });
  };

  const handleSavePost = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentUser || !post) return;

    if (isSaved) {
      const savedPostRecord = currentUser.save.find((record: Models.Document) => record.post.$id === post.$id);
      if (savedPostRecord) {
        deleteSavedPost(savedPostRecord.$id);
        setIsSaved(false);
      }
    } else {
      savePost({ postId: post.$id, userId });
      setIsSaved(true);
    }
  };

  return (
    <div className="flex justify-between items-center z-20">
      <div className="flex gap-2 mr-5">
        <img
          src={checkIsLiked(likes, userId) ? "/assets/icons/liked.svg" : "/assets/icons/like.svg"}
          alt="like"
          width={20}
          height={20}
          onClick={handleLikePost}
          className="cursor-pointer"
        />
        <p className="small-medium lg:base-medium">{likes.length}</p>
      </div>
      <div className="flex gap-2 mr-5">
        {isSavingPost || isDeletingSaved ? (
          <Loader />
        ) : (
          <img
            src={isSaved ? "/assets/icons/saved.svg" : "/assets/icons/save.svg"}
            alt="save"
            width={20}
            height={20}
            onClick={handleSavePost}
            className="cursor-pointer"
          />
        )}
      </div>
    </div>
  );
};

export default PostStats;
