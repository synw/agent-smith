<template>
  <div v-if="isNavReady">
    <default-sidebar v-if="sidebar == 'default'"></default-sidebar>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
//import { useRoute } from 'vue-router';
import { isNavReady } from "@/state";
import DefaultSidebar from "@/components/sidebars/DefaultSidebar.vue";

//const route = useRoute();
const sidebar = ref<"default">("default");

/*watchEffect(() => {
  if (route.path.startsWith('/python')) {
    sidebar.value = "python";
  } else {
    sidebar.value = "default";
  }
})*/
</script>