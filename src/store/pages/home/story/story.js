import axiosRequest from "@/lib/axiosRequest";
import { create } from "zustand";

export const useStory = create((set, get) => ({
  stories: [],
  subscribtions: [],
  loading: false,
  error: null,

  // Set loading state
  setLoading: (loading) => set({ loading }),

  // Set error state
  setError: (error) => set({ error }),

  getStories: async () => {
    try {
      set({ loading: true, error: null });
      const { data } = await axiosRequest.get(`/Story/get-stories`);
      const subscribtions = get().subscribtions;
      const filteredStories = data?.filter((story) =>
        subscribtions.includes(story.userId)
      );

      set({ stories: filteredStories, loading: false });
      console.log("stories: ", data);
      return data;
    } catch (error) {
      console.error("Failed to get stories:", error);
      set({ error: "Failed to load stories", loading: false });
      throw error;
    }
  },

  addStories: async (formData) => {
    try {
      set({ loading: true, error: null });
      await axiosRequest.post(`/Story/AddStories`, formData);
      set({ loading: false });
    } catch (error) {
      console.error("Failed to add story:", error);
      set({ error: "Failed to add story", loading: false });
      throw error;
    }
  },

  addStoriesPost: async (postId) => {
    try {
      // set({ loading: true, error: null });
      await axiosRequest.post(`/Story/AddStories?PostId=${postId}`);
      // set({ loading: false });
    } catch (error) {
      console.error("Failed to add story:", error);
      // set({ error: "Failed to add story", loading: false });
      // throw error;
    }
  },

  deleteStories: async (id) => {
    await axiosRequest.delete(`/Story/DeleteStory?id=${id}`);
  },

  getSubscribtions: async (userID) => {
    if (!userID) {
      console.warn("getSubscribtions called without userID");
      return;
    }

    try {
      set({ loading: true, error: null });
      const { data } = await axiosRequest.get(
        `/FollowingRelationShip/get-subscriptions?UserId=${userID}`
      );

      // Extract userIds from the response
      const userIds =
        data?.data?.map((item) => item.userShortInfo.userId) || [];
      set({ subscribtions: userIds, loading: false });

      return userIds;
    } catch (error) {
      console.error("Failed to get subscriptions:", error);
      set({ error: "Failed to load subscriptions", loading: false });
      throw error;
    }
  },

  // Fixed: Accept both userIds and update state properly
  addFollowing: async (followingUserId, currentUserId) => {
    if (!followingUserId || !currentUserId) {
      throw new Error("Both followingUserId and currentUserId are required");
    }

    try {
      set({ loading: true, error: null });

      // Make API call to follow user
      await axiosRequest.post(
        `/FollowingRelationShip/add-following-relation-ship?followingUserId=${followingUserId}`
      );

      // Optimistically update local state
      const subscribtions = get().subscribtions;
      if (!subscribtions.includes(followingUserId)) {
        set({ subscribtions: [...subscribtions, followingUserId] });
      }

      set({ loading: false });
    } catch (error) {
      console.error("Failed to follow user:", error);
      set({ error: "Failed to follow user", loading: false });
      throw error;
    }
  },

  // Fixed: Accept currentUserId parameter for consistency
  deleteFollowing: async (followingUserId, currentUserId) => {
    if (!followingUserId) {
      throw new Error("followingUserId is required");
    }

    try {
      set({ loading: true, error: null });

      // Make API call to unfollow user
      await axiosRequest.delete(
        `/FollowingRelationShip/delete-following-relation-ship?followingUserId=${followingUserId}`
      );

      // Update local state by removing the unfollowed user
      const subscribtions = get().subscribtions;
      set({
        subscribtions: subscribtions.filter((id) => id !== followingUserId),
      });

      set({ loading: false });
    } catch (error) {
      console.error("Failed to unfollow user:", error);
      set({ error: "Failed to unfollow user", loading: false });
      throw error;
    }
  },

  // Helper method to check if user is followed
  isUserFollowed: (userId) => {
    const subscribtions = get().subscribtions;
    return subscribtions.includes(userId);
  },

  // Helper method to get follow count
  getFollowCount: () => {
    const subscribtions = get().subscribtions;
    return subscribtions.length;
  },

  // Reset error state
  clearError: () => set({ error: null }),
}));
