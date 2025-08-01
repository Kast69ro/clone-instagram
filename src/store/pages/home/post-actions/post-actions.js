import axiosRequest from "@/lib/axiosRequest";
import { create } from "zustand";

export const usePostActions = create((set, get) => ({
  postByID: {},
  savedPosts: [],
  likedPosts: [],
  likeCounts: {},

  addLikePost: async (postId) => {
    try {
      const { likedPosts, likeCounts } = get();
      const isLiked = likedPosts.includes(postId);
      const currentCount = likeCounts?.[postId] || 0;

      if (isLiked) {
        await axiosRequest.post(`/Post/like-post?postId=${postId}`);
        set({
          likedPosts: likedPosts.filter((id) => id !== postId),
          likeCounts: { ...likeCounts, [postId]: currentCount - 1 },
        });
      } else {
        await axiosRequest.post(`/Post/like-post?postId=${postId}`);
        set({
          likedPosts: [...likedPosts, postId],
          likeCounts: { ...likeCounts, [postId]: currentCount + 1 },
        });
      }
    } catch (error) {
      console.error(error);
    }
  },

  isPostLiked: (postId) => {
    const { likedPosts } = get();
    return likedPosts.includes(postId);
  },

  getLikeCount: (postId) => {
    const { likeCounts } = get();
    return likeCounts?.[postId] || 0;
  },

  addPostFavorite: async (postId) => {
    try {
      await axiosRequest.post(`/Post/add-post-favorite`, { postId });

      const saved = get().savedPosts;
      const alreadySaved = saved.includes(postId);

      set({
        savedPosts: alreadySaved
          ? saved.filter((id) => id !== postId) // агар буд, пас кун
          : [...saved, postId], // агар набуд, илова кун
      });
    } catch (error) {
      console.error(error);
    }
  },

  isPostSaved: (postId) => {
    return get().savedPosts.includes(postId);
  },

  getPostByID: async (postId) => {
    try {
      const { data } = await axiosRequest.get(
        `/Post/get-post-by-id?id=${postId}`
      );
      const likeCount = data?.data?.postLikeCount;
      set((state) => ({
        postByID: data?.data,
        likeCounts: { ...state.likeCounts, [postId]: likeCount },
      }));
    } catch (error) {
      console.error(error);
    }
  },

  postComment: async (comment, postId) => {
    try {
      await axiosRequest.post(`/Post/add-comment`, {
        comment,
        postId,
      });
      set((state) => ({
        postByID: {
          ...state.postByID,
          comments: [
            ...(state.postByID.comments || []),
            {
              comment: comment,
            },
          ],
        },
      }));
      await get().getPostByID(postId);
    } catch (error) {
      console.error(error);
    }
  },

  deleteComment: async (commentId) => {
    await axiosRequest.delete(`/Post/delete-comment?commentId=${commentId}`);
    get().getPostByID();
  },
}));
