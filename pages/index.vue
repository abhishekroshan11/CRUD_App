<template>
  <div class="mx-4">
    <UButton class="my-4 cursor-pointer" size="md" @click="openModal">Add Post</UButton>
    <UInput v-model="searchQuery" size="md" color="gray" variant="outline" placeholder="Search..." class="mb-4 max-w-xs" />
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 cursor-pointer">
      <Card v-for="post in filteredPosts" :key="post.id" :title="post.title" :body="post.body" @click="goToPost(post.id)" />
    </div>
    <UModal v-model="isModalOpen">
      <div class="p-6">
        <h2 class="text-xl font-bold mb-4">Add New Post</h2>
        <UForm :state="newPost" :validate="validateForm" @submit="addPost">
          <UFormGroup label="Title" name="title">
            <UInput v-model="newPost.title" />
          </UFormGroup>
          <UFormGroup label="Body" name="body">
            <UInput v-model="newPost.body" />
          </UFormGroup>
          <UButton type="submit">Submit</UButton>
        </UForm>
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

const toast = useToast();

const router = useRouter();
const posts = ref<Post[]>([]);
const isModalOpen = ref<boolean>(false);
const newPost = ref<{ title: string; body: string }>({ title: '', body: '' });
const searchQuery = ref<string>('');
const isLoading = ref<boolean>(true);
const deletedPostsStore = useDeletedPostsStore();
import fetchPosts from "@/composables/fetchPosts";

// const fetchPost = async (): Promise<void> => {
//   isLoading.value = true;
//   try {
//     const response = await axios.get<Post[]>('https://jsonplaceholder.typicode.com/posts');
//     posts.value = response.data;
//   } catch (error) {
//     console.error('Error fetching posts:', error);
//   } finally {
//     isLoading.value = false;
//   }
// };

const fetchPost = async (): Promise<void> => {
  try {
    const response = await fetchPosts();
    posts.value = response;
  } catch (error) {
    console.log("Error");
  }finally {
    isLoading.value = false;
  }
}

const openModal = (): void => {
  isModalOpen.value = true;
};

// const addPost = async (): Promise <void> => {
//   try {
//     const id = (posts.value.length + 1).toString(); 
//     const response = await axios.post<Post>('https://jsonplaceholder.typicode.com/posts', { ...newPost.value, id });
//     posts.value.push(response.data);
//     newPost.value = { title: '', body: '' };
//     closeModal();
//   } catch (error) {
//     console.error('Error adding post:', error);
//   }
// };

const addPost = async ():Promise <void> => {
  try {
    const id = (posts.value.length + 1).toString();
    const response = await createPost({...newPost.value,id});
    posts.value.push(response);
    newPost.value = { title: '', body: '' };
    closeModal();

    toast.add({
      title: 'Post Added',
      timeout: 2000 
    });
  } catch (error) {
    console.error(error);
    toast.add({
      title: 'Failed To Add Post',
    });
    
  }
}

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

onMounted(fetchPost);

const validateForm = (state: any) => {
  const errors = [];
  if (!state.title) errors.push({ path: 'title', message: 'Title is required' });
  if (!state.body) errors.push({ path: 'body', message: 'Body is required' });
  return errors;
};
</script>
