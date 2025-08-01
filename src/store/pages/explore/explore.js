
import axios from 'axios';
import { API } from '@/utils/config';
import { create } from 'zustand';
import axiosRequest from '@/lib/axiosRequest';


export const useExplorePage = create((set, get) => ({
    data: [],
    dataComments: [],

    getExplore: async () => {
        try {
            const { data } = await axiosRequest.get(`/Post/get-posts?PageSize=100`)
            set(() => ({ data: data.data }))
        } catch (error) {
            console.log(error)
        }
    },



    likePost: async postId => {
        try {
            await axiosRequest.post(`/Post/like-post?postId=${postId}`)

        
            set(state => ({
                data: state.data.map(post => {
                    if (post.postId === postId) {
                        const isLiked = post.postLike
                        return {
                            ...post,
                            postLike: !isLiked,
                            postLikeCount: isLiked
                                ? post.postLikeCount - 1
                                : post.postLikeCount + 1,
                        }
                    }
                    return post
                }),
            }))
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


    AddComment: async (text) => {

        set((state) => ({ dataComments: [...state.dataComments, text] }));
        
        try {
            await axiosRequest.post(`/Post/add-comment`, text);
        } catch (error) {
            console.log(error);
        }
    },
    setInitialComments: (comments) => {
        set(() => ({ dataComments: comments || [] }));
    },



     addFavorite: async (id) => {

        try {
            await axiosRequest.post(`/Post/add-post-favorite`, id);
        } catch (error) {
            console.log(error);
        }
        
    },

   


    addFollowingRelationship: async id => {
    try {
      await axiosRequest.post(`/FollowingRelationShip/add-following-relation-ship?followingUserId=${id}`)

      set(state => ({
        data: state.data.map(user => {
          if (user.userId === id) {
            return {
              ...user,
              isSubscriber: true,
            }
          }
          return user
        }),
      }))
      
    } catch (error) {
      console.log(error)
    }
  },

}))