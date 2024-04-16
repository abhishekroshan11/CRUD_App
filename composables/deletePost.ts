import axios from 'axios';

export default async function deletePostById(postId: string){
  try {
    const response = await axios.delete(`https://jsonplaceholder.typicode.com/posts/${postId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting post:', error);
    throw new Error('Failed to delete post');
  }
}
