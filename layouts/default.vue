<template>
  <div class="flex flex-col">
    <Header /> 
    <UButton class="mx-4 self-end" @click="setColorTheme($colorMode.preference == 'dark' ? 'light' : 'dark')">Toggle Theme</UButton>
  </div>
</template>

<script setup lang="ts">

type Theme = "light" | "dark";

const setColorTheme = (newTheme:Theme) => {
  useColorMode().preference = newTheme;
}
</script>