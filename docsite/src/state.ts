import { ref } from "vue";
import { useApi } from "restmix";
import { User } from "@snowind/state";
import { loadHljsTheme } from "@/conf";
import { useNav, useDocloader } from "@docdundee/nav";

const user = new User();

const api = useApi({
  serverUrl: import.meta.env.MODE == "production" ? import.meta.env.BASE_URL : "",
});
const docloader = useDocloader(api);
const nav = useNav(docloader, api);
const isNavReady = ref(false);
nav.init().then(() => {
  isNavReady.value = true;
});

function initState() {
  loadHljsTheme(user.isDarkMode.value);
  //initPy();
}

export { user, nav, api, initState, isNavReady }