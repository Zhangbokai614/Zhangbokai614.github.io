import { navbar } from "vuepress-theme-hope";

export default navbar([
  "/",
  {
    text: "MySQL",
    icon: "pen-to-square",
    prefix: "/mysql/",
    children: [
      {
        text: "InnoDB",
        icon: "pen-to-square",
        prefix: "innodb/",
        children: [
          "buffer_pool",
        ],
      },
      {
        text: "Data Type",
        icon: "pen-to-square",
        prefix: "date_type/",
        children: [
          "integer",
        ],
      },
    ],
  },
  {
    text: "MongoDB",
    icon: "pen-to-square",
    prefix: "/mongo/",
    children: [
      {
        text: "Transaction",
        icon: "pen-to-square",
        link: "transaction"
      },
    ],
  },
]);
