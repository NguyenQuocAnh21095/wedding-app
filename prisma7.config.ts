import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    // Migrations need a direct (non-pooled) connection to Neon.
    // Plain process.env (not the strict `env()` helper) so `prisma generate`
    // — which needs no DB connection — still works in build environments
    // (e.g. Vercel) where only DATABASE_URL, not DIRECT_URL, is configured.
    url: process.env.DIRECT_URL ?? process.env.DATABASE_URL,
  },
});
