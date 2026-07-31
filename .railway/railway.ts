import { defineRailway, github, mysql, preserve, project, service } from "railway/iac";

export default defineRailway(() => {
  const db = mysql("MySQL");

  const backend = service("backend", {
    source: github("kalamkarkrushna/Hospital-Management-System", {
      rootDirectory: "backend",
    }),
    replicas: 1,
    env: {
      JWT_SECRET: preserve(),
      MYSQLHOST: db.env.MYSQLHOST,
      MYSQLPORT: db.env.MYSQLPORT,
      MYSQLDATABASE: db.env.MYSQLDATABASE,
      MYSQLUSER: db.env.MYSQLUSER,
      MYSQLPASSWORD: db.env.MYSQLPASSWORD,
    },
  });

  const frontend = service("frontend", {
    source: github("kalamkarkrushna/Hospital-Management-System", {
      rootDirectory: "frontend",
    }),
    replicas: 1,
    env: {
      VITE_API_URL: preserve(),
    },
  });

  return project("hms", {
    resources: [db, backend, frontend],
  });
});
