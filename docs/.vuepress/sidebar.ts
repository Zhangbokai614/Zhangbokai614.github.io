import { sidebar } from "vuepress-theme-hope";

export default sidebar({
  "/": [
    "",
    "intro",
    {
      text: "MySQL",
      icon: "book",
      prefix: "mysql/",
      children: ["innodb", "date_type"],
    },
    // "slides",
  ],
});
