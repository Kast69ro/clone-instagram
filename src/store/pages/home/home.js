import axiosRequest from "@/lib/axiosRequest";
import { create } from "zustand";
import {
  differenceInHours,
  differenceInDays,
  differenceInMinutes,
} from "date-fns";


export const useUser = create((set) => ({
  users: [],
  posts: [],

  getUsers: async () => {
    try {
      const { data } = await axiosRequest.get(`/User/get-users/?PageSize=5`);
      set({ users: data.data });
    } catch (error) {
      console.error(error);
    }
  },

  getPosts: async () => {
    try {
      const { data } = await axiosRequest.get(`/Post/get-posts?PageSize=50`);
      set({ posts: data?.data });
    } catch (error) {
      console.error(error);
    }
  },

   // function baroi vaqti post kardanro nishon medihad
  formatShortTime: (date) => {
    const now = Date.now();
    const published = new Date(date);
    const diffMins = differenceInMinutes(now, published);
    if (diffMins < 60) return `${diffMins}m`;

    const diffHours = differenceInHours(now, published);
    if (diffHours < 24) return `${diffHours}h`;

    const diffDays = differenceInDays(now, published);
    return `${diffDays}d`;
  },
}));
