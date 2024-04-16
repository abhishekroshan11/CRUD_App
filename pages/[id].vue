<template>
  <div>
    <div v-if="isLoading" class="text-5xl flex justify-center items-center">
      Loading...
    </div>
    <UContainer v-else>
      <div>
        <h1 class="text-5xl">{{ post.title }}</h1>
        <p class="text-2xl mb-2">{{ post.body }}</p>
        
        <UButton @click="openUpdateModal" class="mb-2 cursor-pointer">Update</UButton>
        
      </div>
      <UButton @click="deletePost" color="red" class="cursor-pointer text-center">Delete</UButton>
    </UContainer>
    <UModal v-model="isUpdateModalOpen">
      <div class="p-6">
        <h2 class="text-xl font-bold mb-4">Update Post</h2>
        <UForm :state="updatedPost" :validate="validateForm" @submit="updatePost">
          <UFormGroup label="Title" name="title">
            <UInput v-model="updatedPost.title" />
          </UFormGroup>
          <UFormGroup label="Body" name="body">
            <UInput v-model="updatedPost.body" />
          </UFormGroup>
          <UButton type="submit">Submit</UButton>
        </UForm>
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
import updatedPostById from "../composables/updatePost"
import deletePostById from "../composables/deletePost";

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

const toast = useToast();
// const { deletedPostIds } = storeToRefs(deletedPostsStore);

// const fetchPost = async (): Promise <void> => {
//   const postId = route.params.id; 
//   try {
//     const response = await axios.get<Post>(`https://jsonplaceholder.typicode.com/posts/${postId}`);
//     post.value = response.data;
//     updatedPost.value = { ...post.value }; 
//   } catch (error) {
//     console.error('Error fetching post:', error);
//   } finally {
//     isLoading.value = false;
//   }
// };

const fetchPost = async (): Promise<void> => {
  const postId = route.params.id.toString();
  try {
    const response = await fetchPostById(postId);
    post.value = response;
    updatedPost.value = {...post.value};
  } catch (error) {
    console.error("Error fetching post");
  }finally {
    isLoading.value= false;
  }
}

const deletePost = async (): Promise <void> => {
  let postId = route.params.id.toString();

  try {
    // await axios.delete(`https://jsonplaceholder.typicode.com/posts/${postId}`);
    const response = await deletePostById(postId)
    deletedPostsStore.addDeletedPostId(postId);

    router.push('/');

    toast.add({
      title: 'Post Deleted',
      timeout: 2000 
    });
    
  } catch (error) {
    console.error('Error deleting post:', error);

    toast.add({
      title: 'Failed to Delete',
      timeout: 2000 
    });
  }
};

const openUpdateModal = ():void => {
  isUpdateModalOpen.value = true;
};

// const updatePost = async (): Promise<void> => {
//   try {
//     const postId = route.params.id.toString();
//     const response = await axios.put<Post>(`https://jsonplaceholder.typicode.com/posts/${postId}`, updatedPost.value);
//     post.value = response.data; 
//     isUpdateModalOpen.value = false; 
//   } catch (error) {
//     console.error('Error updating post:', error);
//   }
// };

const updatePost = async (): Promise<void> => {
  try {
    const postId = route.params.id.toString();
    // const response = await axios.put<Post>(`https://jsonplaceholder.typicode.com/posts/${postId}`, updatedPost.value);
    const response = await updatedPostById(postId,updatedPost.value)
    post.value = response; 
    isUpdateModalOpen.value = false; 

    toast.add({
      title: 'Post Updated',
      timeout: 2000 
    });
  } catch (error) {
    console.error('Error updating post:', error);

    toast.add({
      title: 'Failed To Update',
      timeout: 2000 
    });
  }
};


onMounted(fetchPost);

const validateForm = (state: any) => {
  const errors = [];
  if (!state.title) errors.push({ path: 'title', message: 'Title is required' });
  if (!state.body) errors.push({ path: 'body', message: 'Body is required' });
  return errors;
};
</script>
