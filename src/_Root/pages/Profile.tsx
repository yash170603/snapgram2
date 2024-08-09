import GridPostList from "@/components/shared/GridPostList";

import { useUserContext } from "@/context/AuthContext";
import {
  Route,
  Routes,
  Link,
  Outlet,
  useParams,
  useLocation,
} from "react-router-dom";
import LikedPosts from "./LikedPosts";
import { Loader } from "lucide-react";
import { useGetCurrentUser } from "@/lib/react-query/queriesAndMutations";
import { getUserById } from "@/lib/Appwrite/api";
import { useEffect, useState } from "react";

interface StabBlockProps {
  value: string | number;
  label: string;
}

const StatBlock = ({ value, label }: StabBlockProps) => (
  <div className="flex-center gap-2">
    <p className="small-semibold lg:body-bold text-primary-500">{value}</p>
    <p className="small-medium lg:base-medium text-light-2">{label}</p>
  </div>
);

const Profile = () => {
  const { id } = useParams();
  const { user } = useUserContext();
  console.log("This is currently logged in user");
  console.log(user);
  const { pathname } = useLocation();

  const { data: currentUser } = useGetCurrentUser();
  console.log("These are all the details of the currently logged user");
  console.log(currentUser);

  const [user2, setUser2] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (id) {
        try {
          const userData = await getUserById(String(id));
          setUser2(userData);
        } catch (error) {
          console.error("Failed to fetch user data:", error);
        }
      }
    };
    fetchUser();
  }, [id]);

  console.log(`This is user 2 `);
  console.log(user2);

  if (!currentUser || !user2)
    return (
      <div className="flex-center w-full h-full">
        <Loader />
      </div>
    );

  return (
    <div className="profile-container">
      <div className="profile-inner_container">
        <div className="flex xl:flex-row flex-col max-xl:items-center flex-1 gap-7">
          <img
            src={user2.imageurl || "/assets/icons/profile-placeholder.svg"}
            alt="profile"
            className="w-28 h-28 lg:h-36 lg:w-36 rounded-full"
          />
          <div className="flex flex-col flex-1 justify-between md:mt-2">
            <div className="flex flex-col w-full">
              <h1 className="text-center xl:text-left h3-bold md:h1-semibold w-full">
                {user2.name}
              </h1>
              <p className="small-regular md:body-medium text-light-3 text-center xl:text-left">
                @{user2.username}
              </p>
            </div>

            <div className="flex gap-8 mt-10 items-center justify-center xl:justify-start flex-wrap z-20">
              <StatBlock value={user2.posts.length} label="Posts" />
            </div>

            <p className="small-medium md:base-medium text-center xl:text-left mt-7 max-w-screen-sm">
              {user2.bio}
            </p>
          </div>

          {/* <div className="flex justify-center gap-4">
            <div className={`${user2.id === currentUser.$id   }`}>
              <Link
                to={`/update-profile/${currentUser.$id}`}
                className={`h-12 bg-dark-4 px-5 text-light-1 flex-center gap-2 rounded-lg ${
                  user2.id !== currentUser.$id && "hidden"
                }`}>
                <img
                  src={"/assets/icons/edit.svg"}
                  alt="edit"
                  width={20}
                  height={20}
                />
                <p className="flex whitespace-nowrap small-medium">
                  Edit Profile
                </p>
              </Link>
            </div>
          </div> */}

          <div className="flex justify-center gap-4">
            <div className={user2.$id === currentUser.$id ? "" : "hidden"}>
              <Link
                to={`/update-profile/${currentUser.$id}`}
                className="h-12 bg-dark-4 px-5 text-light-1 flex-center gap-2 rounded-lg"
              >
                <img
                  src={"/assets/icons/edit.svg"}
                  alt="edit"
                  width={20}
                  height={20}
                />
                <p className="flex whitespace-nowrap small-medium">
                  Edit Profile
                </p>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {currentUser.$id === user2.$id && (
        <div className="flex max-w-5xl w-full">
          <Link
            to={`/profile/${id}`}
            className={`profile-tab rounded-l-lg ${
              pathname === `/profile/${id}` && "!bg-dark-3"
            }`}
          >
            <img
              src={"/assets/icons/posts.svg"}
              alt="posts"
              width={20}
              height={20}
            />
            Posts
          </Link>
          <Link
            to={`/profile/${id}/liked-posts`}
            className={`profile-tab rounded-r-lg ${
              pathname === `/profile/${id}/liked-posts` && "!bg-dark-3"
            }`}
          >
            <img
              src={"/assets/icons/like.svg"}
              alt="like"
              width={20}
              height={20}
            />
            Liked Posts
          </Link>
        </div>
      )}

      <Routes>
        <Route
          index
          element={<GridPostList posts={user2.posts} showUser={false} />}
        />
        {currentUser.$id === user.id && (
          <Route path="/liked-posts" element={<LikedPosts />} />
        )}
      </Routes>
      <Outlet />
    </div>
  );
};

export default Profile;
