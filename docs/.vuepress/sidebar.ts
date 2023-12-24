import { sidebar } from "vuepress-theme-hope";

export default sidebar({
  "/": [
    "",
    "intro",
    {
      text: "Go",
      icon: "devicon:go-wordmark",
      prefix: "go/",
      children: [
      ],
    },
    {
      text: "NATS",
      icon: "logos:nats-icon",
      prefix: "nats/",
      children: [
      ],
    },
    {
      text: "C",
      icon: "skill-icons:c",
      prefix: "c/",
      children: [
      ],
    },
    {
      text: "Javascript",
      icon: "devicon:javascript",
      prefix: "c/",
      children: [
      ],
    },
    {
      text: "Database",
      icon: "solar:database-bold-duotone",
      prefix: "database/",
      children: [
        {
          text: "MySQL",
          icon: "skill-icons:mysql-dark",
          link: "mysql",
        },
        {
          text: "MongoDB",
          icon: "skill-icons:mongodb",
          link: "mongo",
        },
      ],
    },
    {
      text: "Math",
      icon: "fluent:math-formula-24-filled",
      prefix: "math/",
      children: [
  
      ],
    },
    {
      text: "Event",
      icon: "carbon:event",
      prefix: "event/",
      children: [
  
      ],
    },
    {
      text: "More",
      icon: "mdi:more-horiz",
      link: "more",
    },
  ],
});
