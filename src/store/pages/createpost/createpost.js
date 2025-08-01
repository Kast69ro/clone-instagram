import { create } from 'zustand';

import axiosRequest from '@/lib/axiosRequest'


const usePostStore = create((set, get) => ({
  token: null,
  image: null,
  caption: '',
  location: '',
  loading: false,
  error: '',
  success: false,

  setToken: (newToken) => set({ token: newToken }),

  setImage: (file) => set({ image: file }),
  setCaption: (text) => set({ caption: text }),
  setLocation: (text) => set({ location: text }),

  reset: () =>
    set({
      image: null,
      caption: '',
      location: '',
      loading: false,
      error: '',
      success: false,
    }),

  uploadPost: async () => {
    const { image, caption, location, token } = get();

    if (!image) {
      return set({ error: 'Изображение обязательно' });
    }

    const authToken = token || localStorage.getItem('access_token');

    if (!authToken) {
      return set({ error: 'Пользователь не авторизован' });
    }

    const formData = new FormData();
    formData.append('Images', image);
    formData.append('Content', caption);
    formData.append('Title', location);

    try {
      set({ loading: true, error: '', success: false });

      const response = await axiosRequest.post('/Post/add-post', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${authToken}`,
        },
      });

      set({
        loading: false,
        success: true,
        image: null,
        caption: '',
        location: '',
      });
    } catch (error) {
      set({
        loading: false,
        error:
          error?.response?.status === 401
            ? 'Неавторизованный доступ. Проверь токен.'
            : error?.response?.data?.message || 'Ошибка при загрузке поста',
        success: false,
      });
    }
  },
}));

export default usePostStore;
