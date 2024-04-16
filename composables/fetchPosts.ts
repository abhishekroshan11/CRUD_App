import axios from 'axios';

export default async function fetchPosts() {
    try {
        const response = await axios.get("https://jsonplaceholder.typicode.com/posts");
        return response.data;
    } catch (error) {
        console.error('Error fetching posts:', error);
        throw new Error("Failed to fetch posts. Please try again later.");
    }    
}
