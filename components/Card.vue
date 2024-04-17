<template>
    <div class="p-4 bg-slate-200 shadow rounded-md dark:bg-slate-800 ">
      <h2 class="text-black text-lg font-bold mb-2 dark:text-stone-50">{{ title }}</h2>
      <p class="text-gray-700 dark:text-amber-50">{{ body }}</p>
    </div>
  </template>
  
  <script setup>
  
  const props = defineProps({
    title: String,
    body: String,
  });
  
  </script>
  