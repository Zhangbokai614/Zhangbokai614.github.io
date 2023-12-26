import { navbar } from "vuepress-theme-hope";

export default navbar([
  "/",
  {
    text: "Go",
    icon: "devicon:go-wordmark",
    prefix: "/go/",
    children: [

    ],
  },
  {
    text: "NATS",
    icon: "logos:nats-icon",
    prefix: "/nats/",
    link: "/nats/",
  },
  {
    text: "C",
    icon: "skill-icons:c",
    prefix: "/c/",
    children: [

    ],
  },
  {
    text: "Javascript",
    icon: "devicon:javascript",
    prefix: "/javascript/",
    children: [

    ],
  },
  {
    text: "Database",
    icon: "solar:database-bold-duotone",
    prefix: "/database/",
    link: "/database/",
  },
  {
    text: "Math",
    icon: "fluent:math-formula-24-filled",
    prefix: "/math/",
    children: [

    ],
  },
  {
    text: "Event",
    icon: "carbon:event",
    prefix: "/event/",
    children: [

    ],
  },
  {
    text: "All",
    icon: "icon-park-solid:more-four",
    link: "/article/"
  },
]);