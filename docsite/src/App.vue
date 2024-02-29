<template>
  <the-header :lib-title="libTitle" :links="links"></the-header>
  <div id="main" class="absolute p-5 pb-16 md:w-[calc(100%_-_20rem)] top-16 md:left-80 main-h">
    <router-view></router-view>
  </div>
  <the-sidebar class="fixed left-0 hidden p-3 overflow-y-auto w-80 top-16 md:block secondary main-h"></the-sidebar>
</template>

<script setup lang="ts">
import { onBeforeMount } from "vue";
import TheHeader from "./components/TheHeader.vue";
import TheSidebar from "./components/TheSidebar.vue";
import { libTitle, links } from "@/conf";
import { initState } from "./state";
import { useRouter } from "vue-router";

const router = useRouter();

function openLink(url: string) {
  if (url.startsWith("http")) {
    window.open(url, '_blank');
  } else {
    router.push(url)
  }
}

// global helper for markdown links
// use these links format in markdown files:
// <a href="javascript:openLink('/category/name')">My link</a>
window["openLink"] = openLink;

onBeforeMount(() => initState());
</script>

<style lang="sass">
a, a:visited, a:active
  text-decoration: underline !important
.dark
  .prose
    @apply text-neutral-200
    & h1, h2, h3, h4, h5, a
      @apply text-neutral-400
.static-code
  @apply max-w-screen-lg
.main-h
  height: calc(100vh - 4rem)
  @apply overflow-y-auto
.p-inputtext
  @apply background bord-lighter
</style>

