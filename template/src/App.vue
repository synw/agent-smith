<template>
  <div class="flex flex-col background">
    <the-header id="header" class="fixed"></the-header>
    <div class="hmain flex flex-row w-full mt-16">
      <div class="border-r bord-lighter w-80 hmain fixed"></div>
      <div class="p-3 mx-auto h-full w-full ml-96 container">
        <router-view></router-view>
      </div>
    </div>
  </div>

  <Toast />
  <ConfirmDialog>
    <template #message="slotProps">
      <div class="flex flex-row items-center p-4">
        <!-- div>
          <named-icon :icon="`${slotProps.message.icon}`" class="text-3xl"></named-icon>
        </div -->
        <div class="pl-2">{{ slotProps.message.message }}</div>
      </div>
    </template>
  </ConfirmDialog>
</template>

<script setup lang="ts">
import { onBeforeMount, onMounted } from 'vue';
import TheHeader from "@/components/TheHeader.vue";
import ConfirmDialog from "primevue/confirmdialog";
import Toast from "primevue/toast";
import { initNotifyService } from "@/services/notify";
import { initState } from './state';

onBeforeMount(() => initState());
onMounted(() => initNotifyService());
</script>

<style lang="sass">
#header
  height: 4rem !important
.hmain
  height: calc(100vh - 4rem)
a, a:visited, a:active
  text-decoration: underline !important
.dark
  .prose
    @apply text-neutral-200
    & h1, h2, h3, h4, h5, a
      @apply text-neutral-400
.static-code, #router, #footer
  @apply max-w-screen-lg
.main-h
  height: calc(100vh - 4rem)
  @apply overflow-y-auto
.p-inputtext
  @apply background bord-lighter
.pystatus .ficon
  font-size: 1.8rem !important
</style>
