import { defineStore } from 'pinia';

export const useDeletedPostsStore = defineStore('deletedPosts', {
  state: () => ({
    deletedPostIds: [] as string[],
  }),
  actions: {
    addDeletedPostId(postId: string) {
      this.deletedPostIds.push(postId);
    },
  },
});

export const useDarkModeStore = defineStore('darkMode', {
  state: () => ({
    isDarkModeEnabled: false,
  }),
  actions: {
    toggleDarkMode() {
      if(this.isDarkModeEnabled===false){
        this.isDarkModeEnabled = true;
      }else{
        this.isDarkModeEnabled = false;
      }
      
    },
  },
});
