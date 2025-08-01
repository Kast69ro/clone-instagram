import { create } from "zustand";
import axiosRequest from './../../lib/axiosRequest';

export const useDrawerNotification = create((set, get) => ({

    data: [],

    openNotifDrawer: false,
    loading: false,
    openDrawerNotifFunc: () => set({ openNotifDrawer: true }),
    closeDrawer: () => set({ openNotifDrawer: false }),
    toggleDrawerNotif: () => set(state => ({ openNotifDrawer: !state.openNotifDrawer })),


    getUsers: async () => {
        try {
            const { data } = await axiosRequest.get(`/User/get-users`)
            set(() => ({ data: data.data }))
        } catch (error) {
            console.log(error)
        }
    },
    

    following: async (id) => {
        try {
            await axiosRequest.post(`/FollowingRelationShip/add-following-relation-ship?followingUserId=${id}`)
            await get().getExplore()
        } catch (error) {
            console.log(error)
        }
    },

    unfollowing: async (id) => {
        try {
            await axiosRequest.delete(`/FollowingRelationShip/delete-following-relation-ship?followingUserId=${id}`)
            await get().getExplore()
        } catch (error) {
            console.log(error)
        }
    },

}))