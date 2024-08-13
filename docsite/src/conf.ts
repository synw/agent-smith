const libName = "agent-smith";
const libTitle = "Agent Smith";
const repoUrl = "https://github.com/synw/agent-smith";

const links: Array<{ href: string; name: string }> = [
  // { href: "/python", name: "Python api" },
];


const examplesExtension = "py";

async function loadHljsTheme(isDark: boolean) {
  if (isDark) {
    await import("highlight.js/styles/base16/material-darker.css")
  } else {
    await import("highlight.js/styles/stackoverflow-light.css")
  }
}

/** Import the languages you need for highlighting */
import hljs from 'highlight.js/lib/core';
import python from 'highlight.js/lib/languages/python';
import css from 'highlight.js/lib/languages/css';
//import bash from 'highlight.js/lib/languages/bash';
import typescript from 'highlight.js/lib/languages/typescript';
import xml from 'highlight.js/lib/languages/xml';
import bash from 'highlight.js/lib/languages/bash';
import yaml from 'highlight.js/lib/languages/yaml';
import javascript from 'highlight.js/lib/languages/javascript';
hljs.registerLanguage('python', python);
hljs.registerLanguage('typescript', typescript);
hljs.registerLanguage('javascript', javascript);
//hljs.registerLanguage('bash', bash);
hljs.registerLanguage('html', xml);
hljs.registerLanguage('css', css);
hljs.registerLanguage('yaml', yaml);
hljs.registerLanguage('bash', bash);

export {
  libName,
  libTitle,
  repoUrl,
  examplesExtension,
  links,
  hljs,
  loadHljsTheme
}