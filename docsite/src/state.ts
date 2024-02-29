import { ref } from "vue";
import { usePython } from "usepython";
import { useApi } from "restmix";
import { User } from "@snowind/state";
import { pipPackages, pyodidePackages, loadHljsTheme, initCode } from "@/conf";
import { useNav, useDocloader } from "@docdundee/nav";

const user = new User();
const py = usePython();
const api = useApi({
  serverUrl: import.meta.env.MODE == "production" ? import.meta.env.BASE_URL : "",
});
const docloader = useDocloader(api);
const nav = useNav(docloader, api);
const isNavReady = ref(false);
nav.init().then(() => {
  isNavReady.value = true;
})

async function initPy() {
  await py.load(pyodidePackages, pipPackages, initCode)
}

function initState() {
  loadHljsTheme(user.isDarkMode.value);
  //initPy();
}


export { py, user, nav, api, initState, isNavReady }