"use client";

import { useEffect, useState, Fragment } from "react";
import Image from "next/image";
import { Ellipsis } from "lucide-react";
import "swiper/css";
import "swiper/css/navigation";
import { useUser } from "@/store/pages/home/home";
import instagramDefaultProfile from "#/icon/layout/instagramDefaultProfile.jpg";
import PostActions from "./post-actions/post-actions";

import Recommendation from "./recommendation/recommendation";
import { Box, Dialog, DialogContent } from "@mui/material";
import { usePostActions } from "@/store/pages/home/post-actions/post-actions";
import PostSkeleton from "./post-skeleton/PostSkeleton";
import Story from "./story/story";
import Link from "next/link";
import { useStory } from "@/store/pages/home/story/story";
import { jwtDecode } from "jwt-decode";
import VideoPost from "./video-post/video-post";
import { API } from "@/utils/config";

export default function Home() {
  const { posts, getPosts, formatShortTime } = useUser();
  const [open, setOpen] = useState(false);
  const { addPostFavorite } = usePostActions();
  const {
    subscribtions,
    addFollowing,
    deleteFollowing,
    getSubscribtions,
    loading,
    error,
    addStoriesPost,
  } = useStory();

  const [idx, setIdx] = useState();
  const [currentPostId, setCurrentPostId] = useState();
  const [currentUserId, setCurrentUserId] = useState();

  // Get current user info on mount
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) return;

    const decode = jwtDecode(token);
    setCurrentUserId(decode.sid);
    getSubscribtions(decode.sid);
    getPosts();
  }, []);

  // Fixed follow handlers
  const handleFollow = async (followingUserId) => {
    if (!currentUserId) return;

    try {
      await addFollowing(followingUserId, currentUserId);
      console.log("Successfully followed user:", followingUserId);
    } catch (error) {
      console.error("Failed to follow user:", error);
    }
  };

  const handleUnfollow = async (followingUserId) => {
    if (!currentUserId) return;

    try {
      await deleteFollowing(followingUserId, currentUserId);
      console.log("Successfully unfollowed user:", followingUserId);
    } catch (error) {
      console.error("Failed to unfollow user:", error);
    }
  };

  const toggleSave = (postId) => {
    addPostFavorite(postId);
  };

  const handleClickOpen = (userId, postId) => {
    setOpen(true);
    setIdx(userId);
    setCurrentPostId(postId);
  };

  const handleClose = () => {
    setOpen(false);
    setIdx(null);
    setCurrentPostId(null);
  };

  function handleStoriesPost(postId) {
    addStoriesPost(postId);
    handleClose();
  }

  // Check if user is followed in dialog
  const isFollowedInDialog = idx ? subscribtions.includes(idx) : false;

  return (
    <>
      <section className="flex items-start gap-10">
        <main className="w-full sm:w-[600px] px-2">
          <section>
            <Story />
          </section>

          <div className="flex flex-col gap-5 py-5">
            {posts.length === 0
              ? Array.from({ length: 3 }).map((_, idx) => (
                  <PostSkeleton key={idx} />
                ))
              : posts.map((post) => {
                  // Check if current user follows this post's author
                  const isFollowed = subscribtions.includes(post.userId);

                  return (
                    <section
                      key={post.postId}
                      className="border-b border-[#f0f0f0] pb-2"
                    >
                      <div className="flex flex-col gap-3">
                        <div className="flex justify-between items-center">
                          <div className="flex gap-1 items-start">
                            <div className="flex items-center gap-2">
                              <div className="rounded-full bg-gradient-to-br from-pink-500 to-yellow-400 p-[2px] cursor-pointer">
                                <div className="bg-white rounded-full p-[3px]">
                                  <Image
                                    src={
                                      post.userImage
                                        ? `${API}/images/${post.userImage}`
                                        : instagramDefaultProfile
                                    }
                                    alt="story"
                                    className="rounded-full object-cover h-[32px]"
                                    width={32}
                                    height={32}
                                  />
                                </div>
                              </div>

                              <div className="flex flex-col">
                                <p className="text-[14px] font-semibold text-[#1E293B] truncate cursor-pointer">
                                  <Link href={`/profile/${post.userId}`}>
                                    {post.userName}
                                  </Link>
                                </p>
                                <p className="text-[14px] font-medium text-[#475569] truncate">
                                  Profil
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-1 ">
                              <p className="text-[20px] text-gray-500 cursor-pointer font-bold mt-[-10] ">
                                .
                              </p>
                              <p className="tracking-wider text-[14px] text-[#737373] font-medium">
                                {formatShortTime(post.datePublished)}
                              </p>
                              {/* <p className="text-[20px] text-gray-500 cursor-pointer font-bold mt-[-10] ">.</p> */}

                              {/* Show Follow button only if not following and not current user's post */}
                              {!isFollowed && post.userId !== currentUserId && (
                                <button
                                  onClick={() => handleFollow(post.userId)}
                                  disabled={loading}
                                  className="text-blue-500 font-semibold text-sm hover:text-blue-600 disabled:opacity-50"
                                >
                                  {loading ? "Following..." : "Follow"}
                                </button>
                              )}
                            </div>
                          </div>

                          <div
                            onClick={() =>
                              handleClickOpen(post.userId, post.postId)
                            }
                            className="cursor-pointer"
                          >
                            <Ellipsis />
                          </div>
                        </div>

                        <div className="w-full sm:w-[580px]">
                          {post.images?.[0]?.endsWith(".mp4") ? (
                            <VideoPost
                              src={`${API}/images/${post.images[0]}`}
                            />
                          ) : (
                            <Image
                              src={`${API}/images/${post.images[0]}`}
                              alt="story"
                              className="w-full max-h-[600px] sm:max-h-[400px] rounded-[10px] object-cover"
                              width={580}
                              height={600}
                            />
                          )}
                        </div>
                      </div>
                      <div>
                        <PostActions
                          userName={post.userName}
                          content={post.content}
                          commentCount={post.commentCount}
                          datePublished={post.datePublished}
                          postId={post.postId}
                          comments={post.comments}
                        />
                      </div>
                    </section>
                  );
                })}
          </div>
        </main>

        <aside className="py-4 w-[31%] hidden md:block">
          <Recommendation />
        </aside>

        <Fragment>
          <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogContent className="flex flex-col gap-5 w-[450px] h-[445px]">
              <Box className="flex flex-col gap-3">
                <button className="font-bold text-red-500 border-b border-[#e9e8e8] pb-2">
                  Report
                </button>

                {/* Follow/Unfollow in dialog */}
                {idx &&
                  idx !== currentUserId &&
                  (isFollowedInDialog ? (
                    <button
                      onClick={() => {
                        handleUnfollow(idx);
                        // Don't close dialog immediately, let user see the change
                      }}
                      disabled={loading}
                      className="font-bold text-red-500 border-b border-[#e9e8e8] pb-2 disabled:opacity-50"
                    >
                      {loading ? "Unfollowing..." : "Unfollow"}
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        handleFollow(idx);
                      }}
                      disabled={loading}
                      className="text-blue-500 font-medium border-b border-[#e9e8e8] pb-2 disabled:opacity-50"
                    >
                      {loading ? "Following..." : "Follow"}
                    </button>
                  ))}

                <button
                  className="border-b border-[#e9e8e8] pb-2"
                  onClick={() => currentPostId && toggleSave(currentPostId)}
                >
                  Add to favorite
                </button>
                <button className="border-b border-[#e9e8e8] pb-2">
                  Go to post
                </button>
                <button
                  onClick={() => handleStoriesPost(currentPostId)}
                  className="border-b border-[#e9e8e8] pb-2"
                >
                  Share to story
                </button>
                <button className="border-b border-[#e9e8e8] pb-2">
                  Copy link
                </button>
                <button className="border-b border-[#e9e8e8] pb-2">
                  Embed
                </button>
                <button className="border-b border-[#e9e8e8] pb-2">
                  About this account
                </button>
                <button
                  className="border-b border-[#e9e8e8] pb-2"
                  onClick={handleClose}
                >
                  Cancel
                </button>
              </Box>
            </DialogContent>
          </Dialog>
        </Fragment>
      </section>
    </>
  );
}
