import { sidebar } from "vuepress-theme-hope";

export default sidebar({
  "/": [
    "",
    "intro",
    {
      text: "Go",
      icon: "devicon:go-wordmark",
      prefix: "go/",
      link: "go/",
      children: [
        {
          text: "Slices",
          icon: "game-icons:sliced-bread",
          link: "slices",
        },
        {
          text: "Channel",
          icon: "fluent:channel-share-16-regular",
          link: "channel",
        },
        {
          text: "Container",
          icon: "lucide:container",
          link: "container",
        },
        {
          text: "I/O",
          icon: "flat-color-icons:print",
          link: "io",
        },
        {
          text: "OS",
          icon: "game-icons:planet-core",
          link: "os",
        },
        {
          text: "Sort",
          icon: "lets-icons:sort-random-light",
          link: "sort",
        },
      ],
    },
    {
      text: "NATS",
      icon: "logos:nats-icon",
      prefix: "nats/",
      link: "nats/",
      children: [
        {
          text: "Core",
          icon: "logos:nats-icon",
          link: "core",
        },
        {
          text: "JetStream",
          icon: "game-icons:splashy-stream",
          link: "jetstream",
        },
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
      link: "database/",
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
