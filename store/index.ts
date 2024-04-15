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