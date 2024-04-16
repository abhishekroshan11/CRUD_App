<template>
  <div class="mx-4">
    <UButton class="my-4" size="md" @click="openModal">Add Post</UButton>
    <UInput v-model="searchQuery" size="md" color="gray" variant="outline" placeholder="Search..." class="mb-4 max-w-40" />
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      <Card v-for="post in filteredPosts" :key="post.id" :title="post.title" :body="post.body" @click="goToPost(post.id)" />
    </div>
    <UModal v-model="isModalOpen">
      <div class="p-6">
        <h2 class="text-xl font-bold mb-4">Add New Post</h2>
        <UInput v-model="newPost.title" placeholder="Title" class="mb-4" />
        <UInput v-model="newPost.body" placeholder="Body" class="mb-4" />
        <UButton @click="addPost">Submit</UButton>
      </div>
    </UModal>
    <div v-if="isLoading" class="text-5xl flex justify-center items-center">
      Loading...
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { useDeletedPostsStore } from '../store/index';

interface Post {
  id: string;
  title: string;
  body: string;
}

const router = useRouter();
const posts = ref<Post[]>([]);
const isModalOpen = ref<boolean>(false);
const newPost = ref<{ title: string; body: string }>({ title: '', body: '' });
const searchQuery = ref<string>('');
const isLoading = ref<boolean>(true);
const deletedPostsStore = useDeletedPostsStore();




const fetchPosts = async (): Promise<void> => {
  isLoading.value = true;
  try {
    const response = await axios.get<Post[]>('https://jsonplaceholder.typicode.com/posts');
    posts.value = response.data;
  } catch (error) {
    console.error('Error fetching posts:', error);
  } finally {
    isLoading.value = false;
  }
};

const openModal = (): void => {
  isModalOpen.value = true;
};

const addPost = async (): Promise <void> => {
  try {
    const id = (posts.value.length + 1).toString(); 
    const newPostWithId: Post = { ...newPost.value, id }; 
    const response = await axios.post<Post>('https://jsonplaceholder.typicode.com/posts', newPostWithId);
    posts.value.push(response.data);
    newPost.value = { title: '', body: '' };
    closeModal();
  } catch (error) {
    console.error('Error adding post:', error);
  }
};

const closeModal = (): void => {
  isModalOpen.value = false;
};


const filteredPosts = computed(() => {
  if (!searchQuery.value) {
    const remaining = posts.value.filter((post) => {
      const postIdString = post.id.toString(); 
      if (!deletedPostsStore.deletedPostIds.includes(postIdString)) {
        return post;
      }
    });

    return remaining;
  } else {
    return posts.value.filter(post =>
      post.title.toLowerCase().startsWith(searchQuery.value.toLowerCase()) &&
      !deletedPostsStore.deletedPostIds.includes(post.id.toString()) 
    );
  }
});


const goToPost = (postId: string) => {
  router.push({ path: `/${postId}` });
};

onMounted(fetchPosts);
</script>
