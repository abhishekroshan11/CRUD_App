import axios from 'axios';

interface NewPost {
  id: string;
  title: string;
  body: string;
}

export default async function createPost(newPost: NewPost){
  try {
    const response = await axios.post('https://jsonplaceholder.typicode.com/posts', newPost);
    return response.data;
  } catch (error) {
    console.error('Error creating post:', error);
    throw new Error('Failed to create post');
  }
}
