import axiosRequest from '@/lib/axiosRequest'
import { API } from '@/utils/config'
import { create } from 'zustand'

export const useReelsPage = create((set, get) => ({
  data: [],

  getReels: async () => {
    try {
      let { data } = await axiosRequest.get(`/Post/get-reels?PageSize=1000`)
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

  addFollowingRelationship: async id => {
    try {
      await axiosRequest.post(
        `/FollowingRelationShip/add-following-relation-ship?followingUserId=${id}`
      )
      set(state => ({
        data: state.data.map(user => {
          if (user.userId === id) {
            return { ...user, isSubscriber: true }
          }
          return user
        }),
      }))
    } catch (error) {
      console.log(error)
    }
  },

  deleteFollowingRelationship: async id => {
    try {
      await axiosRequest.delete(
        `/FollowingRelationShip/delete-following-relation-ship?followingUserId=${id}`
      )
      set(state => ({
        data: state.data.map(user => {
          if (user.userId === id) {
            return { ...user, isSubscriber: false }
          }
          return user
        }),
      }))
    } catch (error) {
      console.log(error)
    }
  },

  addFavouriePost: async postId => {
    try {
      await axiosRequest.post(
        `${API}/Post/add-post-favorite`,
        { postId }
      )
      set(state => ({
        data: state.data.map(post => {
          if (post.postId === postId) {
            return { ...post, postFavorite: !post.postFavorite }
          }
          return post
        }),
      }))
    } catch (error) {
      console.log(error)
    }
  },

addComment: async ({ postId, commentText }) => {
  try {
    await axiosRequest.post(
      `${API}/Post/add-comment`,
      {
        comment: commentText,
        postId,
      }
    )

    // Локально обновитш мекнем
    set((state) => ({
      data: state.data.map((post) => {
        if (post.postId === postId) {
          const newComment = {
            comment: commentText,
           
            userName: state.currentUserName || "Вы",
            dateCommented: new Date().toISOString(), 
          }
          return {
            ...post,
            commentCount: post.commentCount + 1,
            comments: [...(post.comments || []), newComment],
          }
        }
        return post
      }),
    }))
  } catch (err) {
    console.log("Ошибка при добавлении комментария", err)
  }
},



}))
