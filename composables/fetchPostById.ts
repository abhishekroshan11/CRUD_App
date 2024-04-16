// useFetchPost.ts

import axios from 'axios';

export default async function fetchPostById(postId: string) {
    try {
      const response = await axios.get(`https://jsonplaceholder.typicode.com/posts/${postId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching post:', error);
      throw new Error("Error Fetching Data");
    }
  };

 

