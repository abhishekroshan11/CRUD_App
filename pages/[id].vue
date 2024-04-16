<template>
  <div>
    <div v-if="isLoading" class="text-5xl flex justify-center items-center">
      Loading...
    </div>
    <UContainer v-else>
      <div>
        <h1 class="text-5xl">{{ post.title }}</h1>
        <p class="text-2xl mb-2">{{ post.body }}</p>
        
          <UButton @click="openUpdateModal" class="mb-2">Update</UButton>
          
        
      </div>
      <UButton @click="deletePost">Delete</UButton>
    </UContainer>
    <UModal v-model="isUpdateModalOpen">
      <div class="p-6">
        <h2 class="text-xl font-bold mb-4">Update Post</h2>
        <UInput v-model="updatedPost.title" placeholder="Title" class="mb-4" />
        <UInput v-model="updatedPost.body" placeholder="Body" class="mb-4" />
        <UButton @click="updatePost">Submit</UButton>
      </div>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRouter, useRoute } from 'vue-router';
import { useDeletedPostsStore } from '../store/index';
import { storeToRefs } from 'pinia';

interface Post {
  id: string;
  title: string;
  body: string;
}

const post = ref<Post>({ id: '', title: '', body: '' });
const updatedPost = ref<Post>({ id: '', title: '', body: '' });
const route = useRoute(); 
const router = useRouter();
const isLoading = ref<boolean>(true);
const isUpdateModalOpen = ref<boolean>(false);
const deletedPostsStore = useDeletedPostsStore();
const { deletedPostIds } = storeToRefs(deletedPostsStore);

const fetchPost = async (): Promise <void> => {
  const postId = route.params.id; 
  try {
    const response = await axios.get<Post>(`https://jsonplaceholder.typicode.com/posts/${postId}`);
    post.value = response.data;
    updatedPost.value = { ...post.value }; 
  } catch (error) {
    console.error('Error fetching post:', error);
  } finally {
    isLoading.value = false;
  }
};

const deletePost = async (): Promise <void> => {
  let postId = route.params.id;
  if (Array.isArray(postId)) {
    postId = postId[0];
  }

  try {
    await axios.delete(`https://jsonplaceholder.typicode.com/posts/${postId}`);
    deletedPostsStore.addDeletedPostId(postId);
    router.push('/');
  } catch (error) {
    console.error('Error deleting post:', error);
  }
};

const openUpdateModal = ():void => {
  isUpdateModalOpen.value = true;
};

const updatePost = async (): Promise<void> => {
  try {
    const postId = route.params.id;
    const response = await axios.put<Post>(`https://jsonplaceholder.typicode.com/posts/${postId}`, updatedPost.value);
    post.value = response.data; 
    isUpdateModalOpen.value = false; 
  } catch (error) {
    console.error('Error updating post:', error);
  }
};

onMounted(fetchPost);
</script>
