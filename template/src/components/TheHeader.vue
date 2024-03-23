<template>
  <sw-topbar :topbar="topBar" class="z-10 flex items-center w-full h-16 primary" breakpoint="lg">
    <template #mobile-back>
      <i-ion-arrow-back-outline class="inline-flex ml-2 text-3xl" v-if="!isHome"></i-ion-arrow-back-outline>
    </template>
    <template #mobile-branding>
      <div class="inline-flex flex-row items-center h-full pt-1 ml-2 text-2xl truncate" @click="$router.push('/')">
        <img alt="" src="@/assets/logo.png" v-if="isHome" class="h-14 inline-block mx-3" />
        <span class="text-lg">{{ baseTitle }}</span>
      </div>
    </template>
    <template #branding>
      <div class="flex flex-row items-center h-full cursor-pointer" @click="$router.push('/')">
        <img alt="" src="@/assets/logo.png" class="h-14 inline-block mx-3 overflow-ellipsis" />
        <span class="text-lg">{{ baseTitle }}</span>
      </div>
    </template>
    <template #menu>
      <div class="flex flex-row items-center justify-end w-full h-full space-x-1">
        <!-- button class="border-none btn" @click="$router.push('/page')">Page 1</button -->
        <div class="pr-5 text-lg cursor-pointer txt-lighter dark:txt-light" @click="user.toggleDarkMode()">
          <i-fa-solid:moon v-if="!user.isDarkMode.value"></i-fa-solid:moon>
          <i-fa-solid:sun v-else></i-fa-solid:sun>
        </div>
      </div>
    </template>
    <template #mobile-menu>
      <div class="flex flex-col p-3 pb-5 space-y-3 lighter border-y-2 bord-primary">
        <!-- div>
          <button class="border-none btn" @click="$router.push('/page'); topBar.closeMenu()">Page 1</button>
        </div -->
        <div class="text-lg cursor-pointer" @click=" user.toggleDarkMode(); topBar.closeMenu()">
          <template v-if="!user.isDarkMode.value">
            <i-fa-solid:moon></i-fa-solid:moon>&nbsp;Dark mode
          </template>
          <template v-else>
            <i-fa-solid:sun></i-fa-solid:sun>&nbsp;Light mode
          </template>
        </div>
      </div>
    </template>
  </sw-topbar>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { SwTopbar, useTopbar } from "@snowind/header";
import { user } from "@/state";
import { useRouter } from 'vue-router';
import { baseTitle } from "@/conf";

const isMenuVisible = ref(false);
const router = useRouter()
const topBar = useTopbar(router);

const isHome = computed<boolean>(() => router.currentRoute.value.path == "/");
</script>

<style lang="sass">
#mobile-menu
  @apply absolute left-0 z-40 flex flex-col w-full space-y-3 text-xl top-16 lighter
*
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0)
</style>