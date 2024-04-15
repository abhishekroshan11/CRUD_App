<template>
    <div class="p-4 bg-white shadow rounded-md">
      <h2 class="text-black text-lg font-bold mb-2">{{ title }}</h2>
      <p class="text-gray-700">{{ body }}</p>
    </div>
  </template>
  
  <script setup>
  
  const props = defineProps({
    title: String,
    body: String,
  });
  
  </script>
  