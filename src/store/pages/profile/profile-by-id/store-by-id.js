import axiosRequest from "@/lib/axiosRequest";
import { API } from "@/utils/config";
import { create } from "zustand";

export const useProfileByIdStore = create((set, get) => ({
  infoById: null,
  postById: null,
  storyById: null,
  chats: null,

  getInfoById: async (id) => {
    try {
      const { data } = await axiosRequest.get(
        `${API}/UserProfile/get-is-follow-user-profile-by-id?followingUserId=${id}`
      );

      set({ infoById: data.data });
    } catch (error) {
      console.error("Error fetching user info by ID:", error);
    }
  },

  getPostById: async (id) => {
    let { data } = await axiosRequest.get(`${API}/Post/get-posts?UserId=${id}`);
    set({ postById: data.data });
  },
  getStoriesById: async (id) => {
    try {
      const { data } = await axiosRequest.get(
        `${API}/Story/get-user-stories/${id}`
      );

      set({ storyById: data.data });
    } catch (error) {
      console.log(error);
    }
  },

  likeStory: async (id) => {
    await axiosRequest.post(`${API}/Story/LikeStory?storyId=${id}`);
  },

  deleteStories: async (id) => {
    await axiosRequest.delete(`${API}/Story/DeleteStory?id=${id}`);
  },
  likePost: async (id, sid) => {
    await axiosRequest.post(`${API}/Post/like-post?postId=${id}`);
    get().getInfo(sid);
  },

  addComment: async (obj, sid) => {
    await axiosRequest.post(`${API}/Post/add-comment`, obj);
    get().getPostById(sid);
  },
  deleteComment: async (id, sid) => {
    await axiosRequest.delete(`${API}/Post/delete-comment?commentId=${id}`);
    get().getPostById(sid);
  },
  getChat: async () => {
    let { data } = await axiosRequest.get(`${API}/Chat/get-chats`);
    set({ chats: data.data });
    
    
  },
  
}));
