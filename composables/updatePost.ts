// useUpdatePost.ts
import axios from 'axios';

export default async function updatedPostById(postId: string, updatedPost: any){
  try {
    const response = await axios.put(`https://jsonplaceholder.typicode.com/posts/${postId}`, updatedPost);
    return response.data;
  } catch (error) {
    console.error('Error updating post:', error);
    throw new Error('Failed to update post');
  }
}
