// import GridPostList from "@/components/shared/GridPostList";
// import { getPostById } from "@/lib/Appwrite/api";
// import { useGetCurrentUser, useGetPostById } from "@/lib/react-query/queriesAndMutations";
// import { Models } from "appwrite";
// import { Loader } from "lucide-react";
// import { Module } from "module";
// import { useEffect, useState } from "react";
// import { any } from "zod";



// const Saved = () => {
//   const { data: currentUser } = useGetCurrentUser();
//   const[post,setPost]= useState();

//    const savePosts = currentUser?.save
//     .map((savePost: Models.Document) => ({
//       ...savePost.post,
     
     
//       creator: {
//         imageurl: currentUser.imageurl,
//       },
//     }))
//     .reverse();
//   console.log(savePosts)
//   console.log("These were the first logs")

//    var savedPostId;

//    console.log("second log")
//   const sp = currentUser?.save
//   .map((st:any)=>{
//     console.log("inner")
//     savedPostId= st.$id;    // 
//    console.log(this is saved document id ${savedPostId})
//    console.log("This next line the saved document as whole")
//    console.log(st)

//    console.log("break")
//    console.log(This is the id of the post which was saved ${st?.post?.$id})
//    const postDetails =  getPostById(String(st?.post?.$id))
//    console.log(postDetails)
    
//     console.log("this was a unit save")
//   })
   
   
  
 
  
//   return (
//     <div className="saved-container">
//       <div className="flex gap-2 w-full max-w-5xl">
//         <img
//           src="/assets/icons/save.svg"
//           width={36}
//           height={36}
//           alt="edit"
//           className="invert-white"
//         />
//         <h2 className="h3-bold md:h2-bold text-left w-full">Saved Posts</h2>
//       </div>

//       {!currentUser ? (
//         <Loader />
//       ) : (
//         <ul className="w-full flex justify-center max-w-5xl gap-9">
//           {savePosts.length === 0 ? (
//             <p className="text-light-4">No available posts</p>
//           ) : (
//             <GridPostList posts={savePosts} showStats={false} />
//           )}
//         </ul>
//       )}
//     </div>
//   );
// };



// export default Saved;

import GridPostList from "@/components/shared/GridPostList";
import { getPostById } from "@/lib/Appwrite/api";
import { useGetCurrentUser } from "@/lib/react-query/queriesAndMutations";
import { Models } from "appwrite";
import { Loader } from "lucide-react";
import { useEffect, useState } from "react";

const Saved = () => {
  const { data: currentUser } = useGetCurrentUser();
  const [savePosts, setSavePosts] = useState<any[]>([]);

  useEffect(() => {
    const fetchSavedPosts = async () => {
      if (currentUser) {
        const updatedPosts = await Promise.all(
          currentUser.save.map(async (savePost: Models.Document) => {
            const postIdString = String(savePost?.post?.$id);
            try {
              const postDetails = await getPostById(postIdString);

              // Assuming postDetails contains the creator information
              return {
                ...savePost.post,
                creator: {
                  imageurl: postDetails?.creator?.imageurl,
                },
              };
            } catch (error) {
              console.error(`Error fetching post with ID ${postIdString}:`, error);
              return null; // Handle error case
            }
          })
        );

        setSavePosts(updatedPosts.filter(post => post !== null).reverse());
      }
    };

    fetchSavedPosts();
  }, [currentUser]);

  return (
    <div className="saved-container">
      <div className="flex gap-2 w-full max-w-5xl">
        <img
          src="/assets/icons/save.svg"
          width={36}
          height={36}
          alt="edit"
          className="invert-white"
        />
        <h2 className="h3-bold md:h2-bold text-left w-full">Saved Posts</h2>
      </div>

      {!currentUser ? (
        <Loader />
      ) : (
        <ul className="w-full flex justify-center max-w-5xl gap-9">
          {savePosts.length === 0 ? (
            <p className="text-light-4">No available posts</p>
          ) : (
            <GridPostList posts={savePosts} showStats={false} />
          )}
        </ul>
      )}
    </div>
  );
};

export default Saved;
