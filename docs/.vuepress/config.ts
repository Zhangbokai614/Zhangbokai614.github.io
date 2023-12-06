import { defineUserConfig } from "vuepress";
import theme from "./theme.js";

export default defineUserConfig({
  base: "/",

  lang: "zh-CN",
  title: "Transistor",
  description: "Output is the best input",

  theme,

  // Enable it with pwa
  // shouldPrefetch: false,
});
